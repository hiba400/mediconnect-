import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediConnect AI Service"
    API_V1_STR: str = "/api/v1"
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "your-key-here")
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    CHROMA_DB_DIR: str = "db_data"
    KNOWLEDGE_BASE_FILE: str = "data/knowledge_base.txt"
    
    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "THIS_IS_A_SUPER_SECRET_KEY_123456_FOR_DOCKER")
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
