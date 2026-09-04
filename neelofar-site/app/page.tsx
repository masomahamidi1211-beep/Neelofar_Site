import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [120, 240],
  imagePositionOverride?: string
): BaruArticle {
  return {
    slug: article.slug,
    title: article.title,
    author: article.author,
    excerpt: longExcerptOf(article, excerptBounds[0], excerptBounds[1]),
    date: toPersianDigits(article.jalaliDate.replace(/-/g, "/")),
    image: article.image,
    imagePosition: imagePositionOverride ?? article.imagePosition,
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

  // 1. Primary Editorial Block (سرسخن)
  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");

  // 2. Lead Cultural Feature (حسین فخری)
  const fakhriArticle = findArticle("فخری");

  // 3. Top Row Articles (3 Cards)
  const topRowArticles = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
  ].filter((a): a is Article => Boolean(a));

  // 4. Bottom Row Articles (3 Cards including Maryam)
  const bottomRowArticles = [
    findArticle("مریم"), // قصه‌ی مریم و هم باغش
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#faf7f2] min-h-screen text-[#2a2421] font-serif dir-rtl">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* SECTION 1: EDITORIAL HEADER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-[#e5ded4] pb-12">
          {heroArticle && (
            <div className="lg:col-span-7 bg-[#f3ede2] p-8 rounded-xl border border-[#e2d8c9] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#d8ccbc]">
                  <span className="bg-[#8c2222] text-[#faf7f2] text-xs font-sans font-bold px-3 py-1 rounded-sm tracking-widest">
                    سرمقاله نیلوفر
                  </span>
                  <span className="text-xs text-[#786e65] font-sans">یادداشت نخست</span>
                </div>
                <WideRow article={toBaru(heroArticle, [200, 360])} />
              </div>
            </div>
          )}

          {fakhriArticle && (
            <div className="lg:col-span-5 bg-white p-7 rounded-xl border border-[#e2d8c9] shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4 pb-2 border-b border-[#e2d8c9]">
                  <span className="text-xs font-sans font-bold text-[#8c2222] tracking-widest uppercase">
                    پرونده ویژه ادبیات
                  </span>
                </div>
                <ArticleBox article={toBaru(fakhriArticle, [130, 220])} variant="photo-top" />
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: TOP 3 CARDS */}
        {topRowArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">یادداشت‌ها و نقد ادبی</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {topRowArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300"
                >
                  <ArticleBox
                    article={toBaru(a, [100, 180])}
                    variant="photo-top"
                    tone={i % 2 === 0 ? "tan" : "cream"}
                  />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* HORIZONTAL DIVIDER (جداکننده افقی) */}
        <div className="my-10 border-t-2 border-dashed border-[#d8ccbc] relative text-center">
          <span className="bg-[#faf7f2] px-4 text-xs font-sans text-[#786e65] relative -top-3">
            ✦ ✦ ✦
          </span>
        </div>

        {/* SECTION 3: BOTTOM 3 CARDS (INCLUDING MARYAM) */}
        {bottomRowArticles.length > 0 && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">داستان‌ها و گفتگوها</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {bottomRowArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-all duration-300"
                >
                  <ArticleBox
                    article={toBaru(a, [100, 180])}
                    variant="photo-top"
                    tone={i % 2 === 0 ? "cream" : "tan"}
                  />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

      </div>
    </div>
  );
}