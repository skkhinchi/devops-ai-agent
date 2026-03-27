from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag_service import RAGService

router = APIRouter(prefix="/ai", tags=["AI Repo Assistant"])

rag_service = RAGService()


class RepoFile(BaseModel):
    path: str
    content: str


class LoadRepoRequest(BaseModel):
    files: list[RepoFile]


class AskRequest(BaseModel):
    question: str


@router.post("/load-repo")
def load_repo(request: LoadRepoRequest):
    repo_files = [file.model_dump() for file in request.files]
    return rag_service.ingest_repo(repo_files)


@router.post("/ask")
def ask_repo(request: AskRequest):
    return rag_service.ask_repo(request.question)


@router.get("/summary")
def get_repo_summary():
    return rag_service.generate_repo_summary()
