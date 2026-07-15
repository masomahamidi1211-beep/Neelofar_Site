import Link from "next/link";

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
}: {
  article: EntryArticle;
  className?: string;
}) {
  return (
    <Link
      href={`/notes/${article.slug}`}
      className={`group flex h-full flex-col bg-white transition duration-200 hover:bg-[var(--panel)] ${className}`}
    >
      {article.image && (
        <div className="aspect-[16/10] w-full shrink-0 overflow-hidden">
          <img src={article.image} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="hairline-cell flex flex-1 flex-col">
        <p className="text-xs text-[#6b6b6b]">{article.author}</p>
        <h3 className="mt-1 max-w-2xl text-lg font-bold leading-snug transition duration-200 group-hover:text-[var(--accent)]">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-[8] max-w-2xl text-justify text-[15px] leading-8 text-[#333333]">
          {article.excerpt}
        </p>
        <span className="mt-auto inline-block pt-3 text-sm font-semibold text-[var(--accent)]">
          ادامه‌ی مطلب ←
        </span>
      </div>
    </Link>
  );
}
