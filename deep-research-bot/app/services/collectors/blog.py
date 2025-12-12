import httpx
import feedparser
from typing import List, Dict, Any
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from .base import BaseCollector

class BlogCollector(BaseCollector):
    """블로그/미디엄 글 수집기"""
    
    source_type = "blog"
    
    # 주요 기술 블로그 RSS 피드
    TECH_BLOGS = {
        "ko": [
            ("카카오 AI", "https://tech.kakao.com/feed/"),
            ("네이버 D2", "https://d2.naver.com/d2.atom"),
            ("라인 엔지니어링", "https://techblog.lycorp.co.jp/ko/feed/index.xml"),
            ("우아한형제들", "https://techblog.woowahan.com/feed/"),
            ("당근마켓", "https://medium.com/feed/daangn"),
            ("토스 기술블로그", "https://toss.tech/rss.xml"),
        ],
        "en": [
            ("OpenAI Blog", "https://openai.com/blog/rss/"),
            ("Google AI Blog", "https://blog.google/technology/ai/rss/"),
            ("Meta AI", "https://ai.facebook.com/blog/rss/"),
            ("Anthropic", "https://www.anthropic.com/feed.xml"),
            ("Hugging Face", "https://huggingface.co/blog/feed.xml"),
            ("Towards Data Science", "https://towardsdatascience.com/feed"),
        ]
    }
    
    async def search(self, keyword: str, language: str = "ko", limit: int = 10) -> List[Dict[str, Any]]:
        """블로그에서 키워드 관련 글 검색"""
        
        results = []
        blogs = self.TECH_BLOGS.get(language, self.TECH_BLOGS["en"])
        keyword_lower = keyword.lower()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            for source_name, feed_url in blogs:
                try:
                    response = await client.get(feed_url, headers={
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                    })
                    feed = feedparser.parse(response.text)
                    
                    for entry in feed.entries[:15]:
                        title = entry.get("title", "")
                        summary = entry.get("summary", entry.get("content", [{}])[0].get("value", "") if entry.get("content") else "")
                        
                        # 키워드 매칭
                        if keyword_lower in title.lower() or keyword_lower in summary.lower():
                            published = self._extract_published_date(entry)
                            
                            # 30일 이내 글만 (블로그는 좀 더 넓게)
                            if published and (datetime.utcnow() - published).days <= 30:
                                clean_summary = BeautifulSoup(summary, "html.parser").get_text()
                                
                                results.append({
                                    "title": self._clean_text(title),
                                    "url": entry.get("link", ""),
                                    "source_type": self.source_type,
                                    "source_name": source_name,
                                    "language": language,
                                    "thumbnail_url": self._get_thumbnail(entry),
                                    "description": self._clean_text(clean_summary)[:500],
                                    "content_text": self._clean_text(clean_summary),
                                    "published_at": published
                                })
                                
                except Exception as e:
                    print(f"블로그 피드 오류 ({source_name}): {e}")
                    continue
        
        # Medium 검색 추가
        medium_results = await self._search_medium(keyword, language, limit // 2)
        results.extend(medium_results)
        
        # 중복 제거 및 정렬
        seen_urls = set()
        unique_results = []
        for r in results:
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                unique_results.append(r)
        
        unique_results.sort(key=lambda x: x.get("published_at") or datetime.min, reverse=True)
        
        return unique_results[:limit]
    
    async def _search_medium(self, keyword: str, language: str, limit: int) -> List[Dict[str, Any]]:
        """Medium 태그 기반 검색"""
        results = []
        
        try:
            # Medium 태그 피드
            tag = keyword.lower().replace(" ", "-")
            feed_url = f"https://medium.com/feed/tag/{tag}"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(feed_url, headers={
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                })
                feed = feedparser.parse(response.text)
                
                for entry in feed.entries[:limit]:
                    published = self._extract_published_date(entry)
                    summary = entry.get("summary", "")
                    clean_summary = BeautifulSoup(summary, "html.parser").get_text()
                    
                    # 작성자 추출
                    author = entry.get("author", "Unknown")
                    
                    results.append({
                        "title": self._clean_text(entry.get("title", "")),
                        "url": entry.get("link", ""),
                        "source_type": self.source_type,
                        "source_name": f"Medium - {author}",
                        "language": language,
                        "thumbnail_url": self._get_thumbnail(entry),
                        "description": self._clean_text(clean_summary)[:500],
                        "content_text": self._clean_text(clean_summary),
                        "published_at": published
                    })
                    
        except Exception as e:
            print(f"Medium 검색 오류: {e}")
        
        return results
    
    def _extract_published_date(self, entry) -> datetime:
        """RSS 엔트리에서 발행일 추출"""
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            return datetime(*entry.published_parsed[:6])
        elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
            return datetime(*entry.updated_parsed[:6])
        return datetime.utcnow()
    
    def _get_thumbnail(self, entry) -> str:
        """RSS 엔트리에서 썸네일 추출"""
        
        # media:content
        if hasattr(entry, "media_content"):
            for media in entry.media_content:
                if media.get("type", "").startswith("image"):
                    return media.get("url", "")
        
        # media:thumbnail
        if hasattr(entry, "media_thumbnail"):
            for thumb in entry.media_thumbnail:
                return thumb.get("url", "")
        
        # content 내 이미지
        content = entry.get("summary", "")
        if entry.get("content"):
            content = entry["content"][0].get("value", "")
        
        if "<img" in content:
            soup = BeautifulSoup(content, "html.parser")
            img = soup.find("img")
            if img and img.get("src"):
                return img["src"]
        
        return ""

