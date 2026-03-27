import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

IMPORTANT_FILES = [
    "README.md",
    "package.json",
    "requirements.txt",
    "Dockerfile",
    "docker-compose.yml",
    ".env.example",
    "tsconfig.json",
    "vite.config.ts",
    "vite.config.js",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "pyproject.toml",
    "turbo.json",
    "pnpm-workspace.yaml",
    "yarn.lock",
    "pnpm-lock.yaml",
    "package-lock.json"
]

SCAN_PRIORITY_DIRS = [
    "src",
    "app",
    "pages",
    "components",
    "lib",
    "server",
    "api",
    "packages",
    "apps"
]

SKIP_DIRS = {
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    ".turbo",
    ".vercel",
    "out",
    "vendor",
    "tmp",
    "logs",
    ".idea",
    ".vscode"
}


def get_repo_details(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}"
    response = requests.get(url, headers=HEADERS, timeout=20)

    if response.status_code != 200:
        raise Exception(f"GitHub API error: {response.json()}")

    return response.json()


def get_repo_contents(owner: str, repo: str, path: str = ""):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url, headers=HEADERS, timeout=20)

    if response.status_code != 200:
        raise Exception(f"GitHub contents fetch error at '{path}': {response.json()}")

    return response.json()


def get_top_level_structure(owner: str, repo: str):
    """
    Fetch only root-level files/folders
    """
    contents = get_repo_contents(owner, repo, "")
    files = []
    dirs = []

    for item in contents:
        if item["type"] == "file":
            files.append(item["path"])
        elif item["type"] == "dir":
            dirs.append(item["path"])

    return {
        "files": files,
        "dirs": dirs
    }


def find_important_files(top_level_files):
    """
    Pick important files from top-level first
    """
    return [file for file in top_level_files if file.split("/")[-1] in IMPORTANT_FILES]


def get_priority_dirs(top_level_dirs):
    """
    Only scan folders that are likely useful
    """
    return [d for d in top_level_dirs if d.split("/")[-1] in SCAN_PRIORITY_DIRS]


def scan_selected_dirs(
    owner: str,
    repo: str,
    dirs: list,
    depth: int = 0,
    max_depth: int = 3,
    max_files: int = 250,
    collected=None
):
    """
    Recursively scan only selected useful directories
    """
    if collected is None:
        collected = []

    if depth > max_depth or len(collected) >= max_files:
        return collected

    for dir_path in dirs:
        if len(collected) >= max_files:
            break

        try:
            contents = get_repo_contents(owner, repo, dir_path)
        except Exception:
            continue

        if isinstance(contents, dict):
            continue

        for item in contents:
            if len(collected) >= max_files:
                break

            name = item["name"]

            if item["type"] == "file":
                collected.append(item["path"])

            elif item["type"] == "dir":
                if name in SKIP_DIRS:
                    continue

                scan_selected_dirs(
                    owner,
                    repo,
                    [item["path"]],
                    depth=depth + 1,
                    max_depth=max_depth,
                    max_files=max_files,
                    collected=collected
                )

    return collected


def get_file_content(owner: str, repo: str, file_path: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{file_path}"
    response = requests.get(url, headers=HEADERS, timeout=20)

    if response.status_code != 200:
        return None

    data = response.json()

    if data.get("encoding") == "base64":
        try:
            decoded_content = base64.b64decode(data["content"]).decode("utf-8")
            return decoded_content
        except Exception:
            return None

    return None