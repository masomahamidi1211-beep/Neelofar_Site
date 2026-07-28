import { getAllArticles, longExcerptOf } from "../lib/content-server";
import { ArticleGrid } from "../components/article-grid";

export default function NotesPage() {
  const articles = getAllArticles();
  const entries = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, article.image ? 110 : 220),
    image: article.image,
    imagePosition: article.imagePosition,
    imageAlt: article.imageAlt,
  }));

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">یادداشت‌ها</h1>
      <p className="mt-2 text-[#4a4a4a]">تمام مقاله‌های نیلوفر، به ترتیب ویژه‌نامه.</p>

      <ArticleGrid articles={entries} className="mt-3" />
    </div>
  );
}
