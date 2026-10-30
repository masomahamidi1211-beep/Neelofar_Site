import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getArticleBySlug,
  getAllArticles,
  getOtherArticlesByAuthor,
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.includes("%") ? decodeURIComponent(rawSlug) : rawSlug;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const showCoverAtTop = Boolean(article.image) && !article.body.includes(article.image as string);

  const authorArticles = getOtherArticlesByAuthor(article.author, slug);
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

          {showCoverAtTop && (
            <img
              src={article.image as string}
              alt={`${article.imageAlt ?? article.title}`}
              className="mx-auto mt-8 block max-h-[60vh] w-auto max-w-full"
            />
          )}

          <ArticleBody
            bodyHtml={bodyWithFootnotes}
            footnotes={article.footnotes}
          />

          {/* Clickable Aasoo-style Hashtags at the bottom */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-[var(--hairline)] pt-6 text-sm">
              <span className="text-[#6b6b6b] font-medium">کلیدواژه‌ها:</span>
              {article.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="text-[#4b5563] transition-colors hover:text-[#dc2626]"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-14 flex items-center justify-end border-t border-[var(--hairline)] pt-6">
            <ShareIcons url={`${SITE_URL}/notes/${slug}`} title={article.title} />
          </div>
        </article>

        {/* Sidebar styled exactly like Aasoo: Article title on top, Author name right below, with dashed borders */}
        <aside className="space-y-6 lg:border-r lg:border-dashed lg:border-[#d1d5db] lg:pr-8">
          <h3 className="text-lg font-bold text-[#111111] border-b border-[#111111] pb-2">
            {relatedHeading}
          </h3>
          <div className="space-y-6 divide-y divide-dashed divide-[#d1d5db]">
            {relatedArticles.map((item) => (
              <div key={item.slug} className="pt-6 first:pt-0">
                <Link href={`/notes/${item.slug}`} className="group block">
                  <h4 className="text-base font-bold leading-snug text-[#111111] group-hover:text-[#dc2626] transition-colors">
                    {item.title}
                  </h4>
                </Link>
                <p className="mt-2 text-sm text-[#6b6b6b]">
                  {item.author}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}