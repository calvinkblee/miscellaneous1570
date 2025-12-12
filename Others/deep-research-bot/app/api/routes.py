from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.models.database import Keyword, Content, ResearchLog, get_session, async_session
from app.services.researcher import researcher
from app.services.analyzer import analyzer

router = APIRouter()

# ============ Pydantic Models ============

class KeywordCreate(BaseModel):
    name: str
    description: Optional[str] = None

class KeywordUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ContentFilter(BaseModel):
    source_type: Optional[str] = None
    language: Optional[str] = None
    min_score: Optional[float] = None
    keyword_id: Optional[int] = None
    is_starred: Optional[bool] = None

# ============ Keyword CRUD ============

@router.get("/keywords")
async def list_keywords():
    """키워드 목록 조회"""
    async with async_session() as session:
        result = await session.execute(
            select(Keyword).order_by(Keyword.created_at.desc())
        )
        keywords = result.scalars().all()
        return [k.to_dict() for k in keywords]

@router.post("/keywords")
async def create_keyword(data: KeywordCreate):
    """키워드 생성"""
    async with async_session() as session:
        # 중복 체크
        existing = await session.execute(
            select(Keyword).where(Keyword.name == data.name)
        )
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="이미 존재하는 키워드입니다.")
        
        keyword = Keyword(name=data.name, description=data.description)
        session.add(keyword)
        await session.commit()
        await session.refresh(keyword)
        return keyword.to_dict()

@router.get("/keywords/{keyword_id}")
async def get_keyword(keyword_id: int):
    """키워드 상세 조회"""
    async with async_session() as session:
        result = await session.execute(
            select(Keyword).where(Keyword.id == keyword_id)
        )
        keyword = result.scalars().first()
        if not keyword:
            raise HTTPException(status_code=404, detail="키워드를 찾을 수 없습니다.")
        return keyword.to_dict()

@router.put("/keywords/{keyword_id}")
async def update_keyword(keyword_id: int, data: KeywordUpdate):
    """키워드 수정"""
    async with async_session() as session:
        result = await session.execute(
            select(Keyword).where(Keyword.id == keyword_id)
        )
        keyword = result.scalars().first()
        if not keyword:
            raise HTTPException(status_code=404, detail="키워드를 찾을 수 없습니다.")
        
        if data.name is not None:
            keyword.name = data.name
        if data.description is not None:
            keyword.description = data.description
        if data.is_active is not None:
            keyword.is_active = data.is_active
        
        keyword.updated_at = datetime.utcnow()
        await session.commit()
        await session.refresh(keyword)
        return keyword.to_dict()

@router.delete("/keywords/{keyword_id}")
async def delete_keyword(keyword_id: int):
    """키워드 삭제"""
    async with async_session() as session:
        result = await session.execute(
            select(Keyword).where(Keyword.id == keyword_id)
        )
        keyword = result.scalars().first()
        if not keyword:
            raise HTTPException(status_code=404, detail="키워드를 찾을 수 없습니다.")
        
        await session.delete(keyword)
        await session.commit()
        return {"status": "success", "message": "키워드가 삭제되었습니다."}

# ============ Contents ============

@router.get("/contents")
async def list_contents(
    source_type: Optional[str] = None,
    language: Optional[str] = None,
    min_score: Optional[float] = None,
    keyword_id: Optional[int] = None,
    is_starred: Optional[bool] = None,
    is_analyzed: Optional[bool] = True,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    sort_by: str = "share_score"  # share_score, published_at, created_at
):
    """콘텐츠 목록 조회"""
    async with async_session() as session:
        query = select(Content).options(selectinload(Content.keyword))
        
        # 필터링
        conditions = []
        if source_type:
            conditions.append(Content.source_type == source_type)
        if language:
            conditions.append(Content.language == language)
        if min_score is not None:
            conditions.append(Content.ai_share_score >= min_score)
        if keyword_id:
            conditions.append(Content.keyword_id == keyword_id)
        if is_starred is not None:
            conditions.append(Content.is_starred == is_starred)
        if is_analyzed is not None:
            conditions.append(Content.is_analyzed == is_analyzed)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # 정렬
        if sort_by == "share_score":
            query = query.order_by(desc(Content.ai_share_score))
        elif sort_by == "published_at":
            query = query.order_by(desc(Content.published_at))
        else:
            query = query.order_by(desc(Content.created_at))
        
        # 페이징
        query = query.offset(offset).limit(limit)
        
        result = await session.execute(query)
        contents = result.scalars().all()
        
        return [c.to_dict() for c in contents]

