from openai import AsyncOpenAI
from app.config import settings
import json
from typing import Dict, Any, Optional

class AIAnalyzer:
    """OpenAI를 사용한 콘텐츠 분석기"""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"
    
    async def analyze_content(
        self, 
        title: str, 
        content: str, 
        source_type: str,
        keyword: str,
        language: str = "ko"
    ) -> Dict[str, Any]:
        """콘텐츠를 분석하여 요약, 인사이트, 비즈니스 연관성, 공유 점수를 반환"""
        
        lang_instruction = "한국어로 답변해주세요." if language == "ko" else "Please respond in English."
        
        prompt = f"""
당신은 CEO에게 공유할 가치가 있는 콘텐츠를 분석하는 전문가입니다.

## 분석 대상
- **제목**: {title}
- **유형**: {source_type}
- **관련 키워드**: {keyword}
- **내용**:
{content[:4000]}

## 분석 요청
다음 4가지 관점에서 분석해주세요:

1. **요약 (summary)**: 핵심 내용을 3-4문장으로 요약
2. **핵심 인사이트 (insights)**: 비즈니스/기술적 관점에서 중요한 포인트 3-5개 (배열)
3. **비즈니스 연관성 (business_relevance)**: AI/Agent 기술을 활용하는 스타트업이나 기업에게 이 콘텐츠가 왜 중요한지 2-3문장으로 설명
4. **공유 가치 점수 (share_score)**: 0-100점으로 슬랙 채널에 공유할 가치를 평가
   - 80-100: 반드시 공유해야 함 (획기적인 인사이트, 최신 트렌드)
   - 60-79: 공유 추천 (유용한 정보)
   - 40-59: 선택적 공유 (일반적인 정보)
   - 0-39: 공유 비추천 (오래된 정보, 중복 내용)
5. **공유 이유 (share_reason)**: 해당 점수를 준 이유를 1-2문장으로 설명

{lang_instruction}

## 응답 형식 (JSON)
```json
{{
    "summary": "...",
    "insights": ["인사이트1", "인사이트2", "인사이트3"],
    "business_relevance": "...",
    "share_score": 85,
    "share_reason": "..."
}}
```
"""
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert content analyst. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return {
                "summary": result.get("summary", ""),
                "insights": result.get("insights", []),
                "business_relevance": result.get("business_relevance", ""),
                "share_score": float(result.get("share_score", 50)),
                "share_reason": result.get("share_reason", "")
            }
            
        except Exception as e:
            print(f"AI 분석 오류: {e}")
            return {
                "summary": "분석 실패",
                "insights": [],
                "business_relevance": "",
                "share_score": 0,
                "share_reason": f"분석 중 오류 발생: {str(e)}"
            }
    
    async def generate_daily_digest(self, contents: list) -> str:
        """일일 콘텐츠 다이제스트 생성"""
        
        if not contents:
            return "오늘 수집된 콘텐츠가 없습니다."
        
        content_summaries = "\n".join([
            f"- [{c['source_type']}] {c['title']} (점수: {c['ai_share_score']})"
            for c in contents[:20]
        ])
        
        prompt = f"""
오늘 수집된 AI/Agent 관련 콘텐츠를 기반으로 CEO를 위한 일일 다이제스트를 작성해주세요.

## 수집된 콘텐츠 목록:
{content_summaries}

## 요청사항:
1. 오늘의 주요 트렌드 요약 (3-5줄)
2. 가장 주목할 만한 콘텐츠 TOP 3 선정 및 이유
3. CEO가 알아야 할 액션 아이템 (있다면)

한국어로 작성해주세요.
"""
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an executive briefing specialist."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"다이제스트 생성 실패: {str(e)}"


# Singleton instance
analyzer = AIAnalyzer()

