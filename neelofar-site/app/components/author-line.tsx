export function AuthorLine({ author, className = "" }: { author: string; className?: string }) {
  return <p className={`article-author text-base text-[var(--muted)] ${className}`}>{author}</p>;
}
