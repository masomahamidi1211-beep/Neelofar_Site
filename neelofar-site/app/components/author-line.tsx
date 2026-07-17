export function AuthorLine({ author, className = "" }: { author: string; className?: string }) {
  return <p className={`text-sm text-[var(--muted)] ${className}`}>{author}</p>;
}
