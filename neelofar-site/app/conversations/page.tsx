import { getArticlesByTag, longExcerptOf } from "../lib/content-server";
import { WideRow } from "../components/wide-row";
import StaggerGrid from "../components/stagger-grid";
import ScrollReveal from "../components/scroll-reveal";

export default function ConversationsPage() {
  const articles = getArticlesByTag("گفتگو");

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">گفتگوها</h1>
      <p className="mt-2 text-lg text-[#4a4a4a]">
        آرشیو گفتگوهای نیلوفر با نویسندگان و مترجمان ادبیات فارسی.
      </p>

      {articles.length > 0 ? (
        // Each conversation in its own card -- same white card, 2px soft
        // cream border and rounded corners as the wide cards elsewhere,
        // 2rem apart.
        <StaggerGrid className="mt-6 flex flex-col gap-8">
          {articles.map((article) => (
            <div
              key={article.slug}
              className="rounded-xl border-2 border-[#e2d8c9] bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md md:p-8"
            >
              <WideRow
                article={{
                  slug: article.slug,
                  title: article.title,
                  author: article.author,
                  excerpt: longExcerptOf(article, 140, 260),
                  date: "",
                  image: article.image,
                  imagePosition: article.imagePosition,
                  imageAlt: article.imageAlt,
                  subtitle: article.subtitle,
                }}
              />
            </div>
          ))}
        </StaggerGrid>
      ) : (
        <ScrollReveal className="mt-5">
          <div className="border border-dashed border-[var(--hairline)] py-16 text-center text-[#6b6b6b]">
            <p className="text-xl font-semibold text-[#111111]">به‌زودی</p>
            <p className="mt-2 text-base">گفتگوهای بیشتر به‌زودی اینجا منتشر می‌شود.</p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
