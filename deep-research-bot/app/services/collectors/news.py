import httpx
import feedparser
from typing import List, Dict, Any
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from .base import BaseCollector

class NewsCollector(BaseCollector):
    """뉴스 기사 수집기"""
    
    source_type = "news"
    
    # 주요 뉴스 RSS 피드
    RSS_FEEDS = {
        "ko": [
            ("조선일보 IT", "https://www.chosun.com/arc/outboundfeeds/rss/category/it-science/?outputType=xml"),
            ("한경 IT", "https://www.hankyung.com/feed/it"),
            ("전자신문", "https://rss.etnews.com/Section901.xml"),
            ("ZDNet Korea", "https://zdnet.co.kr/rss/all_news.xml"),
            ("AI타임스", "https://www.aitimes.com/rss/allArticle.xml"),
        ],
        "en": [
            ("TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"),
            ("VentureBeat AI", "https://venturebeat.com/category/ai/feed/"),
            ("The Verge AI", "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"),
            ("Wired AI", "https://www.wired.com/feed/tag/ai/latest/rss"),
            ("MIT Tech Review", "https://www.technologyreview.com/feed/"),
        ]
    }
    
    async def search(self, keyword: str, language: str = "ko", limit: int = 10) -> List[Dict[str, Any]]:
        """뉴스 RSS 피드에서 키워드 관련 기사 검색"""
        
        results = []
        feeds = self.RSS_FEEDS.get(language, self.RSS_FEEDS["en"])
        keyword_lower = keyword.lower()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            for source_name, feed_url in feeds:
                try:
                    response = await client.get(feed_url, headers={
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                    })
                    feed = feedparser.parse(response.text)
                    
                    for entry in feed.entries[:20]:  # 각 피드에서 최근 20개
                        title = entry.get("title", "")
                        summary = entry.get("summary", entry.get("description", ""))
                        
                        # 키워드 매칭 (대소문자 무시)
                        if keyword_lower in title.lower() or keyword_lower in summary.lower():
                            published = None
                            if hasattr(entry, "published_parsed") and entry.published_parsed:
                                published = datetime(*entry.published_parsed[:6])
                            elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
                                published = datetime(*entry.updated_parsed[:6])
                            else:
                                published = datetime.utcnow()
                            
                            # 7일 이내 기사만
                            if published and (datetime.utcnow() - published).days <= 7:
                                # HTML 태그 제거
                                clean_summary = BeautifulSoup(summary, "html.parser").get_text()
                                
                                results.append({
                                    "title": self._clean_text(title),
                                    "url": entry.get("link", ""),
                                    "source_type": self.source_type,
                                    "source_name": source_name,
                                    "language": language,
                                    "thumbnail_url": self._get_thumbnail(entry),
                                    "description": self._clean_text(clean_summary)[:500],
                                    "content_text": "",  # 본문은 별도로 가져옴
                                    "published_at": published
                                })
                                
                except Exception as e:
                    print(f"뉴스 피드 오류 ({source_name}): {e}")
                    continue
        
        # Google News 검색 추가
        google_results = await self._search_google_news(keyword, language, limit // 2)
        results.extend(google_results)
        
        # 중복 제거 및 정렬
        seen_urls = set()
        unique_results = []
        for r in results:
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                unique_results.append(r)
        
        # 최신순 정렬
        unique_results.sort(key=lambda x: x.get("published_at") or datetime.min, reverse=True)
        
        return unique_results[:limit]
    
    async def _search_google_news(self, keyword: str, language: str, limit: int) -> List[Dict[str, Any]]:
        """Google News RSS 검색"""
        results = []
        
        try:
            hl = "ko" if language == "ko" else "en"
            gl = "KR" if language == "ko" else "US"
            
            url = f"https://news.google.com/rss/search?q={keyword}&hl={hl}&gl={gl}&ceid={gl}:{hl}"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url)
                feed = feedparser.parse(response.text)
                
                for entry in feed.entries[:limit]:
                    published = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        published = datetime(*entry.published_parsed[:6])
                    
                    # 출처 추출
                    source_name = "Google News"
                    if " - " in entry.get("title", ""):
                        parts = entry["title"].rsplit(" - ", 1)
                        if len(parts) == 2:
                            source_name = parts[1]
                            entry["title"] = parts[0]
                    
                    results.append({
                        "title": self._clean_text(entry.get("title", "")),
                        "url": entry.get("link", ""),
                        "source_type": self.source_type,
                        "source_name": source_name,
                        "language": language,
                        "thumbnail_url": None,
                        "description": self._clean_text(entry.get("summary", ""))[:500],
                        "content_text": "",
                        "published_at": published
                    })
                    
        except Exception as e:
            print(f"Google News 검색 오류: {e}")
        
        return results
    
    def _get_thumbnail(self, entry) -> str:
        """RSS 엔트리에서 썸네일 추출"""
        
        # media:content
        if hasattr(entry, "media_content"):
            for media in entry.media_content:
                if media.get("type", "").startswith("image"):
                    return media.get("url", "")
        
        # enclosures
        if hasattr(entry, "enclosures"):
            for enc in entry.enclosures:
                if enc.get("type", "").startswith("image"):
                    return enc.get("href", enc.get("url", ""))
        
        # summary 내 이미지
        summary = entry.get("summary", "")
        if "<img" in summary:
            soup = BeautifulSoup(summary, "html.parser")
            img = soup.find("img")
            if img and img.get("src"):
                return img["src"]
        
        return ""
    
    async def get_article_content(self, url: str) -> str:
        """기사 본문 가져오기"""
        try:
            from newspaper import Article
            
            article = Article(url)
            article.download()
            article.parse()
            
            return article.text
            
        except Exception as e:
            print(f"기사 본문 가져오기 실패: {e}")
            return ""

