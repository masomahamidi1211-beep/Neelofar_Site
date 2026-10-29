import { getAllArticles, longExcerptOf } from "../lib/content-server";
import { ArticleGrid } from "../components/article-grid";

export default function NotesPage() {
  const articles = getAllArticles();
  const entries = articles.map((article) => {
    // Force image resolution for sarsokhan if missing
    const isSarsokhan = article.slug.includes("sarsokhan") || article.title.includes("سرسخن");
    const resolvedImage = article.image || (isSarsokhan ? "/images/madaran/book-30.png" : null);

    return {
      slug: article.slug,
      title: article.title,
      author: article.author,
      excerpt: longExcerptOf(article, resolvedImage ? 110 : 220),
      image: resolvedImage,
      imagePosition: article.imagePosition,
      imageAlt: article.imageAlt,
      subtitle: article.subtitle,
    };
  });

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">یادداشت‌ها</h1>
      <p className="mt-2 text-lg text-[#4a4a4a]">تمام مقاله‌های نیلوفر، به ترتیب ویژه‌نامه.</p>

      <ArticleGrid articles={entries} className="mt-3" />
    </div>
  );
}