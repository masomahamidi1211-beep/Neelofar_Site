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

  // Homepage picks are listed by slug (the article's file name), so a
  // retitled article can't silently drop off or swap sections.
  const bySlug = (slug: string) => articles.find((a) => a.slug === slug);
  const pick = (...slugs: string[]) => slugs.map(bySlug).filter((a): a is Article => Boolean(a));

  // 1. Standalone Top Hero (سرسخن)
  const heroArticle = bySlug("سرسخن");

  // 2. یادداشت‌ها و نقد ادبی
  const upperGridArticles = pick(
    "آیا-آصف-سلطانزاده-الکسیویچ-افغانستان-است",
    "یادداشتهایی-از-بامیان-و-مزار-شریف-درباره-کتاب-جنگ-چهرهی",
    "الکسیویچخوانی-در-مزار"
  );

  // 3. یادداشت ویژه
  const middleHorizontalArticle = bySlug("چرا-حسین-فخری-حافظهی-ادبیات-افغانستان-است");

  // 5. روایت/ داستان ویژه
  const featuredStory = bySlug("az-pol-e-sorkh-ta-san-petersburg");

  // 4. ترجمه و گفتگو -- قصه‌ی مریم، گفتگو با سارا راخفوس («کوچه‌ی ما»)،
  // گفتگو با یوتا همل‌غایش
  const lowerGridArticles = pick(
    "قصهی-مریم-و-همباغش",
    "کوچهی-ما-تلاشی-برای-حفظ-زندگی-از-دسترفته",
    "بیستو-پنجسال-در-خدمت-صداهای-جنوب-جهانی"
  );

  return (
    <div className="bg-[#faf7f2] min-h-screen text-[#2a2421] font-serif dir-rtl">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 py-8 space-y-12">

        {/* 1. TOP HERO: سرسخن */}
        {heroArticle && (
          <section className="border-b border-[#e5ded4] pb-10">
            <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#d8ccbc]">
                <span className="bg-[#8c2222] text-[#faf7f2] text-xs font-sans font-bold px-3 py-1 rounded-sm tracking-widest">
                  سرمقاله نیلوفر
                </span>
                <span className="text-xs text-[#786e65] font-sans">یادداشت نخست</span>
              </div>
              <WideRow article={toBaru(heroArticle, [220, 380])} />
            </div>
          </section>
        )}

        {/* 2. UPPER 3 GRID CARDS */}
        {upperGridArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">یادداشت‌ها و نقد ادبی</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {upperGridArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col h-full hover:shadow-md transition-all duration-300"
                >
                  <ArticleBox
                    article={toBaru(a, [100, 170])}
                    variant="photo-top"
                    excerptMinHeight="22rem"
                    className="flex-1"
                    tone={i % 2 === 0 ? "tan" : "cream"}
                  />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* 3. MIDDLE HORIZONTAL SECTION: یادداشت ویژه */}
        {middleHorizontalArticle && (
          <section className="my-10">
            <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
              <div className="mb-4 pb-2 border-b border-[#d8ccbc]">
                <span className="text-xs font-sans font-bold text-[#8c2222] tracking-widest uppercase">
                  یادداشت ویژه
                </span>
              </div>
              <WideRow article={toBaru(middleHorizontalArticle, [160, 300])} />
            </div>
          </section>
        )}

        {/* 4. LOWER 3 GRID CARDS */}
        {lowerGridArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-[#2a2421]">
              <h2 className="text-xl font-bold tracking-tight">ترجمه و گفتگو</h2>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {lowerGridArticles.map((a, i) => (
                <div
                  key={a.slug}
                  className="bg-white p-6 rounded-xl border border-[#e2d8c9] shadow-xs flex flex-col h-full hover:shadow-md transition-all duration-300"
                >
                  <ArticleBox
                    article={toBaru(a, [100, 170])}
                    variant="photo-top"
                    excerptMinHeight="22rem"
                    className="flex-1"
                    tone={i % 2 === 0 ? "cream" : "tan"}
                  />
                </div>
              ))}
            </StaggerGrid>
          </section>
        )}

        {/* 5. روایت/ داستان ویژه -- opens the story's reading page */}
        {featuredStory && (
        <section className="pb-12">
          <div className="bg-[#f3ede2] p-6 md:p-8 rounded-xl border border-[#e2d8c9] shadow-sm">
            <div className="mb-4 pb-2 border-b border-[#d8ccbc]">
              <h2 className="text-xs font-sans font-bold text-[#8c2222] tracking-widest">
                روایت/ داستان ویژه
              </h2>
            </div>
            <WideRow article={toBaru(featuredStory, [160, 300], "50% 45%")} />
          </div>
        </section>
        )}

      </div>
    </div>
  );
}