import Link from "next/link";
import { AuthorLine } from "./author-line";
import { ReadMoreCircle } from "./read-more-circle";

export type BaruArticle = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  date: string;
  image?: string | null;
  imagePosition?: string | null;
  imageAlt?: string | null;
  /** Optional credit lines shown below the title, smaller than it -- most
   * articles don't have these; only rendered where present. */
  subtitle?: string[] | null;
};

const DEFAULT_POSITION = "50% 20%";

function BoxImage({ article, className }: { article: BaruArticle; className: string }) {
  // Force a fallback for sarsakhan to guarantee book-30.png renders in lists/grids
  const isSarsokhan = article.slug.includes("sarsokhan") || article.title.includes("سرسخن");
  const resolvedImage = article.image || (isSarsokhan ? "/images/madaran/book-30.png" : null);

  if (!resolvedImage) return null;

  return (
    <img
      src={resolvedImage}
      alt={article.imageAlt ?? article.title}
      className={`transition duration-200 ease-out group-hover:scale-[1.03] ${className}`}
      style={{ objectPosition: article.imagePosition ?? DEFAULT_POSITION }}
    />
  );
}

/**
 * The six bordered-rectangle formats of the baru.ir-style mosaic:
 * - text: headline + author + a long justified excerpt filling the box,
 *   a ReadMoreCircle anchored at the bottom corner. No image.
 * - photo-top: full-width photo, then headline/author/excerpt beneath --
 *   for wide (multi-track) boxes.
 * - cream: identical to text, on --cream background.
 * - dark: a dark photographic background with a gradient overlay, all
 *   text in white, centered.
 * - list: fixed-height (185px) row, borderless #f0f0f0 block with only a
 *   bottom hairline, a 150px square thumbnail at the far side, black
 *   title -- the hero's side-column stack.
 * - horizontal-small: a smaller thumbnail-beside-text row for Section C.
 */
const TONE_BG: Record<"tan" | "cream", string> = {
  tan: "bg-[var(--tan)]",
  cream: "bg-[var(--cream)]",
};

/**
 * Excerpt that fills whatever height the card has left. The text is laid
 * out absolutely, so it never decides the card's height: the row's tallest
 * card sets the height, and every other card's excerpt stretches to match.
 * Overflow is cut off under a soft fade, so the text in every card of a
 * row ends on the same line. minHeight is the space the excerpt always
 * gets, so pick it from how much text the caller wants visible.
 */
function FillExcerpt({ text, minHeight }: { text: string; minHeight: string }) {
  return (
    <div
      className="relative mt-4 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]"
      style={{ minHeight }}
    >
      <p className="article-body justified-fa absolute inset-x-0 top-0 text-[17px] leading-8 text-[var(--ink)]">{text}</p>
    </div>
  );
}

export function ArticleBox({
  article,
  variant,
  tone,
  authorFirst = false,
  excerptMinHeight = "10rem",
  className = "",
}: {
  article: BaruArticle;
  variant: "text" | "photo-top" | "cream" | "dark" | "list" | "horizontal-small";
  /** photo-top only: tints the image mat behind the photo, e.g. the
   * illustrated-portrait row's --tan/--cream backgrounds. */
  tone?: "tan" | "cream";
  /** photo-top only: author credit above the headline instead of below --
   * used by the illustrated-portrait row. */
  authorFirst?: boolean;
  /** photo-top/text/cream: the excerpt's guaranteed height (any CSS length). */
  excerptMinHeight?: string;
  className?: string;
}) {
  const href = `/notes/${article.slug}`;

  if (variant === "photo-top") {
    return (
      <Link href={href} className={`article-box baru-focus group flex h-full min-h-0 flex-col ${className}`}>
        {/* Fixed-ratio image area, kept even when an article has no image, so
            every card in a row starts its text at the same height. */}
        <div className={`shrink-0 overflow-hidden ${tone ? `${TONE_BG[tone]} p-3` : ""}`}>
          <div className={`w-full overflow-hidden ${tone ? "aspect-[4/5]" : "aspect-[16/9] bg-[var(--cream)]"}`}>
            <BoxImage article={article} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {authorFirst && <AuthorLine author={article.author} className="mb-2" />}
          <h3 className="article-title text-2xl leading-snug text-[var(--title)] transition duration-200 group-hover:text-[var(--accent)] sm:text-3xl">{article.title}</h3>
          {!authorFirst && <AuthorLine author={article.author} className="mt-2" />}
          <FillExcerpt text={article.excerpt} minHeight={excerptMinHeight} />
          {/* mt-auto pins the footer to the card's bottom edge, so footers
              line up across a row no matter how long the text above is. */}
          <div className="mt-auto flex justify-end pt-5">
            <ReadMoreCircle />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "dark") {
    return (
      <Link
        href={href}
        className={`baru-focus group relative flex h-full min-h-[320px] flex-col items-center justify-center overflow-hidden p-8 text-center ${className}`}
      >
        <BoxImage article={article} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative">
          <h3 className="article-title text-3xl leading-snug text-white sm:text-4xl">{article.title}</h3>
          <p className="article-body justified-fa mx-auto mt-4 max-w-md text-[17px] text-white/85">{article.excerpt}</p>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={href}
        className={`baru-focus group flex h-[185px] items-center gap-5 bg-[#f0f0f0] border-b border-[#d4d4d4] pr-6 pl-5 ${className}`}
      >
        <div className="min-w-0 flex-1">
          <AuthorLine author={article.author} />
          <h3 className="article-title mt-1 text-lg leading-snug text-black transition duration-150 group-hover:text-[var(--title)]">
            {article.title}
          </h3>
          <p className="article-body mt-2 line-clamp-2 text-base leading-6 text-[var(--muted)]">{article.excerpt}</p>
        </div>
        <div className="h-[150px] w-[150px] shrink-0 overflow-hidden">
          <BoxImage article={article} className="h-full w-full object-cover" />
        </div>
      </Link>
    );
  }

  if (variant === "horizontal-small") {
    return (
      <Link href={href} className={`article-box baru-focus group flex h-full items-stretch gap-4 p-4 ${className}`}>
        <div className="min-w-0 flex-1">
          <h3 className="article-title text-xl leading-snug text-[var(--title)] transition duration-200 group-hover:text-[var(--accent)]">
            {article.title}
          </h3>
          <p className="article-body mt-2 line-clamp-2 text-base leading-6 text-[var(--muted)]">{article.excerpt}</p>
        </div>
        <div className="h-[90px] w-[90px] shrink-0 overflow-hidden">
          <BoxImage article={article} className="h-full w-full object-cover" />
        </div>
      </Link>
    );
  }

  // text / cream
  return (
    <Link
      href={href}
      className={`article-box baru-focus group relative flex h-full flex-col p-5 sm:p-6 ${
        variant === "cream" ? "bg-[var(--cream)]" : ""
      } ${className}`}
    >
      <h3 className="article-title text-2xl leading-snug text-black transition duration-150 group-hover:text-[var(--title)] sm:text-3xl">{article.title}</h3>
      <AuthorLine author={article.author} className="mt-2" />
      <FillExcerpt text={article.excerpt} minHeight={excerptMinHeight} />
      {/* In normal flow with mt-auto (not absolute), so long text can never
          run underneath the circle, and it still sits on the bottom edge. */}
      <div className="mt-auto flex justify-start pt-5">
        <ReadMoreCircle />
      </div>
    </Link>
  );
}