from urllib.parse import urlparse

def parse_github_repo_url(repo_url: str):
    """
    Converts:
    https://github.com/facebook/react
    into:
    owner = facebook
    repo = react
    """
    parsed = urlparse(repo_url)
    path_parts = parsed.path.strip("/").split("/")

    if len(path_parts) < 2:
        raise ValueError("Invalid GitHub repo URL")

    owner = path_parts[0]
    repo = path_parts[1].replace(".git", "")

    return owner, repo