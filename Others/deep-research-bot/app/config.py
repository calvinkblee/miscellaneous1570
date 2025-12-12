from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    # API Keys
    openai_api_key: str = ""
    youtube_api_key: Optional[str] = None
    
    # App Settings
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    debug: bool = True
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./data/research.db"
    
    # Research Settings
    daily_content_limit: int = 100
    research_schedule_hour: int = 9
    
    # Paths
    base_dir: Path = Path(__file__).parent.parent
    data_dir: Path = base_dir / "data"
    logs_dir: Path = base_dir / "logs"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# Ensure directories exist
settings.data_dir.mkdir(exist_ok=True)
settings.logs_dir.mkdir(exist_ok=True)
