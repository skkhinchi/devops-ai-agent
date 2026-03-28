"use client";

import type { TreeChild, TreeNode } from "@/lib/types";

type Props = {
  node: TreeNode | TreeChild;
  pathPrefix?: string;
  onSelectFile: (path: string) => void;
  selectedPath: string | null;
};

export function FileTree({
  node,
  pathPrefix = "",
  onSelectFile,
  selectedPath,
}: Props) {
  if (node === "file") {
    return null;
  }

  if (Array.isArray(node)) {
    return (
      <ul className="ml-3 list-none space-y-0.5 border-l border-zinc-200 pl-2 dark:border-zinc-700">
        {node.map((name) => {
          const full = pathPrefix ? `${pathPrefix}/${name}` : name;
          const active = selectedPath === full;
          return (
            <li key={full}>
              <button
                type="button"
                onClick={() => onSelectFile(full)}
                className={`w-full rounded px-1 text-left text-sm ${
                  active
                    ? "bg-sky-100 font-medium text-sky-900 dark:bg-sky-950 dark:text-sky-100"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {name}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="list-none space-y-1">
      {Object.entries(node).map(([name, child]) => {
        const full = pathPrefix ? `${pathPrefix}/${name}` : name;
        if (child === "file") {
          const active = selectedPath === full;
          return (
            <li key={full}>
              <button
                type="button"
                onClick={() => onSelectFile(full)}
                className={`w-full rounded px-1 text-left text-sm ${
                  active
                    ? "bg-sky-100 font-medium text-sky-900 dark:bg-sky-950 dark:text-sky-100"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {name}
              </button>
            </li>
          );
        }
        return (
          <li key={full}>
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {name}/
            </div>
            <FileTree
              node={child as TreeNode}
              pathPrefix={full}
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
            />
          </li>
        );
      })}
    </ul>
  );
}
