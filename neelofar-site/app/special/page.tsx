import Link from "next/link";
import { getSpecialIssues } from "../lib/content-server";

export default function SpecialPage() {
  const issues = getSpecialIssues();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">ویژه‌نامه‌ها</h1>
        <p className="mt-4 text-lg leading-8 text-[#4a4a4a]">
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
              <p className="text-xs text-[#6b6b6b]">{issue.credit}</p>
              <h2 className="mt-2 text-2xl font-bold transition duration-200 group-hover:text-[var(--accent)]">
                {issue.title}
              </h2>
              <p className="mt-3 text-[#4a4a4a]">{issue.subtitle}</p>
              <p className="mt-3 text-sm text-[#6b6b6b]">
                {issue.sections.reduce((n, s) => n + s.articleSlugs.length, 0)} نوشته در {issue.sections.length} بخش
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
