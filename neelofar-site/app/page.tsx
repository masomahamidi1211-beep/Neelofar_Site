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

  // 1. Core Editorial (سرسخن)
  const heroArticle = findArticle("سرسخن", "کوچه‌ی ما", "کوچه ما");
  // 2. Lead Feature (حسین فخری)
  const leadFeature = findArticle("فخری");

  // 3. Cultural & Literary Analysis Group
  const analysisArticles = [
    findArticle("الکسیویچ‌خوانی"),
    findArticle("ضرورت"),
    findArticle("سلطان‌زاده", "سلطان‌ازده"),
  ].filter((a): a is Article => Boolean(a));

  // 4. In-Depth Essays & Reports
  const deepDiveArticles = [
    findArticle("شاه‌کار", "شاهکار", "تابوت‌های رویین"),
    findArticle("بامیان"),
  ].filter((a): a is Article => Boolean(a));

  // 5. High-Profile Interviews
  const interviewArticles = [
    findArticle("مریم"),
    findArticle("همل"),
    findArticle("سارا"),
  ].filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[#fcfaf7] min-h-screen text-[#1a1a1a] font-serif">
      <div className="max-w-[1380px] mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* SECTION 1: EDITORIAL HEADER & DUAL HERO */}
        <section className="border-b-2 border-[#1a1a1a] pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Primary Hero: سرسخن */}
            {heroArticle && (
              <div className="lg:col-span-7 bg-[#f2ebd9] p-8 md:p-10 rounded-sm border-r-4 border-[#1a1a1a] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#d8d0c0]">
                    <span className="bg-[#1a1a1a] text-[#fcfaf7] text-xs font-sans font-bold px-3 py-1 tracking-widest uppercase">
                      سرسخن / یادداشت نخست
                    </span>
                    <span className="text-xs text-[#666055] font-sans">شماره جدید</span>
                  </div>
                  <WideRow article={toBaru(heroArticle, [220, 380])} />
                </div>
              </div>
            )}

            {/* Secondary Hero: چرا حسین فخری... */}
            {leadFeature && (
              <div className="lg:col-span-5 bg-white p-8 rounded-sm border border-[#e2ddd5] flex flex-col justify-between">
                <div>
                  <div className="mb-4">
                    <span className="text-xs font-sans font-bold text-[#8c2222] tracking-widest uppercase border-b-2 border-[#8c2222] pb-0.5">
                      پرونده ادبی
                    </span>
                  </div>
                  <ArticleBox article={toBaru(leadFeature, [140, 240])} variant="photo-top" />
                </div>
              </div>
            )}

          </div>
        </section>

        {/* SECTION 2: THREE-COLUMN LITERATURE & ESSAYS */}
        {analysisArticles.length > 0 && (
          <section className="border-b border-[#e2ddd5] pb-12">
            <div className="flex items-center justify-between mb-8 pb-2 border-b border-[#1a1a1a]">
              <h2 className="text-xl font-bold tracking-tight">نقد، تحلیل و ادبیات مستند</h2>
              <span className="text-xs font-sans text-[#756f66]">مرور و بررسی</span>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#e2ddd5]">
              {analysisArticles.map((a, idx) => (
                <div key={a.slug} className={idx !== 0 ? "pt-6 md:pt-0 md:pr-8" : ""}>
                  <ArticleBox article={toBaru(a, [100, 170])} variant="photo-top" tone="cream" />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* SECTION 3: FEATURED DEEP DIVES (WIDE SPLIT) */}
        {deepDiveArticles.length > 0 && (
          <section className="border-b border-[#e2ddd5] pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {deepDiveArticles.map((a) => (
                <div key={a.slug} className="bg-[#f6f2eb] p-6 rounded-sm border border-[#e5dfd5]">
                  <WideRow article={toBaru(a, [120, 200])} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: INTERVIEWS & DIALOGUES */}
        {interviewArticles.length > 0 && (
          <section className="pb-12">
            <div className="flex items-center justify-between mb-8 pb-2 border-b border-[#1a1a1a]">
              <h2 className="text-xl font-bold tracking-tight">گفتگوهای اختصاصی</h2>
              <span className="text-xs font-sans text-[#756f66]">گفتگو و روایت</span>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {interviewArticles.map((a, i) => (
                <div key={a.slug} className="bg-white p-6 rounded-sm border border-[#e2ddd5]">
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