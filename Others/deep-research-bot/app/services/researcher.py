from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
import asyncio
import json

from app.models.database import Keyword, Content, ResearchLog, async_session
from app.services.collectors import (
    YouTubeCollector,
    NewsCollector,
    BlogCollector,
    PaperCollector,
    PodcastCollector
)
from app.services.analyzer import analyzer
from app.config import settings

class DeepResearcher:
    """딥 리서치 서비스 - 키워드 기반 콘텐츠 수집 및 분석"""
    
    def __init__(self):
        self.collectors = {
            "youtube": YouTubeCollector(),
            "news": NewsCollector(),
            "blog": BlogCollector(),
            "paper": PaperCollector(),
            "podcast": PodcastCollector()
        }
        self.languages = ["ko", "en"]
    
    async def run_daily_research(self) -> Dict[str, Any]:
        """일일 리서치 실행"""
        
        async with async_session() as session:
            # 리서치 로그 시작
            log = ResearchLog(status="running")
            session.add(log)
            await session.commit()
            await session.refresh(log)
            
            try:
                # 활성화된 키워드 가져오기
                result = await session.execute(
                    select(Keyword).where(Keyword.is_active == True)
                )
                keywords = result.scalars().all()
                
                if not keywords:
                    log.status = "completed"
                    log.completed_at = datetime.utcnow()
                    log.error_message = "활성화된 키워드가 없습니다."
                    await session.commit()
                    return {"status": "no_keywords", "message": "활성화된 키워드가 없습니다."}
                
                total_found = 0
                total_analyzed = 0
                
                # 각 키워드별로 리서치 수행
                for keyword in keywords:
                    found, analyzed = await self._research_keyword(session, keyword)
                    total_found += found
                    total_analyzed += analyzed
                
                # 로그 완료
                log.status = "completed"
                log.completed_at = datetime.utcnow()
                log.total_found = total_found
                log.total_analyzed = total_analyzed
                await session.commit()
                
                return {
                    "status": "success",
                    "total_found": total_found,
                    "total_analyzed": total_analyzed,
                    "keywords_processed": len(keywords)
                }
                
            except Exception as e:
                log.status = "failed"
                log.completed_at = datetime.utcnow()
                log.error_message = str(e)
                await session.commit()
                raise e
    
    async def _research_keyword(self, session: AsyncSession, keyword: Keyword) -> tuple:
        """단일 키워드에 대한 리서치 수행"""
        
        found_count = 0
        analyzed_count = 0
        
        # 각 소스 유형별로 수집
        for source_type, collector in self.collectors.items():
            for language in self.languages:
                try:
                    # 콘텐츠 수집
                    contents = await collector.search(
                        keyword=keyword.name,
                        language=language,
                        limit=10
                    )
                    
                    for content_data in contents:
                        # 중복 체크
                        existing = await session.execute(
                            select(Content).where(Content.url == content_data["url"])
                        )
                        if existing.scalars().first():
                            continue
                        
                        # 콘텐츠 저장
                        content = Content(
                            keyword_id=keyword.id,
                            title=content_data["title"],
                            url=content_data["url"],
                            source_type=source_type,
                            source_name=content_data.get("source_name", ""),
                            language=language,
                            thumbnail_url=content_data.get("thumbnail_url"),
                            description=content_data.get("description", ""),
                            content_text=content_data.get("content_text", ""),
                            published_at=content_data.get("published_at")
                        )
                        session.add(content)
                        found_count += 1
                        
                except Exception as e:
                    print(f"수집 오류 ({source_type}/{language}/{keyword.name}): {e}")
                    continue
        
        await session.commit()
        
        # 수집된 콘텐츠 분석 (아직 분석되지 않은 것만)
        result = await session.execute(
            select(Content).where(
                and_(
                    Content.keyword_id == keyword.id,
                    Content.is_analyzed == False
                )
            ).options(selectinload(Content.keyword))
        )
        unanalyzed = result.scalars().all()
        
        for content in unanalyzed:
            try:
                # AI 분석
                analysis = await analyzer.analyze_content(
                    title=content.title,
                    content=content.content_text or content.description or "",
                    source_type=content.source_type,
                    keyword=keyword.name,
                    language=content.language
                )
                
                # 분석 결과 저장
                content.ai_summary = analysis["summary"]
                content.ai_insights = json.dumps(analysis["insights"], ensure_ascii=False)
                content.ai_business_relevance = analysis["business_relevance"]
                content.ai_share_score = analysis["share_score"]
                content.ai_share_reason = analysis["share_reason"]
                content.is_analyzed = True
                
                analyzed_count += 1
                
                # Rate limiting
                await asyncio.sleep(0.5)
                
            except Exception as e:
                print(f"분석 오류 ({content.title}): {e}")
                continue
        
        await session.commit()
        
        return found_count, analyzed_count
    
    async def research_single_keyword(self, keyword_id: int) -> Dict[str, Any]:
        """단일 키워드 리서치"""
        
        async with async_session() as session:
            result = await session.execute(
                select(Keyword).where(Keyword.id == keyword_id)
            )
            keyword = result.scalars().first()
            
            if not keyword:
                return {"status": "error", "message": "키워드를 찾을 수 없습니다."}
            
            found, analyzed = await self._research_keyword(session, keyword)
            
            return {
                "status": "success",
                "keyword": keyword.name,
                "found": found,
                "analyzed": analyzed
            }


# Singleton instance
researcher = DeepResearcher()
