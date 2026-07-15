import Link from "next/link";
import { CSSProperties } from "react";

export type EntryArticle = {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  image?: string | null;
};

export function ArticleEntry({
  article,
  className = "",
  style,
}: {
  article: EntryArticle;
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
      {article.image && <img src={article.image} alt="" className="block w-full shrink-0" />}
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
