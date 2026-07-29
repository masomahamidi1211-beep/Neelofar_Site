import Link from "next/link";

export function PullQuote({
  quote,
  source,
  href,
}: {
  quote: string;
  source: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block border-y border-[var(--hairline)] bg-[#ece9f6] transition duration-200 hover:bg-[#ddd6ef]"
    >
      <div className="mx-auto max-w-4xl px-4 py-4 text-center sm:px-6 lg:px-8">
        <p className="text-2xl font-bold leading-[1.8] sm:text-3xl">
          «{quote}»
        </p>
        <p className="mt-3 text-base text-[#6b6b6b] transition duration-200 group-hover:text-[var(--accent)]">
          {source} ←
        </p>
      </div>
    </Link>
  );
}
