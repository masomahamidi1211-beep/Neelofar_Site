import { getAllArticles } from "../../../lib/content-server";
import Link from "next/link";
import { formatJalaliDate } from "../../../lib/date";

export async function generateStaticParams() {
  const articles = getAllArticles();
  const tagsSet = new Set<string>();
  articles.forEach((article) => {
    article.tags?.forEach((tag) => tagsSet.add(tag));
  });
  return Array.from(tagsSet).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const articles = getAllArticles().filter((article) => article.tags?.includes(tag));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-[#111111] mb-8">
        نوشته‌های دارای برچسب: <span className="text-[#dc2626]">#{tag}</span>
      </h1>
      {articles.length === 0 ? (
        <p className="text-[#6b6b6b]">مقاله‌ای با این برچسب یافت نشد.</p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <article key={article.slug} className="border-b border-[var(--hairline)] pb-6">
              <Link href={`/notes/${article.slug}`} className="group">
                <h2 className="text-2xl font-semibold text-[#111111] group-hover:text-[#dc2626] transition-colors">
                  {article.title}
                </h2>
              </Link>
              <div className="mt-2 flex items-center gap-x-3 text-sm text-[#6b6b6b]">
                <span>{article.author}</span>
                <span>·</span>
                <span>{formatJalaliDate(article.jalaliDate)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}