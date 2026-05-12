import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as ai_router
from app.core.config import settings
from app.db.vector_store import vector_store_manager

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Initialize the vector store and load knowledge base
    vector_store_manager.initialize_db()

app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "Welcome to MediConnect AI Service API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
