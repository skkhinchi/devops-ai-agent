def classify_intent(user_query: str) -> str:
    query = user_query.lower()

    if "github" in query or "repo" in query:
        return "repo_analysis"
    elif "deploy" in query or "deployment" in query:
        return "deployment_debug"
    elif "docker" in query:
        return "docker_issue"
    elif "pipeline" in query or "github actions" in query or "ci/cd" in query:
        return "cicd_issue"
    elif "log" in query or "error" in query or "exception" in query:
        return "log_analysis"
    else:
        return "general_devops_help"