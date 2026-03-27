from fastapi import FastAPI
from app.routes.ai import router as ai_router

app = FastAPI(title="DevOps AI Agent Backend")

@app.get("/")
def root():
    return {"message": "DevOps AI Agent backend is running"}

app.include_router(ai_router)
