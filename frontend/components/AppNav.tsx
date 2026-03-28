import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/insights", label: "Insights" },
  { href: "/ask", label: "Ask" },
  { href: "/explorer", label: "Files" },
  { href: "/summary", label: "Summary" },
];

export function AppNav() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <Link
          href="/"
          className="mr-4 font-semibold text-zinc-900 dark:text-zinc-100"
        >
          DevOps AI Agent
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2 py-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
