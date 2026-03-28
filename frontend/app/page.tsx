import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Repository AI assistant
        </h1>
        <p className="mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
          Index a local repository on the API host, then explore insights, ask
          questions, and browse files. GitHub URLs run a remote preview (no
          full local index).
        </p>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2">
        <Step
          n={1}
          title="Analyze"
          href="/analyze"
          body="Local absolute path or GitHub URL"
        />
        <Step
          n={2}
          title="Insights"
          href="/insights"
          body="Stats, extensions, layout"
        />
        <Step
          n={3}
          title="Ask"
          href="/ask"
          body="RAG Q&A over indexed repo"
        />
        <Step
          n={4}
          title="Files"
          href="/explorer"
          body="Tree + explain / ask per file"
        />
      </ol>
      <p className="text-sm text-zinc-500">
        API base:{" "}
        <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">
          {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}
        </code>
      </p>
    </div>
  );
}

function Step({
  n,
  title,
  href,
  body,
}: {
  n: number;
  title: string;
  href: string;
  body: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-sky-700"
      >
        <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
          Step {n}
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
      </Link>
    </li>
  );
}
