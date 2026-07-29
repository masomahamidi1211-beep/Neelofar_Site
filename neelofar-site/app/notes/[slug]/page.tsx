import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "../../lib/content-server";
import { formatJalaliDate, toPersianDigits } from "../../lib/date";
import GiscusComments from "../../components/giscus-comments";

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  // Turbopack's dev router hands this segment still percent-encoded for
  // non-ASCII (Persian) slugs instead of decoding it -- decode defensively.
  const slug = rawSlug.includes("%") ? decodeURIComponent(rawSlug) : rawSlug;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Only show a cover image at the top if it isn't already embedded inline
  // in the body -- illustrated articles (شاه‌کار, قصه‌ی مریم, ...) already
  // place their first image at its natural position in the text, so
  // showing the cover again up top would duplicate it.
  const showCoverAtTop = Boolean(article.image) && !article.body.includes(article.image as string);

  return (
    <article className="mx-auto max-w-[70ch] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-bold leading-[1.6] sm:text-4xl">{article.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6b6b6b]">
        <span className="font-semibold text-[#111111]">{article.author}</span>
        <span>·</span>
        <span>{formatJalaliDate(article.jalaliDate)}</span>
        <span>·</span>
        <span>{toPersianDigits(String(article.readingTimeMinutes))} دقیقه زمان مطالعه</span>
      </div>

      {showCoverAtTop && (
        <img
          src={article.image as string}
          alt={`${article.imageAlt ?? article.title} — مادران و دختران`}
          className="mx-auto mt-8 block max-h-[60vh] w-auto max-w-full"
        />
      )}

      <div
        className="article-body prose prose-neutral mt-10 max-w-none text-justify text-lg leading-9 [&_p]:mb-6 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {article.footnotes.length > 0 && (
        <div className="mt-14 border-t border-[var(--hairline)] pt-8">
          <h2 className="section-heading text-lg font-bold">پانوشت‌ها</h2>
          <ol className="mt-4 space-y-2 text-sm leading-7 text-[#4a4a4a]">
            {article.footnotes.map((fn) => (
              <li key={fn.id} id={`fn-${fn.id}`}>
                {fn.text}{" "}
                <a href={`#fnref-${fn.id}`} className="text-xs text-[#6b6b6b]" aria-label="بازگشت به متن">
                  ↩
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-14 border-t border-[var(--hairline)] pt-6 text-sm text-[#6b6b6b]">
        نویسنده: <span className="font-semibold text-[#111111]">{article.author}</span>
      </div>

      <GiscusComments />
    </article>
  );
}
