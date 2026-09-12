
import { getAllArticles } from "../lib/content-server";
import { ArticleBox } from "../components/article-box";
import { toPersianDigits } from "../lib/date";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const articles = getAllArticles();

  // Filter articles by title, author, or body matching the search query
  const filteredArticles = articles.filter((a) => {
    if (!query.trim()) return false;
    const lowerQ = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(lowerQ) ||
      a.body.toLowerCase().includes(lowerQ) ||
      a.author.toLowerCase().includes(lowerQ)
    );
  });

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12 dir-rtl font-serif">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b border-[#e2d8c9]">
        نتایج جستجو برای: <span className="text-[#8c2222]">"{query}"</span>
      </h1>

      {filteredArticles.length === 0 ? (
        <p className="text-[#786e65]">هیچ مقاله‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((a) => (
            <ArticleBox
              key={a.slug}
              article={{
                slug: a.slug,
                title: a.title,
                author: a.author,
                excerpt: a.body.slice(0, 150) + "...",
                date: toPersianDigits(a.jalaliDate.replace(/-/g, "/")),
                image: a.image,
                imageAlt: a.imageAlt,
              }}
              variant="photo-top"
            />
          ))}
        </div>
      )}
    </div>
  );
}