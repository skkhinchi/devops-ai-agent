from app.services.intent_classifier import classify_intent

def route_request(user_query: str):
    intent = classify_intent(user_query)

    if intent == "repo_analysis":
        return handle_repo_analysis(user_query)
    elif intent == "deployment_debug":
        return handle_deployment_debug(user_query)
    elif intent == "docker_issue":
        return handle_docker_issue(user_query)
    elif intent == "cicd_issue":
        return handle_cicd_issue(user_query)
    elif intent == "log_analysis":
        return handle_log_analysis(user_query)
    else:
        return handle_general_help(user_query)