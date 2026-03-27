from fastapi import FastAPI
from app.routes.repo import router as repo_router

app = FastAPI(title="DevOps AI Agent")

app.include_router(repo_router, prefix="/repo", tags=["Repo"])


@app.get("/")
def home():
    return {"message": "DevOps AI Agent Backend Running 🚀"}