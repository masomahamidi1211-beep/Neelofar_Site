import { getArticlesByTag, longExcerptOf } from "../lib/content-server";
import { ArticleGrid } from "../components/article-grid";
import ScrollReveal from "../components/scroll-reveal";

export default function ConversationsPage() {
  const articles = getArticlesByTag("گفتگو");

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">گفتگوها</h1>
      <p className="mt-2 text-[#4a4a4a]">
        آرشیو گفتگوهای نیلوفر با نویسندگان و مترجمان ادبیات فارسی.
      </p>

      <ScrollReveal className="mt-5">
        {articles.length > 0 ? (
          <ArticleGrid
            articles={articles.map((article) => ({
              slug: article.slug,
              title: article.title,
              author: article.author,
              excerpt: longExcerptOf(article, article.image ? 110 : 220),
              image: article.image,
              imagePosition: article.imagePosition,
              imageAlt: article.imageAlt,
            }))}
          />
        ) : (
          <div className="border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
            <p className="text-lg font-semibold text-[#111111]">به‌زودی</p>
            <p className="mt-2 text-sm">گفتگوهای بیشتر به‌زودی اینجا منتشر می‌شود.</p>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
