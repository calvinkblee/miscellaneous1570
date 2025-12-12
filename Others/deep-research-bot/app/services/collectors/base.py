from abc import ABC, abstractmethod
from typing import List, Dict, Any
from datetime import datetime

class BaseCollector(ABC):
    """콘텐츠 수집기 베이스 클래스"""
    
    source_type: str = "unknown"
    
    @abstractmethod
    async def search(self, keyword: str, language: str = "ko", limit: int = 10) -> List[Dict[str, Any]]:
        """
        키워드로 콘텐츠 검색
        
        Returns:
            List of content dictionaries with fields:
            - title: str
            - url: str
            - source_type: str
            - source_name: str
            - language: str
            - thumbnail_url: Optional[str]
            - description: Optional[str]
            - content_text: Optional[str]
            - published_at: Optional[datetime]
        """
        pass
    
    def _parse_date(self, date_str: str) -> datetime:
        """날짜 문자열 파싱"""
        formats = [
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d",
            "%Y/%m/%d",
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        return datetime.utcnow()
    
    def _clean_text(self, text: str) -> str:
        """텍스트 정리"""
        if not text:
            return ""
        return " ".join(text.split())
