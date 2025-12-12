import httpx
from typing import List, Dict, Any
from datetime import datetime, timedelta
from .base import BaseCollector
from app.config import settings
import re

class YouTubeCollector(BaseCollector):
    """유튜브 영상 수집기"""
    
    source_type = "youtube"
    
    def __init__(self):
        self.api_key = settings.youtube_api_key
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    async def search(self, keyword: str, language: str = "ko", limit: int = 10) -> List[Dict[str, Any]]:
        """유튜브에서 키워드로 영상 검색"""
        
        results = []
        
        # API 키가 없으면 대체 방법 사용
        if not self.api_key:
            return await self._search_without_api(keyword, language, limit)
        
        try:
            async with httpx.AsyncClient() as client:
                # 검색 쿼리
                region_code = "KR" if language == "ko" else "US"
                relevance_language = "ko" if language == "ko" else "en"
                
                params = {
                    "part": "snippet",
                    "q": keyword,
                    "type": "video",
                    "maxResults": limit,
                    "order": "date",
                    "publishedAfter": (datetime.utcnow() - timedelta(days=7)).isoformat() + "Z",
                    "regionCode": region_code,
                    "relevanceLanguage": relevance_language,
                    "key": self.api_key
                }
                
                response = await client.get(f"{self.base_url}/search", params=params)
                data = response.json()
                
                for item in data.get("items", []):
                    snippet = item.get("snippet", {})
                    video_id = item.get("id", {}).get("videoId")
                    
                    if not video_id:
                        continue
                    
                    results.append({
                        "title": snippet.get("title", ""),
                        "url": f"https://www.youtube.com/watch?v={video_id}",
                        "source_type": self.source_type,
                        "source_name": snippet.get("channelTitle", "YouTube"),
                        "language": language,
                        "thumbnail_url": snippet.get("thumbnails", {}).get("high", {}).get("url"),
                        "description": snippet.get("description", ""),
                        "content_text": "",  # 트랜스크립트는 별도로 가져옴
                        "published_at": self._parse_date(snippet.get("publishedAt", ""))
                    })
                    
        except Exception as e:
            print(f"YouTube API 오류: {e}")
            return await self._search_without_api(keyword, language, limit)
        
        return results
    
    async def _search_without_api(self, keyword: str, language: str, limit: int) -> List[Dict[str, Any]]:
        """API 키 없이 RSS 피드를 통한 검색 (제한적)"""
        results = []
        
        try:
            import feedparser
            
            # 유튜브 RSS 피드 URL (채널별로만 가능)
            # 키워드 검색은 제한적이므로 빈 결과 반환
            # 실제로는 YouTube Data API 사용 권장
            
            search_url = f"https://www.youtube.com/results?search_query={keyword}"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(search_url, headers={
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                })
                html = response.text
                
                # 간단한 파싱으로 비디오 ID 추출
                video_ids = re.findall(r'watch\?v=([a-zA-Z0-9_-]{11})', html)
                video_ids = list(dict.fromkeys(video_ids))[:limit]  # 중복 제거
                
                for vid in video_ids:
                    results.append({
                        "title": f"YouTube Video ({vid})",  # 제목은 별도 API 필요
                        "url": f"https://www.youtube.com/watch?v={vid}",
                        "source_type": self.source_type,
                        "source_name": "YouTube",
                        "language": language,
                        "thumbnail_url": f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
                        "description": "",
                        "content_text": "",
                        "published_at": datetime.utcnow()
                    })
                    
        except Exception as e:
            print(f"YouTube 대체 검색 오류: {e}")
        
        return results
    
    async def get_transcript(self, video_id: str, language: str = "ko") -> str:
        """비디오 자막/트랜스크립트 가져오기"""
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # 한국어 또는 영어 자막 찾기
            try:
                transcript = transcript_list.find_transcript([language, 'en', 'ko'])
            except:
                transcript = transcript_list.find_generated_transcript([language, 'en', 'ko'])
            
            text_parts = [entry['text'] for entry in transcript.fetch()]
            return " ".join(text_parts)
            
        except Exception as e:
            print(f"트랜스크립트 가져오기 실패: {e}")
            return ""

