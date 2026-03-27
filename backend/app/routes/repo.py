from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.utils.parser import parse_github_repo_url
from app.services.github_service import (
    get_repo_details,
    get_top_level_structure,
    find_important_files,
    get_priority_dirs,
    scan_selected_dirs,
    get_file_content
)

router = APIRouter()


class RepoRequest(BaseModel):
    repo_url: str


@router.post("/analyze")
def analyze_repo(data: RepoRequest):
    try:
        owner, repo = parse_github_repo_url(data.repo_url)

        repo_details = get_repo_details(owner, repo)

        top_level = get_top_level_structure(owner, repo)
        top_level_files = top_level["files"]
        top_level_dirs = top_level["dirs"]

        important_files = find_important_files(top_level_files)
        priority_dirs = get_priority_dirs(top_level_dirs)

        scanned_files = scan_selected_dirs(owner, repo, priority_dirs)

        important_file_contents = {}

        for file in important_files[:8]:
            content = get_file_content(owner, repo, file)
            if content:
                important_file_contents[file] = content[:3000]

        return {
            "repo": f"{owner}/{repo}",
            "name": repo_details.get("name"),
            "description": repo_details.get("description"),
            "default_branch": repo_details.get("default_branch"),
            "stars": repo_details.get("stargazers_count"),
            "forks": repo_details.get("forks_count"),
            "open_issues": repo_details.get("open_issues_count"),
            "top_level_files": top_level_files,
            "top_level_dirs": top_level_dirs,
            "priority_dirs_scanned": priority_dirs,
            "important_files_found": important_files,
            "scanned_file_count": len(scanned_files),
            "sample_scanned_files": scanned_files[:50],
            "important_file_contents": important_file_contents
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))