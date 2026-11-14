import { FeatureCard, type CardArticle } from "./feature-card";
import { gridSpanFor } from "./hairline-grid";
import StaggerGrid from "./stagger-grid";

const GRID_COLS = 3;

// gridSpanFor computes a span sized for the lg (3-column) breakpoint only --
// applying it as an unconditional inline style broke sm/base layouts (a
// span-2 item inside a 1-column grid forces the browser to fabricate a
// second, zero-width implicit column, which silently zeroes out other
// cards' widths). Static lg:-prefixed classes keep the widening effect
// exactly where it was intended and nowhere else.
const LG_SPAN_CLASS: Record<number, string> = {
  1: "",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
};

/**
 * The standard zero-gap article grid used across the homepage, یادداشت‌ها,
 * ویژه‌نامه, و گفتگوها: 1/2/3 columns responsively, with the trailing item
 * widened via gridSpanFor when the count doesn't divide evenly into 3 --
 * no dangling blank cell in the last row on desktop. Every card uses the
 * fixed FeatureCard image format, so CSS grid's default align-items:stretch
 * keeps every row's images -- and cell heights -- exactly aligned.
 */
export function ArticleGrid({ articles, className = "" }: { articles: CardArticle[]; className?: string }) {
  return (
    <StaggerGrid className={`hairline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {articles.map((article, i) => {
        const span = gridSpanFor(i, articles.length, GRID_COLS);
        // Same idea for the 2-column (sm/md) grid: with an odd count, the
        // last card spans both columns instead of leaving a blank half-row.
        // Reset to its lg span (or 1) at lg so the desktop rule still holds.
        const smWide = articles.length % 2 === 1 && i === articles.length - 1;
        const spanClasses = smWide
          ? `sm:col-span-2 ${span > 1 ? LG_SPAN_CLASS[span] : "lg:col-span-1"}`
          : LG_SPAN_CLASS[span];
        return (
          <FeatureCard
            key={article.slug}
            article={article}
            className={`bg-white ${spanClasses}`}
          />
        );
      })}
    </StaggerGrid>
  );
}
