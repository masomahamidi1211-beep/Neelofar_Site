import { getAllArticles } from "../lib/content-server";
import { ArticleBox } from "../components/article-box";
import { toPersianDigits } from "../lib/date";

// Helper function to normalize Persian and Arabic letters
function normalizeText(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/‌/g, " ") // Replace zero-width non-joiner with space
    .replace(/[^\w\sآاأإءئؤبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/g, "") // Remove punctuation
    .trim();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const rawQuery = params.q || "";
  const normalizedQuery = normalizeText(rawQuery);
  const articles = getAllArticles();

  // Split query into individual keywords (e.g., ["قصه", "مریم"])
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  const filteredArticles = articles.filter((a) => {
    if (queryWords.length === 0) return false;

    const fullContent = normalizeText(`${a.title} ${a.body} ${a.author}`);

    // Match if ANY of the search keywords exist in the content
    return queryWords.some((word) => fullContent.includes(word));
  });

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12 dir-rtl font-serif min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b border-[#e2d8c9]">
        نتایج جستجو برای: <span className="text-[#8c2222]">"{rawQuery}"</span>
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