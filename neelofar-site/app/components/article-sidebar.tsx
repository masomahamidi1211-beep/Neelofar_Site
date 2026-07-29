import Link from "next/link";
import type { Article } from "../lib/content-server";

/**
 * One compact hairline-separated list used by both sidebar sections --
 * small square thumbnail, linked title, «بیشتر» link. Kept to one shared
 * renderer so the two sections can never visually drift apart.
 */
function SidebarList({ heading, articles }: { heading: string; articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div>
      <h2 className="section-heading text-lg font-bold">{heading}</h2>
      <ul className="mt-3 divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
        {articles.map((article) => (
          <li key={article.slug} className="flex items-center gap-3 py-3">
            {article.image && (
              <Link href={`/notes/${article.slug}`} className="block h-16 w-16 shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-200 ease-out hover:scale-[1.03]"
                  style={{ objectPosition: article.imagePosition ?? "50% 20%" }}
                />
              </Link>
            )}
            <div className="min-w-0 flex-1">
              <Link
                href={`/notes/${article.slug}`}
                className="line-clamp-2 text-base font-semibold leading-snug transition duration-150 hover:text-[var(--accent)]"
              >
                {article.title}
              </Link>
              <Link
                href={`/notes/${article.slug}`}
                className="mt-1 inline-block text-sm text-[#6b6b6b] transition duration-150 hover:text-[var(--accent)]"
              >
                بیشتر ←
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArticleSidebar({
  authorName,
  authorArticles,
  relatedHeading,
  relatedArticles,
}: {
  authorName: string;
  authorArticles: Article[];
  relatedHeading: string;
  relatedArticles: Article[];
}) {
  if (authorArticles.length === 0 && relatedArticles.length === 0) return null;

  return (
    <aside className="mt-14 space-y-12 lg:mt-0">
      <SidebarList heading={`از متن‌های ${authorName}`} articles={authorArticles} />
      <SidebarList heading={relatedHeading} articles={relatedArticles} />
    </aside>
  );
}
