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
};

const DEFAULT_POSITION = "50% 20%";

function BoxImage({ article, className }: { article: BaruArticle; className: string }) {
  if (!article.image) return null;
  return (
    <img
      src={article.image}
      alt={article.imageAlt ?? ""}
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

export function ArticleBox({
  article,
  variant,
  tone,
  authorFirst = false,
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
  className?: string;
}) {
  const href = `/notes/${article.slug}`;

  if (variant === "photo-top") {
    return (
      <Link href={href} className={`article-box baru-focus group flex h-full flex-col ${className}`}>
        <div className={`overflow-hidden ${tone ? `${TONE_BG[tone]} p-3` : ""}`}>
          <BoxImage article={article} className={`w-full object-cover ${tone ? "aspect-[4/5]" : "aspect-[16/9]"}`} />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {authorFirst && <AuthorLine author={article.author} className="mb-2" />}
          <h3 className="text-xl font-bold leading-snug text-[var(--title)] transition duration-200 group-hover:text-[var(--accent)] sm:text-2xl">{article.title}</h3>
          {!authorFirst && <AuthorLine author={article.author} className="mt-2" />}
          <p className="justified-fa mt-4 flex-1 text-[15px] text-[var(--ink)]">{article.excerpt}</p>
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
          <h3 className="text-2xl font-bold leading-snug text-white sm:text-3xl">{article.title}</h3>
          <p className="justified-fa mx-auto mt-4 max-w-md text-[15px] text-white/85">{article.excerpt}</p>
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
          <h3 className="mt-1 text-base font-bold leading-snug text-black transition duration-150 group-hover:text-[var(--title)]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{article.excerpt}</p>
        </div>
        <div className="h-[150px] w-[150px] shrink-0 overflow-hidden">
          <BoxImage article={article} className="h-full w-full object-cover" />
        </div>
      </Link>
    );
  }

  if (variant === "horizontal-small") {
    return (
      <Link href={href} className={`article-box baru-focus group flex items-stretch gap-4 p-4 ${className}`}>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-snug text-[var(--title)] transition duration-200 group-hover:text-[var(--accent)]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{article.excerpt}</p>
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
      <h3 className="text-xl font-bold leading-snug text-black transition duration-150 group-hover:text-[var(--title)] sm:text-2xl">{article.title}</h3>
      <AuthorLine author={article.author} className="mt-2" />
      <p className="justified-fa mt-4 flex-1 pb-14 text-[15px] text-[var(--ink)]">{article.excerpt}</p>
      <ReadMoreCircle className="absolute bottom-5 start-5" />
    </Link>
  );
}
