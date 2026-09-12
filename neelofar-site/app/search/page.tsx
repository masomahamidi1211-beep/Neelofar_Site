import { getAllArticles } from "../lib/content-server";
import { ArticleBox } from "../components/article-box";
import { toPersianDigits } from "../lib/date";

// Helper function to strip HTML tags like <p>, </p>, <div>, etc.
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

// Helper function to normalize Persian/Arabic characters and symbols
function normalizeText(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/‌/g, " ") // Replace zero-width non-joiner with space
    .replace(/[^\w\sآاأإءئؤبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/g, "") // Strip special symbols
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

  // Stop words to ignore when splitting into keywords
  const stopWords = new Set(["و", "در", "به", "از", "که", "را", "هم", "با", "این", "آن"]);

  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter((word) => word.length > 0 && !stopWords.has(word));

  // Score articles to bring top matches to the highest position
  const scoredArticles = articles
    .map((article) => {
      const cleanBody = stripHtml(article.body);
      const normTitle = normalizeText(article.title);
      const normBody = normalizeText(cleanBody);
      const normAuthor = normalizeText(article.author);

      let score = 0;

      if (!normalizedQuery) {
        return { article, cleanBody, score: 0 };
      }

      // Exact title match gets highest priority
      if (normTitle === normalizedQuery) {
        score += 100;
      } else if (normTitle.includes(normalizedQuery)) {
        score += 50;
      }

      // Exact body match
      if (normBody.includes(normalizedQuery)) {
        score += 30;
      }

      // Keyword matches
      queryWords.forEach((word) => {
        if (normTitle.includes(word)) score += 15;
        if (normAuthor.includes(word)) score += 10;
        if (normBody.includes(word)) score += 5;
      });

      return { article, cleanBody, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12 dir-rtl font-serif min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-6 pb-2 border-b border-[#e2d8c9]">
        نتایج جستجو برای: <span className="text-[#8c2222]">"{rawQuery}"</span>
      </h1>

      {scoredArticles.length === 0 ? (
        <p className="text-[#786e65]">هیچ مقاله‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scoredArticles.map(({ article, cleanBody }) => (
            <ArticleBox
              key={article.slug}
              article={{
                slug: article.slug,
                title: article.title,
                author: article.author,
                excerpt: cleanBody.slice(0, 150) + "...",
                date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
                image: article.image,
                imageAlt: article.imageAlt,
              }}
              variant="photo-top"
            />
          ))}
        </div>
      )}
    </div>
  );
}