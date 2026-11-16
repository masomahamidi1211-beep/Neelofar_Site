import Link from "next/link";
import { getSpecialIssue, getSpecialIssues, getVizheNamehAvval } from "../lib/content-server";
import { PatternCardGrid } from "../components/home-card-grid";
import { toPersianDigits } from "../lib/date";

export default function SpecialPage() {
  // Resolved issues: each section with its full article objects.
  const issues = getSpecialIssues()
    .map((i) => getSpecialIssue(i.slug))
    .filter((i): i is NonNullable<typeof i> => i !== null);
  const first = getVizheNamehAvval();

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold">ویژه‌نامه‌ها</h1>
        <p className="mt-4 text-xl leading-8 text-[#4a4a4a]">
          «ویژه‌نامه‌های ما متمرکز بر یک موضوع مشخص – عمدتاً در همکاری با نشریات دیگر فارسی‌زبان – به نشر می‌رسد. هر
          ویژه‌نامه برای ما حکمِ یک «پرونده‌ی باز» را دارد که در آن تلاش می‌کنیم با گردآوری جستارها، نقدها و نگاه‌های
          متفاوت، ابعادِ نادیده‌ی یک پدیده‌ی ادبی را روشن کنیم.»
        </p>
      </div>

      {/* Each special issue (content/special-issues.json) shown in full:
          its sections and every article as a card -- same layout as the
          first issue below. The issue's own page (/special/{slug}) keeps the
          longer introduction of each section. */}
      {issues.map((issue) => (
        <section key={issue.slug} className="mt-10" aria-labelledby={`issue-${issue.slug}`}>
          <p className="text-sm text-[#6b6b6b]">{issue.credit}</p>
          <h2 id={`issue-${issue.slug}`} className="section-heading mt-2 text-3xl font-bold">
            {issue.title}
          </h2>
          <p className="mt-3 text-lg text-[#4a4a4a]">{issue.subtitle}</p>
          <Link href={`/special/${issue.slug}`} className="mt-2 inline-block text-sm text-[var(--accent)] hover:underline">
            مقدمه‌ی بخش‌های این ویژه‌نامه ←
          </Link>
          {issue.sections.map((section) => (
            <div key={section.key} className="mt-8">
              <h3 className="text-2xl font-bold text-[var(--title)]">{section.title}</h3>
              <PatternCardGrid articles={section.articles} className="mt-4" />
            </div>
          ))}
          <p className="mt-4 text-sm text-[#6b6b6b]">
            {toPersianDigits(String(issue.sections.reduce((n, s) => n + s.articles.length, 0)))} نوشته در{" "}
            {toPersianDigits(String(issue.sections.length))} بخش
          </p>
        </section>
      ))}

      {/* The program's first special issue: one card per piece (listed in
          content/vizhe-nameh-avval.json), same cards as مادران و دختران.
          Each card opens the piece as a regular article page. */}
      <section className="mt-10" aria-labelledby="vizhe-nameh-avval">
        <h2 id="vizhe-nameh-avval" className="section-heading text-3xl font-bold">
          {first.title}
        </h2>
        <p className="mt-3 text-lg text-[#4a4a4a]">{first.subtitle}</p>
        <PatternCardGrid
          className="mt-6"
          cards={first.pieces.map((p) => ({
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle ? [p.subtitle] : null,
            author: p.author,
            excerpt: p.excerpt,
            date: "",
            image: p.image,
            imagePosition: p.imagePosition,
            imageAlt: "",
          }))}
        />
        <p className="mt-4 text-sm text-[#6b6b6b]">{toPersianDigits(String(first.pieces.length))} نوشته</p>
      </section>
    </div>
  );
}
