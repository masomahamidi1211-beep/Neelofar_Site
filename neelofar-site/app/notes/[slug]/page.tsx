import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticleBySlug,
  getAllArticles,
  getOtherArticlesInSameIssue,
  getSpecialIssueContainingArticle,
  inlineFootnotes,
} from "../../lib/content-server";
import { formatJalaliDate, toPersianDigits } from "../../lib/date";
import { ShareIcons } from "../../components/share-icons";
import ArticleBody from "../../components/article-body";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neelofar-placeholder.example";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

// A malformed address like /notes/%E0 makes decodeURIComponent throw --
// treat it as "not found" instead of a server error.
function safeDecode(value: string): string | null {
  try {
    return value.includes("%") ? decodeURIComponent(value) : value;
  } catch {
    return null;
  }
}

function plainExcerpt(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

// Per-article title, description and preview image for search engines and
// link previews (Telegram, Facebook, ...), instead of the site-wide defaults.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = safeDecode((await params).slug);
  const article = slug ? getArticleBySlug(slug) : null;
  if (!article) return {};
  const description = plainExcerpt(article.body);
  return {
    title: article.title,
    description,
    alternates: { canonical: `/notes/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: `/notes/${slug}`,
      ...(article.image ? { images: [{ url: article.image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      ...(article.image ? { images: [article.image] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  if (!slug) notFound();
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const showCoverAtTop = Boolean(article.image) && !article.body.includes(article.image as string);

  const issue = getSpecialIssueContainingArticle(slug);
  const issueRelated = getOtherArticlesInSameIssue(slug, 5);
  const relatedArticles =
    issueRelated.length > 0
      ? issueRelated
      : getAllArticles()
          .filter((a) => a.slug !== slug && a.author !== article.author)
          .slice(0, 5);
          
  const relatedHeading = issue ? "از متن‌های ویژه‌نامه" : "سایر یادداشت‌ها";
  const bodyWithFootnotes = inlineFootnotes(article.body, article.footnotes);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[7fr_3fr] lg:gap-16">
        <article className="min-w-0 max-w-[70ch]">
          <h1 className="article-title text-4xl leading-[1.6] sm:text-5xl">{article.title}</h1>
          {article.subtitle && (
            <div className="article-author mt-3 space-y-1 text-lg text-[#6b6b6b]">
              {article.subtitle.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-[#6b6b6b]">
            <span className="article-author text-[#111111]">{article.author}</span>
            <span>·</span>
            <span>{formatJalaliDate(article.jalaliDate)}</span>
            <span>·</span>
            <span>{toPersianDigits(String(article.readingTimeMinutes))} دقیقه زمان مطالعه</span>
          </div>

          {/* Cover: same 4:3 landscape crop (and crop position) as the
              article's cards, so it never shows as a tall portrait. */}
          {showCoverAtTop && (
            <div className="mt-8 aspect-[4/3] w-full overflow-hidden bg-[#f3ede2]">
              <img
                src={article.image as string}
                alt={`${article.imageAlt ?? article.title}`}
                className="h-full w-full object-cover"
                style={{ objectPosition: article.imagePosition ?? "50% 20%" }}
              />
            </div>
          )}

          <ArticleBody
            bodyHtml={bodyWithFootnotes}
            footnotes={article.footnotes}
          />

          <div className="mt-14 flex items-center justify-end border-t border-[var(--hairline)] pt-6">
            <ShareIcons url={`${SITE_URL}/notes/${slug}`} title={article.title} />
          </div>
        </article>

        {/* Aasoo-style sidebar: thumbnail, title, author, dashed dividers.
            On desktop it sticks below the header while the article scrolls;
            self-start is needed, or the grid stretches it and sticky does
            nothing. The max height + scroll keeps it usable on short screens. */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:border-r lg:border-dashed lg:border-[#d1d5db] lg:pr-8">
          <h3 className="text-lg font-bold text-[#111111] border-b border-[#111111] pb-2">
            {relatedHeading}
          </h3>
          <div className="space-y-6 divide-y divide-dashed divide-[#d1d5db]">
            {relatedArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/notes/${item.slug}`}
                className="group flex items-start gap-4 pt-6 first:pt-0"
              >
                <div className="h-[72px] w-24 shrink-0 overflow-hidden bg-[#f3ede2]">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.05]"
                      style={{ objectPosition: item.imagePosition ?? "50% 20%" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-3 text-base font-bold leading-snug text-[#111111] transition-colors group-hover:text-[#dc2626]">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-[#6b6b6b]">{item.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}