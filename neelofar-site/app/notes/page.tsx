import { getAllArticles, longExcerptOf } from "../lib/content-server";
import { ArticleEntry } from "../components/article-entry";
import { HairlineFlex } from "../components/hairline-grid";
import ScrollReveal from "../components/scroll-reveal";

export default function NotesPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">یادداشت‌ها</h1>
      <p className="mt-2 text-[#4a4a4a]">تمام مقاله‌های نیلوفر، به ترتیب ویژه‌نامه.</p>

      <ScrollReveal className="mt-3">
        <HairlineFlex>
          {articles.map((article) => (
            <ArticleEntry
              key={article.slug}
              article={{
                slug: article.slug,
                title: article.title,
                author: article.author,
                excerpt: longExcerptOf(article),
                image: article.image,
              }}
              className="bg-white"
            />
          ))}
        </HairlineFlex>
      </ScrollReveal>
    </div>
  );
}
