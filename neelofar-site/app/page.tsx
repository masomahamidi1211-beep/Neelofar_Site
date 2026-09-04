import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [100, 200],
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

  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");
  const fakhriArticle = findArticle("فخری");

  const sideArticles = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
  ].filter((a): a is Article => Boolean(a));

  const mainGridArticles = [
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  const interviewArticles = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#fcfaf7] min-h-screen text-[#1a1a1a]">
      <div className="max-w-[1340px] mx-auto px-4 py-6 space-y-10">
        
        {/* TOP EDITORIAL GRID: سرسخن + Fakhri + Quick Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-[#e2ddd5] pb-10">
          
          {/* Main Hero Block: سرسخن (7 Columns) */}
          {heroArticle && (
            <div className="lg:col-span-7 bg-[#f4eee4] p-6 lg:p-8 rounded-lg border border-[#e0dad0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#1a1a1a] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xs tracking-wider">
                    سرسخن
                  </span>
                  <span className="text-xs text-[#756f66] font-medium">سرمقاله شماره تازه</span>
                </div>
                <WideRow article={toBaru(heroArticle, [200, 360])} />
              </div>
            </div>
          )}

          {/* Secondary Hero: چرا حسین فخری... (5 Columns) */}
          {fakhriArticle && (
            <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-[#e0dad0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#8c2222] tracking-wider uppercase mb-2 inline-block">
                  پرونده ویژه
                </span>
                <ArticleBox article={toBaru(fakhriArticle, [120, 220])} variant="photo-top" />
              </div>
            </div>
          )}
        </section>

        {/* MID SECTION: 2-Column Side & 3-Column Main Grid */}
        {sideArticles.length > 0 && (
          <section className="border-b border-[#e2ddd5] pb-10">
            <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#1a1a1a]">
              <h2 className="text-lg font-extrabold tracking-wide">ادبیات مستند و نقد</h2>
              <span className="text-xs text-[#756f66]">مرور یادداشت‌ها</span>
            </div>
            
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {sideArticles.map((a) => (
                <div key={a.slug} className="lg:col-span-2 bg-[#f6f2eb] p-5 rounded-md border border-[#e5dfd5]">
                  <ArticleBox article={toBaru(a, [110, 190])} variant="photo-top" />
                </div>
              ))}
              
              {mainGridArticles.map((a) => (
                <div key={a.slug} className="lg:col-span-1 bg-white p-4 rounded-md border border-[#e5dfd5]">
                  <ArticleBox article={toBaru(a, [80, 140])} variant="photo-top" tone="cream" />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* BOTTOM SECTION: 3-Column Interview Row */}
        {interviewArticles.length > 0 && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#1a1a1a]">
              <h2 className="text-lg font-extrabold tracking-wide">گفتگوها و روایت‌های دیداری</h2>
              <span className="text-xs text-[#756f66]">مصاحبه اختصاصی</span>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {interviewArticles.map((a, i) => (
                <div key={a.slug} className="bg-white p-5 rounded-md border border-[#e5dfd5] shadow-xs">
                  <ArticleBox
                    article={toBaru(a, [90, 160])}
                    variant="photo-top"
                    tone={i % 2 === 0 ? "tan" : "cream"}
                    authorFirst
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