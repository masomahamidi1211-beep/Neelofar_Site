import Link from "next/link";
import { CSSProperties } from "react";

export type CardArticle = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  image?: string | null;
  /** CSS object-position override, e.g. "50% 42%" -- for images (like a
   * book cover) where the default top-biased crop would cut off something
   * essential such as title text. Defaults to a face-friendly top crop. */
  imagePosition?: string | null;
  /** Meaningful alt text override; defaults to "" (decorative -- the card's
   * own title text already describes the link). */
  imageAlt?: string | null;
};

const DEFAULT_IMAGE_POSITION = "50% 20%";

/**
 * The standard article card for every grid section (homepage, یادداشت‌ها,
 * ویژه‌نامه, گفتگوها). One fixed image format for all cards, always: a
 * 1:1 square block, cropped with object-fit: cover so every card in
 * a row shares the exact same image height -- never a random size. Text-only
 * entries render with no image at all (no placeholder box).
 */
export function FeatureCard({
  article,
  className = "",
  style,
}: {
  article: CardArticle;
  className?: string;
  style?: CSSProperties;
}) {
  const hasImage = Boolean(article.image);

  return (
    <Link
      href={`/notes/${article.slug}`}
      style={style}
      className={`group flex h-full flex-col bg-white transition duration-200 hover:bg-[var(--panel)] ${className}`}
    >
      {article.image && (
        <div className="aspect-square w-full shrink-0 overflow-hidden">
          <img
            src={article.image}
            alt={article.imageAlt ?? ""}
            className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: article.imagePosition ?? DEFAULT_IMAGE_POSITION }}
          />
        </div>
      )}
      <div className="hairline-cell flex flex-1 flex-col">
        <p className="text-xs text-[#6b6b6b]">{article.author}</p>
        <h3 className="mt-1 max-w-2xl text-lg font-bold leading-snug transition duration-200 group-hover:text-[var(--accent)]">
          {article.title}
        </h3>
        <p
          className={`mt-3 max-w-2xl text-justify text-[15px] leading-8 text-[#333333] ${
            hasImage ? "line-clamp-[6]" : "line-clamp-[16]"
          }`}
        >
          {article.excerpt}
        </p>
        <span className="mt-auto inline-block pt-3 text-sm font-semibold text-[var(--accent)]">
          ادامه‌ی مطلب ←
        </span>
      </div>
    </Link>
  );
}
