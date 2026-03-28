/** API shapes aligned with FastAPI responses (subset used by the UI). */

export type ApiErrorDetail =
  | string
  | {
      code?: string;
      message?: string;
      [key: string]: unknown;
    };

export type RepoInsights = {
  repo_name: string;
  repo_root: string | null;
  source: string;
  updated_at: string;
  total_files: number;
  total_chunks: number;
  ingest_message: string;
  skipped: {
    too_large: number;
    binary_or_decode: number;
    extension_filter: number;
    truncated: boolean;
  };
  extensions: Record<string, number>;
  top_level_directories: Record<string, number>;
};

export type RepoTreeResponse = {
  repo_name: string;
  tree: TreeNode;
};

/** Nested dict from backend; leaves are "file" or list of file names */
export type TreeNode = Record<string, TreeChild>;
export type TreeChild = "file" | TreeNode | string[];

export type RepoFilesResponse = {
  repo_name: string;
  repo_root: string | null;
  files: string[];
  total: number;
};

export type AskResponse = {
  answer: string;
  sources: string[];
};

export type SummaryResponse = {
  summary: string;
};

export type ExplainFileResponse = {
  explanation: string;
  file_path: string;
  resolved_path: string | null;
};

export type AskFileResponse = {
  answer: string;
  file_path: string;
  resolved_path: string | null;
  sources: string[];
};
