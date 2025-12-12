import httpx
import feedparser
from typing import List, Dict, Any
from datetime import datetime, timedelta
from .base import BaseCollector

class PaperCollector(BaseCollector):
    """논문/리서치 페이퍼 수집기"""
    
    source_type = "paper"
    
    async def search(self, keyword: str, language: str = "ko", limit: int = 10) -> List[Dict[str, Any]]:
        """arXiv 및 Semantic Scholar에서 논문 검색"""
        
        results = []
        
        # arXiv 검색
        arxiv_results = await self._search_arxiv(keyword, limit)
        results.extend(arxiv_results)
        
        # Papers With Code (인기 논문)
        pwc_results = await self._search_papers_with_code(keyword, limit // 2)
        results.extend(pwc_results)
        
        # 중복 제거
        seen_urls = set()
        unique_results = []
        for r in results:
            if r["url"] not in seen_urls:
                seen_urls.add(r["url"])
                unique_results.append(r)
        
        unique_results.sort(key=lambda x: x.get("published_at") or datetime.min, reverse=True)
        
        return unique_results[:limit]
    
    async def _search_arxiv(self, keyword: str, limit: int) -> List[Dict[str, Any]]:
        """arXiv API를 통한 논문 검색"""
        results = []
        
        try:
            # arXiv API
            search_query = f"all:{keyword}"
            url = f"http://export.arxiv.org/api/query?search_query={search_query}&start=0&max_results={limit}&sortBy=submittedDate&sortOrder=descending"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url)
                feed = feedparser.parse(response.text)
                
                for entry in feed.entries:
                    # 발행일 추출
                    published = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        published = datetime(*entry.published_parsed[:6])
                    
                    # 30일 이내 논문만
                    if published and (datetime.utcnow() - published).days > 30:
                        continue
                    
                    # 저자 추출
                    authors = []
                    if hasattr(entry, "authors"):
                        authors = [a.get("name", "") for a in entry.authors[:3]]
                    author_str = ", ".join(authors)
                    if len(entry.authors) > 3:
                        author_str += f" 외 {len(entry.authors) - 3}명"
                    
                    # arXiv ID로 PDF URL 생성
                    arxiv_id = entry.id.split("/abs/")[-1]
                    pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
                    
                    # 카테고리 추출
                    categories = []
                    if hasattr(entry, "tags"):
                        categories = [t.get("term", "") for t in entry.tags[:3]]
                    
                    results.append({
                        "title": self._clean_text(entry.get("title", "")),
                        "url": entry.get("link", ""),
                        "source_type": self.source_type,
                        "source_name": f"arXiv ({', '.join(categories)})",
                        "language": "en",  # arXiv는 주로 영어
                        "thumbnail_url": None,
                        "description": f"저자: {author_str}\n\n{self._clean_text(entry.get('summary', ''))}",
                        "content_text": self._clean_text(entry.get("summary", "")),
                        "published_at": published
                    })
                    
        except Exception as e:
            print(f"arXiv 검색 오류: {e}")
        
        return results
    
    async def _search_papers_with_code(self, keyword: str, limit: int) -> List[Dict[str, Any]]:
        """Papers With Code에서 인기 논문 검색"""
        results = []
        
        try:
            # Papers With Code API
            url = f"https://paperswithcode.com/api/v1/papers/?q={keyword}&items_per_page={limit}"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    for paper in data.get("results", []):
                        published = None
                        if paper.get("published"):
                            try:
                                published = datetime.strptime(paper["published"], "%Y-%m-%d")
                            except:
                                pass
                        
                        # 30일 이내만
                        if published and (datetime.utcnow() - published).days > 30:
                            continue
                        
                        results.append({
                            "title": paper.get("title", ""),
                            "url": paper.get("url_abs", paper.get("paper_url", "")),
                            "source_type": self.source_type,
                            "source_name": "Papers With Code",
                            "language": "en",
                            "thumbnail_url": None,
                            "description": paper.get("abstract", "")[:500],
                            "content_text": paper.get("abstract", ""),
                            "published_at": published
                        })
                        
        except Exception as e:
            print(f"Papers With Code 검색 오류: {e}")
        
        return results

