import { longExcerptOf, type Article } from "../lib/content-server";
import { toPersianDigits } from "../lib/date";
import { ArticleBox, type BaruArticle } from "./article-box";
import StaggerGrid from "./stagger-grid";
import { WideRow } from "./wide-row";

/** A site article as a homepage-style card (links to /notes/{slug}). */
export function articleCard(a: Article): BaruArticle {
  return {
    slug: a.slug,
    title: a.title,
    author: a.author,
    excerpt: longExcerptOf(a, 100, 170),
    date: toPersianDigits(a.jalaliDate.replace(/-/g, "/")),
    image: a.image,
    imagePosition: a.imagePosition,
    imageAlt: a.imageAlt,
  };
}

/**
 * Card grid in the homepage card style, used on the یادداشت‌ها page and the
 * ویژه‌نامه pages: each item in a white padded frame with a 2px soft cream
 * border and rounded corners, holding the photo-top ArticleBox (cream/tan
 * photo mat, navy headline, fading excerpt, round read-more button).
 * 1 / 2 / 3 columns with a 2rem gap. Pass `articles` (site articles) or
 * ready-made `cards` (e.g. pieces of the PDF special issue, with their own
 * href).
 */
export function HomeCardGrid({
  articles,
  cards,
  columns = 3,
  className = "",
}: {
  articles?: Article[];
  cards?: BaruArticle[];
  /** Desktop columns: 3 (default) or 2 (a two-card row). */
  columns?: 2 | 3;
  className?: string;
}) {
  const items = cards ?? (articles ?? []).map(articleCard);
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <StaggerGrid className={`grid grid-cols-1 gap-8 ${cols} items-stretch ${className}`}>
      {items.map((card, i) => (
        <div
          key={card.href ?? card.slug}
          className="flex h-full flex-col rounded-xl border-2 border-[#e2d8c9] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md"
        >
          <ArticleBox
            article={card}
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

type Row = { kind: "three" | "two" | "wide"; items: BaruArticle[] };

/** Three cards, one wide card, three, one... Two cards left over after a
 * row of three share a two-column row (no lone narrow card, no two wide
 * cards in a row): 11 → 3·1·3·1·3, 10 → 3·1·3·1·2, 9 → 3·1·3·2, 5 → 3·2. */
function patternRows(items: BaruArticle[]): Row[] {
  const rows: Row[] = [];
  let i = 0;
  while (i < items.length) {
    const left = items.length - i;
    if (left >= 3) {
      rows.push({ kind: "three", items: items.slice(i, i + 3) });
      i += 3;
    } else {
      rows.push({ kind: left === 2 ? "two" : "wide", items: items.slice(i) });
      break;
    }
    const after = items.length - i;
    if (after === 2) {
      rows.push({ kind: "two", items: items.slice(i) });
      break;
    }
    if (after > 0) {
      rows.push({ kind: "wide", items: [items[i]] });
      i += 1;
    }
  }
  return rows;
}

/**
 * The repeating asymmetrical card layout (یادداشت‌ها and ویژه‌نامه pages):
 * rows of three cards alternating with one wide card (image beside text),
 * all in the same white card with a 2px soft cream border, 2rem apart.
 * Pass site `articles`, or ready-made `cards`.
 */
export function PatternCardGrid({
  articles,
  cards,
  className = "",
}: {
  articles?: Article[];
  cards?: BaruArticle[];
  className?: string;
}) {
  // Wide cards have room for a longer excerpt.
  const items =
    cards ?? (articles ?? []).map((a) => ({ ...articleCard(a), wideExcerpt: longExcerptOf(a, 160, 300) }));
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {patternRows(items).map((row) =>
        row.kind === "wide" ? (
          <div
            key={row.items[0].slug}
            className="rounded-xl border-2 border-[#e2d8c9] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md md:p-8"
          >
            <WideRow
              article={{
                ...row.items[0],
                excerpt: (row.items[0] as BaruArticle & { wideExcerpt?: string }).wideExcerpt ?? row.items[0].excerpt,
              }}
            />
          </div>
        ) : (
          <HomeCardGrid key={row.items[0].slug} cards={row.items} columns={row.kind === "two" ? 2 : 3} />
        )
      )}
    </div>
  );
}
