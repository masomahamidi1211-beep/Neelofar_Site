import type { Metadata } from "next";
import { getAllArticles } from "../lib/content-server";
import { ArticleBox } from "../components/article-box";
import { toPersianDigits } from "../lib/date";
import { htmlToText, queryTerms, searchDocs, type SearchDoc } from "../lib/search";

// Search result pages are endless query variations -- keep them out of
// search engines.
export const metadata: Metadata = {
  title: "جست‌وجو",
  robots: { index: false, follow: true },
};

const MAX_QUERY_LENGTH = 100;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  // q can arrive as an array (?q=a&q=b) or be very long -- normalize both.
  const rawQuery = (Array.isArray(params.q) ? params.q[0] : params.q ?? "").slice(0, MAX_QUERY_LENGTH);
  const hasQuery = queryTerms(rawQuery).length > 0;

  // Same matching and ranking as the live search in the header modal.
  const articles = getAllArticles();
  const docs: SearchDoc[] = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    author: article.author,
    tags: article.tags ?? [],
    text: htmlToText(article.body),
    image: article.image ?? null,
    imagePosition: article.imagePosition ?? null,
  }));
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const hits = hasQuery ? searchDocs(docs, rawQuery) : [];

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12 dir-rtl font-serif min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b border-[#e2d8c9]">
        {rawQuery ? (
          <>
            نتایج جستجو برای: <span className="text-[#8c2222]">«{rawQuery}»</span>
          </>
        ) : (
          "جست‌وجو"
        )}
      </h1>

      {!hasQuery ? (
        <p className="text-[#786e65]">برای جست‌وجو، عنوان، نام نویسنده یا کلیدواژه‌ای را وارد کنید.</p>
      ) : hits.length === 0 ? (
        <p className="text-[#786e65]">مقاله‌ای یافت نشد.</p>
      ) : (
        <>
          <p className="mb-6 text-sm text-[#786e65]">{toPersianDigits(String(hits.length))} نتیجه</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hits.map(({ doc, snippet }) => {
              const article = bySlug.get(doc.slug)!;
              return (
                <ArticleBox
                  key={doc.slug}
                  article={{
                    slug: doc.slug,
                    title: doc.title,
                    author: doc.author,
                    // The passage around the match, not just the article's opening.
                    excerpt: snippet,
                    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
                    image: doc.image,
                    imagePosition: doc.imagePosition,
                    imageAlt: article.imageAlt,
                  }}
                  variant="photo-top"
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
