import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [120, 240]
): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, excerptBounds[0], excerptBounds[1]),
    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
    image: article.image,
    imagePosition: article.imagePosition,
    imageAlt: article.imageAlt,
  };
}

export default function HomePage() {
  const articles = getAllArticles();

  const findArticle = (...keywords: string[]) => {
    return articles.find((a) => {
      if (!a || !a.title) return false;
      const cleanTitle = a.title.replace(/['"«»؟?!]/g, "");
      return keywords.some((kw) => cleanTitle.includes(kw));
    });
  };

  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");
  const secondaryHero = findArticle("فخری");
  const groupOne = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
  ].filter((a): a is Article => Boolean(a));

  const wideRows = [
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  const groupTwo = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#fbf9f5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* 1. سرسخن */}
        {heroArticle && (
          <section className="bg-[#f4efe6] border-2 border-[#1c1917] p-8 md:p-10 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
            <span className="bg-[#1c1917] text-white text-xs font-bold px-3 py-1 uppercase tracking-widest inline-block mb-4">
              سرسخن
            </span>
            <WideRow article={toBaru(heroArticle, [200, 350])} />
          </section>
        )}

        {/* 2. حسین فخری */}
        {secondaryHero && (
          <section className="border-t border-b border-[#d6d3d1] py-8">
            <WideRow article={toBaru(secondaryHero, [140, 260])} />
          </section>
        )}

        {/* 3. نقد و ادبیات */}
        {groupOne.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 text-center border-b border-[#d6d3d1] pb-3">
              — یادداشت‌ها و بررسی‌ها —
            </h2>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groupOne.map((a) => (
                <div key={a.slug} className="bg-white border border-[#e7e5e4] p-4 shadow-sm">
                  <ArticleBox article={toBaru(a, [90, 150])} variant="photo-top" />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* 4. یادداشت‌های بامیان / شاهکار */}
        {wideRows.length > 0 && (
          <section className="space-y-6">
            {wideRows.map((a) => (
              <div key={a.slug} className="bg-[#f4efe6] border border-[#d6d3d1] p-6">
                <WideRow article={toBaru(a, [100, 180])} />
              </div>
            ))}
          </section>
        )}

        {/* 5. گفتگوها */}
        {groupTwo.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 text-center border-b border-[#d6d3d1] pb-3">
              — گفتگوها —
            </h2>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groupTwo.map((a, i) => (
                <ArticleBox
                  key={a.slug}
                  article={toBaru(a)}
                  variant="photo-top"
                  tone={i % 2 === 0 ? "tan" : "cream"}
                  authorFirst
                />
              ))}
            </StaggerGrid>
          </section>
        )}
      </div>
    </div>
  );
}