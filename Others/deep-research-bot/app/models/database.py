from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from datetime import datetime
import json

Base = declarative_base()

class Keyword(Base):
    """연구 키워드 모델"""
    __tablename__ = "keywords"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    contents = relationship("Content", back_populates="keyword")
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }


class Content(Base):
    """수집된 콘텐츠 모델"""
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    keyword_id = Column(Integer, ForeignKey("keywords.id"), nullable=False)
    
    # 기본 정보
    title = Column(String(500), nullable=False)
    url = Column(String(1000), nullable=False, unique=True)
    source_type = Column(String(50), nullable=False)  # youtube, news, blog, paper, podcast
    source_name = Column(String(200), nullable=True)  # 출처명
    language = Column(String(10), default="ko")  # ko, en
    thumbnail_url = Column(String(1000), nullable=True)
    
    # 원본 콘텐츠
    description = Column(Text, nullable=True)
    content_text = Column(Text, nullable=True)  # 본문 또는 transcript
    published_at = Column(DateTime, nullable=True)
    
    # AI 분석 결과
    ai_summary = Column(Text, nullable=True)
    ai_insights = Column(Text, nullable=True)  # JSON array
    ai_business_relevance = Column(Text, nullable=True)
    ai_share_score = Column(Float, nullable=True)  # 0-100
    ai_share_reason = Column(Text, nullable=True)
    
    # 메타데이터
    is_analyzed = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    is_shared = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    keyword = relationship("Keyword", back_populates="contents")
    
    def to_dict(self):
        return {
            "id": self.id,
            "keyword_id": self.keyword_id,
            "keyword_name": self.keyword.name if self.keyword else None,
            "title": self.title,
            "url": self.url,
            "source_type": self.source_type,
            "source_name": self.source_name,
            "language": self.language,
            "thumbnail_url": self.thumbnail_url,
            "description": self.description,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "ai_summary": self.ai_summary,
            "ai_insights": json.loads(self.ai_insights) if self.ai_insights else [],
            "ai_business_relevance": self.ai_business_relevance,
            "ai_share_score": self.ai_share_score,
            "ai_share_reason": self.ai_share_reason,
            "is_analyzed": self.is_analyzed,
            "is_starred": self.is_starred,
            "is_shared": self.is_shared,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ResearchLog(Base):
    """리서치 실행 로그"""
    __tablename__ = "research_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(20), default="running")  # running, completed, failed
    total_found = Column(Integer, default=0)
    total_analyzed = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "status": self.status,
            "total_found": self.total_found,
            "total_analyzed": self.total_analyzed,
            "error_message": self.error_message
        }


# Database initialization
from app.config import settings

engine = create_async_engine(settings.database_url, echo=settings.debug)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Add default keywords
    async with async_session() as session:
        from sqlalchemy import select
        result = await session.execute(select(Keyword))
        if not result.scalars().first():
            default_keywords = [
                Keyword(name="AI", description="인공지능 관련 콘텐츠"),
                Keyword(name="Agent", description="AI 에이전트 관련 콘텐츠"),
            ]
            session.add_all(default_keywords)
            await session.commit()

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
