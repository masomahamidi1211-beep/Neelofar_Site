import { longExcerptOf, type Article } from "../lib/content-server";
import { toPersianDigits } from "../lib/date";
import { ArticleBox } from "./article-box";
import StaggerGrid from "./stagger-grid";

/**
 * Card grid in the homepage card style, used on the یادداشت‌ها page and the
 * ویژه‌نامه pages: each article in a white padded frame with a 2px soft cream
 * border and rounded corners, holding the photo-top ArticleBox (cream/tan
 * photo mat, navy headline, fading excerpt, round read-more button).
 * 1 / 2 / 3 columns with a 2rem gap.
 */
export function HomeCardGrid({ articles, className = "" }: { articles: Article[]; className?: string }) {
  return (
    <StaggerGrid className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch ${className}`}>
      {articles.map((a, i) => (
        <div
          key={a.slug}
          className="flex h-full flex-col rounded-xl border-2 border-[#e2d8c9] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md"
        >
          <ArticleBox
            article={{
              slug: a.slug,
              title: a.title,
              author: a.author,
              excerpt: longExcerptOf(a, 100, 170),
              date: toPersianDigits(a.jalaliDate.replace(/-/g, "/")),
              image: a.image,
              imagePosition: a.imagePosition,
              imageAlt: a.imageAlt,
            }}
            variant="photo-top"
            excerptMinHeight="12rem"
            alignStart
            className="flex-1"
            tone={i % 2 === 0 ? "tan" : "cream"}
          />
        </div>
      ))}
    </StaggerGrid>
  );
}
