export function AuthorLine({ author, className = "" }: { author: string; className?: string }) {
  return <p className={`article-author text-sm text-[var(--muted)] ${className}`}>{author}</p>;
}