@router.get("/contents/{content_id}")
async def get_content(content_id: int):
    """콘텐츠 상세 조회"""
    async with async_session() as session:
        result = await session.execute(
            select(Content)
            .where(Content.id == content_id)
            .options(selectinload(Content.keyword))
        )
        content = result.scalars().first()
        if not content:
            raise HTTPException(status_code=404, detail="콘텐츠를 찾을 수 없습니다.")
        return content.to_dict()

@router.post("/contents/{content_id}/star")
async def toggle_star(content_id: int):
    """콘텐츠 즐겨찾기 토글"""
    async with async_session() as session:
        result = await session.execute(
            select(Content).where(Content.id == content_id)
        )
        content = result.scalars().first()
        if not content:
            raise HTTPException(status_code=404, detail="콘텐츠를 찾을 수 없습니다.")
        
        content.is_starred = not content.is_starred
        await session.commit()
        return {"is_starred": content.is_starred}

@router.post("/contents/{content_id}/share")
async def mark_shared(content_id: int):
    """콘텐츠 공유 완료 표시"""
    async with async_session() as session:
        result = await session.execute(
            select(Content).where(Content.id == content_id)
        )
        content = result.scalars().first()
        if not content:
            raise HTTPException(status_code=404, detail="콘텐츠를 찾을 수 없습니다.")
        
        content.is_shared = True
        await session.commit()
        return {"is_shared": True}

# ============ Research ============

@router.post("/research/run")
async def run_research():
    """전체 리서치 실행"""
    try:
        result = await researcher.run_daily_research()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/research/keyword/{keyword_id}")
async def research_keyword(keyword_id: int):
    """특정 키워드 리서치"""
    try:
        result = await researcher.research_single_keyword(keyword_id)
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["message"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/research/logs")
async def get_research_logs(limit: int = 10):
    """리서치 로그 조회"""
    async with async_session() as session:
        result = await session.execute(
            select(ResearchLog)
            .order_by(desc(ResearchLog.started_at))
            .limit(limit)
        )
        logs = result.scalars().all()
        return [l.to_dict() for l in logs]

# ============ Dashboard Stats ============

@router.get("/stats")
async def get_stats():
    """대시보드 통계"""
    async with async_session() as session:
        # 총 콘텐츠 수
        total_contents = await session.execute(select(func.count(Content.id)))
        total_contents = total_contents.scalar()
        
        # 분석 완료 수
        analyzed_contents = await session.execute(
            select(func.count(Content.id)).where(Content.is_analyzed == True)
        )
        analyzed_contents = analyzed_contents.scalar()
        
        # 고득점 콘텐츠 수 (80점 이상)
        high_score_contents = await session.execute(
            select(func.count(Content.id)).where(Content.ai_share_score >= 80)
        )
        high_score_contents = high_score_contents.scalar()
        
        # 활성 키워드 수
        active_keywords = await session.execute(
            select(func.count(Keyword.id)).where(Keyword.is_active == True)
        )
        active_keywords = active_keywords.scalar()
        
        # 소스별 통계
        source_stats = await session.execute(
            select(Content.source_type, func.count(Content.id))
            .group_by(Content.source_type)
        )
        source_stats = {row[0]: row[1] for row in source_stats.all()}
        
        # 최근 7일 일별 수집량
        daily_stats = []
        for i in range(7):
            date = datetime.utcnow().date() - timedelta(days=i)
            count = await session.execute(
                select(func.count(Content.id)).where(
                    and_(
                        func.date(Content.created_at) == date
                    )
                )
            )
            daily_stats.append({
                "date": date.isoformat(),
                "count": count.scalar()
            })
        
        return {
            "total_contents": total_contents,
            "analyzed_contents": analyzed_contents,
            "high_score_contents": high_score_contents,
            "active_keywords": active_keywords,
            "source_stats": source_stats,
            "daily_stats": daily_stats[::-1]  # 오래된 것부터
        }

# ============ Digest ============

@router.get("/digest")
async def get_daily_digest():
    """오늘의 다이제스트 생성"""
    async with async_session() as session:
        # 오늘 수집된 고득점 콘텐츠
        today = datetime.utcnow().date()
        result = await session.execute(
            select(Content)
            .where(
                and_(
                    func.date(Content.created_at) == today,
                    Content.is_analyzed == True,
                    Content.ai_share_score >= 60
                )
            )
            .options(selectinload(Content.keyword))
            .order_by(desc(Content.ai_share_score))
            .limit(20)
        )
        contents = result.scalars().all()
        
        if not contents:
            return {"digest": "오늘 수집된 고득점 콘텐츠가 없습니다.", "contents": []}
        
        # 다이제스트 생성
        content_dicts = [c.to_dict() for c in contents]
        digest_text = await analyzer.generate_daily_digest(content_dicts)
        
        return {
            "digest": digest_text,
            "contents": content_dicts,
            "date": today.isoformat()
        }
