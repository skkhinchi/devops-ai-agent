import type {
  AskFileResponse,
  AskResponse,
  ExplainFileResponse,
  RepoFilesResponse,
  RepoInsights,
  RepoTreeResponse,
  SummaryResponse,
} from "./types";

export const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function detailToMessage(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") {
    const o = detail as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    if (Array.isArray(o.detail)) {
      const first = o.detail[0] as Record<string, unknown> | undefined;
      if (first && typeof first.msg === "string") return first.msg;
    }
    if (typeof o.code === "string" && typeof o.message === "string")
      return `${o.code}: ${o.message}`;
  }
  try {
    return JSON.stringify(detail);
  } catch {
    return "Request failed";
  }
}

async function parseJsonOrEmpty(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const { json: body, headers: h, ...rest } = init ?? {};
  const headers: HeadersInit = {
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...h,
  };
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : rest.body,
  });

  const data = await parseJsonOrEmpty(res);
  if (!res.ok) {
    const detail = (data as { detail?: unknown }).detail ?? data;
    throw new ApiError(res.status, detailToMessage(detail), detail);
  }
  return data as T;
}

/** POST /repo/analyze — indexes local clone on the machine running the API */
export function analyzeLocalRepo(repo_path: string) {
  return request<Record<string, unknown>>("/repo/analyze", {
    method: "POST",
    json: { repo_path },
  });
}

/** POST /repo/github/analyze — metadata + samples; does not replace local index for RAG */
export function analyzeGithubRepo(repo_url: string) {
  return request<Record<string, unknown>>("/repo/github/analyze", {
    method: "POST",
    json: { repo_url },
  });
}

export function getRepoInsights() {
  return request<RepoInsights>("/repo/insights");
}

export function getRepoTree() {
  return request<RepoTreeResponse>("/repo/tree");
}

export function getRepoFiles() {
  return request<RepoFilesResponse>("/repo/files");
}

export function askRepo(question: string) {
  return request<AskResponse>("/ai/ask", {
    method: "POST",
    json: { question },
  });
}

/** GET /ai/summary */
export function getRepoSummary() {
  return request<SummaryResponse>("/ai/summary");
}

export function explainFile(file_path: string) {
  return request<ExplainFileResponse>("/ai/explain-file", {
    method: "POST",
    json: { file_path },
  });
}

export function askFile(question: string, file_path: string) {
  return request<AskFileResponse>("/ai/ask-file", {
    method: "POST",
    json: { question, file_path },
  });
}
