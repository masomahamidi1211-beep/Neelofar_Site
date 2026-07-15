import { ArticleEntry, type EntryArticle } from "./article-entry";
import { HairlineGrid, gridSpanFor } from "./hairline-grid";

const GRID_COLS = 3;

/**
 * The standard zero-gap article grid used across the homepage, یادداشت‌ها,
 * ویژه‌نامه, and گفتگوها: 1/2/3 columns responsively, with the trailing item
 * widened via gridSpanFor when the count doesn't divide evenly into 3 --
 * no dangling blank cell in the last row, and CSS grid's default
 * align-items:stretch keeps every cell in a row exactly equal height.
 */
export function ArticleGrid({ articles, className = "" }: { articles: EntryArticle[]; className?: string }) {
  return (
    <HairlineGrid className={`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {articles.map((article, i) => {
        const span = gridSpanFor(i, articles.length, GRID_COLS);
        return (
          <ArticleEntry
            key={article.slug}
            article={article}
            className="bg-white"
            style={{ gridColumn: `span ${span} / span ${span}` }}
          />
        );
      })}
    </HairlineGrid>
  );
}
