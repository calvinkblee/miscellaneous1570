import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.config import settings
from app.models.database import init_db
from app.api.routes import router as api_router
from app.services.researcher import researcher

# Scheduler
scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작/종료 시 실행"""
    # 시작 시
    print("🚀 Deep Research Bot 시작...")
    await init_db()
    print("✅ 데이터베이스 초기화 완료")
    
    # 일일 리서치 스케줄링
    scheduler.add_job(
        researcher.run_daily_research,
        CronTrigger(hour=settings.research_schedule_hour, minute=0),
        id="daily_research",
        replace_existing=True
    )
    scheduler.start()
    print(f"⏰ 매일 {settings.research_schedule_hour}:00에 자동 리서치 예약됨")
    
    yield
    
    # 종료 시
    scheduler.shutdown()
    print("👋 Deep Research Bot 종료")

# FastAPI 앱 생성
app = FastAPI(
    title="Deep Research Bot",
    description="CEO를 위한 AI 기반 딥 리서치 서비스",
    version="1.0.0",
    lifespan=lifespan
)

# Static & Templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# API 라우터
app.include_router(api_router, prefix="/api")

# ============ Web Pages ============

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """메인 대시보드"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/keywords", response_class=HTMLResponse)
async def keywords_page(request: Request):
    """키워드 관리 페이지"""
    return templates.TemplateResponse("keywords.html", {"request": request})

@app.get("/contents", response_class=HTMLResponse)
async def contents_page(request: Request):
    """콘텐츠 목록 페이지"""
    return templates.TemplateResponse("contents.html", {"request": request})

@app.get("/content/{content_id}", response_class=HTMLResponse)
async def content_detail_page(request: Request, content_id: int):
    """콘텐츠 상세 페이지"""
    return templates.TemplateResponse("content_detail.html", {
        "request": request,
        "content_id": content_id
    })

@app.get("/digest", response_class=HTMLResponse)
async def digest_page(request: Request):
    """일일 다이제스트 페이지"""
    return templates.TemplateResponse("digest.html", {"request": request})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.debug
    )
