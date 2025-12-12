import httpx
import feedparser
from typing import List, Dict, Any
from datetime import datetime
from bs4 import BeautifulSoup
from .base import BaseCollector

class PodcastCollector(BaseCollector):
    """팟캐스트 수집기"""
    
    source_type = "podcast"
    
    # AI/Tech 관련 인기 팟캐스트 RSS
    PODCASTS = {
        "ko": [
            ("요즘IT", "https://yozm.wishket.com/magazine/feed/"),
            ("EO 이오", "https://www.youtube.com/feeds/videos.xml?channel_id=UCQ2DWm5Md16Dc3xRwwhVE7Q"),
        ],
        "en": [
            ("Lex Fridman Podcast", "https://lexfridman.com/feed/podcast/"),
            ("The AI Podcast (NVIDIA)", "https://feeds.soundcloud.com/users/soundcloud:users:264034133/sounds.rss"),
            ("Practical AI", "https://changelog.com/practicalai/feed"),
            ("Machine Learning Street Talk", "https://anchor.fm/s/1e4a0eac/podcast/rss"),
            ("The TWIML AI Podcast", "https://twimlai.com/feed/"),
            ("Gradient Dissent", "https://feeds.soundcloud.com/users/soundcloud:users:777159189/sounds.rss"),
            ("AI in Business", "https://emerj.com/feed/podcast/"),
        ]
    }
    
    async def search(self, keyword: str, language: str = "ko", limit: int = 10) -> List[Dict[str, Any]]:
        """팟캐스트에서 키워드 관련 에피소드 검색"""
        
        results = []
        podcasts = self.PODCASTS.get(language, self.PODCASTS["en"])
        keyword_lower = keyword.lower()
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            for source_name, feed_url in podcasts:
                try:
                    response = await client.get(feed_url, headers={
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
                    })
                    feed = feedparser.parse(response.text)
                    
                    for entry in feed.entries[:10]:
                        title = entry.get("title", "")
                        summary = entry.get("summary", entry.get("description", ""))
                        
                        # 키워드 매칭
                        if keyword_lower in title.lower() or keyword_lower in summary.lower():
                            published = None
                            if hasattr(entry, "published_parsed") and entry.published_parsed:
                                published = datetime(*entry.published_parsed[:6])
                            
                            # 30일 이내만
                            if published and (datetime.utcnow() - published).days > 30:
                                continue
                            
                            clean_summary = BeautifulSoup(summary, "html.parser").get_text()
                            
                            # 오디오 URL 추출
                            audio_url = ""
                            if hasattr(entry, "enclosures") and entry.enclosures:
                                for enc in entry.enclosures:
                                    if "audio" in enc.get("type", ""):
                                        audio_url = enc.get("href", enc.get("url", ""))
                                        break
                            
                            # 에피소드 길이 추출
                            duration = entry.get("itunes_duration", "")
                            
                            results.append({
                                "title": self._clean_text(title),
                                "url": entry.get("link", audio_url),
                                "source_type": self.source_type,
                                "source_name": source_name,
                                "language": language,
                                "thumbnail_url": self._get_thumbnail(entry, feed),
                                "description": f"[{duration}] {self._clean_text(clean_summary)[:500]}" if duration else self._clean_text(clean_summary)[:500],
                                "content_text": self._clean_text(clean_summary),
                                "published_at": published
                            })
                            
                except Exception as e:
                    print(f"팟캐스트 피드 오류 ({source_name}): {e}")
                    continue
        
        # iTunes Podcast 검색 추가
        itunes_results = await self._search_itunes(keyword, language, limit // 2)
        results.extend(itunes_results)
        
        # 중복 제거 및 정렬
        seen_urls = set()
        unique_results = []
        for r in results:
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                unique_results.append(r)
        
        unique_results.sort(key=lambda x: x.get("published_at") or datetime.min, reverse=True)
        
        return unique_results[:limit]
    
    async def _search_itunes(self, keyword: str, language: str, limit: int) -> List[Dict[str, Any]]:
        """iTunes Podcast API 검색"""
        results = []
        
        try:
            country = "kr" if language == "ko" else "us"
            url = f"https://itunes.apple.com/search?term={keyword}&media=podcast&entity=podcastEpisode&limit={limit}&country={country}"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    for item in data.get("results", []):
                        # 발행일 파싱
                        published = None
                        release_date = item.get("releaseDate", "")
                        if release_date:
                            try:
                                published = datetime.strptime(release_date[:19], "%Y-%m-%dT%H:%M:%S")
                            except:
                                pass
                        
                        # 30일 이내만
                        if published and (datetime.utcnow() - published).days > 30:
                            continue
                        
                        results.append({
                            "title": item.get("trackName", ""),
                            "url": item.get("trackViewUrl", item.get("episodeUrl", "")),
                            "source_type": self.source_type,
                            "source_name": item.get("collectionName", "iTunes Podcast"),
                            "language": language,
                            "thumbnail_url": item.get("artworkUrl600", item.get("artworkUrl100", "")),
                            "description": item.get("description", "")[:500],
                            "content_text": item.get("description", ""),
                            "published_at": published
                        })
                        
        except Exception as e:
            print(f"iTunes 검색 오류: {e}")
        
        return results
    
    def _get_thumbnail(self, entry, feed) -> str:
        """팟캐스트 썸네일 추출"""
        
        # 에피소드 이미지
        if hasattr(entry, "image") and entry.image:
            if isinstance(entry.image, dict):
                return entry.image.get("href", "")
            return str(entry.image)
        
        # iTunes 이미지
        if hasattr(entry, "itunes_image"):
            if isinstance(entry.itunes_image, dict):
                return entry.itunes_image.get("href", "")
        
        # 피드 전체 이미지
        if hasattr(feed, "feed") and hasattr(feed.feed, "image"):
            if isinstance(feed.feed.image, dict):
                return feed.feed.image.get("href", "")
        
        return ""
