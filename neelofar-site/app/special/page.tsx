import Link from "next/link";
import { getSpecialIssues, getVizheNamehAvval } from "../lib/content-server";
import { HomeCardGrid } from "../components/home-card-grid";
import { toPersianDigits } from "../lib/date";

export default function SpecialPage() {
  const issues = getSpecialIssues();
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

      <div className="hairline-grid mt-5 grid-cols-1">
        {issues.map((issue) => (
          <Link
            key={issue.slug}
            href={`/special/${issue.slug}`}
            className="group block bg-white transition duration-200 hover:bg-[var(--panel)]"
          >
            <div className="hairline-cell">
              <p className="text-sm text-[#6b6b6b]">{issue.credit}</p>
              <h2 className="mt-2 text-3xl font-bold transition duration-200 group-hover:text-[var(--accent)]">
                {issue.title}
              </h2>
              <p className="mt-3 text-lg text-[#4a4a4a]">{issue.subtitle}</p>
              <p className="mt-3 text-base text-[#6b6b6b]">
                {issue.sections.reduce((n, s) => n + s.articleSlugs.length, 0)} نوشته در {issue.sections.length} بخش
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* The program's first special issue: one card per piece (listed in
          content/vizhe-nameh-avval.json), same cards as مادران و دختران.
          Each card opens the piece as a regular article page. */}
      <section className="mt-10" aria-labelledby="vizhe-nameh-avval">
        <h2 id="vizhe-nameh-avval" className="section-heading text-3xl font-bold">
          {first.title}
        </h2>
        <p className="mt-3 text-lg text-[#4a4a4a]">{first.subtitle}</p>
        <HomeCardGrid
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
