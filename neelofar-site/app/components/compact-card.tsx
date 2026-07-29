import Link from "next/link";
import type { CardArticle } from "./feature-card";

/**
 * The small-row / carousel card format: a fixed 120x120 thumbnail beside
 * the text (never resized, never stretched), thin border, generous inner
 * padding. Text-only entries (no image) render with no thumbnail at all --
 * never a placeholder box.
 */
export function CompactCard({ article, className = "" }: { article: CardArticle; className?: string }) {
  return (
    <Link
      href={`/notes/${article.slug}`}
      className={`group flex items-start gap-4 border border-[var(--hairline)] bg-white p-4 transition duration-200 hover:bg-[var(--panel)] ${className}`}
    >
      {article.image && (
        <div className="h-[120px] w-[120px] shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.imageAlt ?? ""}
            className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: article.imagePosition ?? "50% 20%" }}
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[#6b6b6b]">{article.author}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug transition duration-200 group-hover:text-[var(--accent)]">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-base leading-6 text-[#4a4a4a]">{article.excerpt}</p>
      </div>
    </Link>
  );
}
