import { getAllArticles, longExcerptOf, type Article } from "./lib/content-server";
import { toPersianDigits } from "./lib/date";
import { ArticleBox, type BaruArticle } from "./components/article-box";
import { WideRow } from "./components/wide-row";
import StaggerGrid from "./components/stagger-grid";

// 1. فخری
const PRE_MOSAIC_WIDE_ROW_SLUG = "چرا-حسین-فخری-حافظه‌ی-ادبیات-افغانستان-است";

// 2. الکسیویچ‌خوانی در مزار, 3. آصف سلطان‌زاده, 4. شاهکار
const MOSAIC_SLUGS = [
  "الکسیویچ‌خوانی-در-مزار",
  "آیا-آصف-سلطان‌زاده-الکسیویچ-افغانستان-است",
  "شاهکار",
];

const MOSAIC_IMAGE_POSITIONS: Record<string, string> = {
  "الکسیویچ‌خوانی-در-مزار": "50% 65%",
  "آیا-آصف-سلطان‌زاده-الکسیویچ-افغانستان-است": "50% 10%",
  "شاهکار": "50% 24%",
};

// 5. یادداشت‌های از بامیان
const WIDE_ROW_SLUGS = [
  "یادداشت‌هایی-از-بامیان",
];

// 6. قصه مریم, 7. گفتگو با همل‌غایش, 8. گفتگو با سارا راخفوس
const PORTRAIT_SLUGS = [
  "قصه-مریم",
  "گفتگو-با-همل‌غایش",
  "گفتگو-با-سارا-راخفوس"
];

function createSlugPicker() {
  const used = new Set<string>();
  return {
    pickUnique(slugs: string[]): string[] {
      return slugs.filter((slug) => {
        if (used.has(slug)) return false;
        used.add(slug);
        return true;
      });
    },
  };
}

function toBaru(
  article: Pick<Article, "slug" | "title" | "author" | "jalaliDate" | "image" | "imagePosition" | "imageAlt" | "body">,
  excerptBounds: [number, number] = [90, 160],
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
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const get = (slug: string) => bySlug.get(slug);

  const { pickUnique } = createSlugPicker();

  const preMosaicWideRow = pickUnique([PRE_MOSAIC_WIDE_ROW_SLUG]).map(get).filter((a): a is Article => Boolean(a))[0];
  const mosaic = pickUnique(MOSAIC_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const wideRows = pickUnique(WIDE_ROW_SLUGS).map(get).filter((a): a is Article => Boolean(a));
  const portrait = pickUnique(PORTRAIT_SLUGS).map(get).filter((a): a is Article => Boolean(a));

  return (
    <div className="bg-[var(--bg)]">
      {/* 1. فخری */}
      {preMosaicWideRow && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            <WideRow article={toBaru(preMosaicWideRow, [140, 260])} />
          </StaggerGrid>
        </section>
      )}

      {/* 2. الکسیویچ‌خوانی, 3. آصف سلطان‌زاده, 4. شاهکار */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {mosaic.map((a) => (
            <ArticleBox
              key={a.slug}
              article={toBaru(a, [90, 160], MOSAIC_IMAGE_POSITIONS[a.slug])}
              variant="photo-top"
            />
          ))}
        </StaggerGrid>
      </section>

      {/* 5. یادداشت‌های از بامیان */}
      {wideRows.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
          <StaggerGrid className="divide-y divide-[#d4d4d4] bg-[#f0f0f0]">
            {wideRows.map((a) => (
              <WideRow key={a.slug} article={toBaru(a, [90, 160])} />
            ))}
          </StaggerGrid>
        </section>
      )}

      {/* 6. قصه مریم, 7. گفتگو با همل‌غایش, 8. گفتگو با سارا راخفوس */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {portrait.map((a, i) => (
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
    </div>
  );
}