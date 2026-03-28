export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
