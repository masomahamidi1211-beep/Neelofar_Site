import Link from "next/link";

const forms = [
  { slug: "kabul", label: "کابل" },
  { slug: "herat", label: "هرات" },
  { slug: "balkh", label: "بلخ" },
  { slug: "bamyan", label: "بامیان" },
  { slug: "collaboration", label: "همکاری با ما" },
];

export default function FormsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">درخواست‌نامه‌ها</h1>
        <p className="mt-4 text-lg leading-8 text-[#4a4a4a]">
          نیلوفر فعلاً «برنامه ادبیات جهان» را در شهرهای کابل، هرات، بلخ و بامیان برای دختران نوجوان و جوان برگزار
          می‌کند. در صورت علاقمندی به اشتراک در برنامه‌ی ما، می‌توانید از طریق فرم زیرین درخواست بدهید.
        </p>
      </div>
      <div className="hairline-grid mt-8 grid-cols-1 md:grid-cols-2">
        {forms.map((form) => (
          <Link key={form.slug} href={`/forms/${form.slug}`} className="group block bg-white transition duration-200 hover:bg-[var(--panel)]">
            <div className="hairline-cell">
              <h2 className="text-xl font-bold transition duration-200 group-hover:text-[var(--accent)]">{form.label}</h2>
              <p className="mt-3 text-sm text-[#4a4a4a]">مشاهده‌ی فرم{form.slug === "collaboration" ? " همکاری" : " درخواست"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
