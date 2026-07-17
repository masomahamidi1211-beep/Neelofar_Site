"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Footer from "./footer";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/notes", label: "یادداشت‌ها" },
  { href: "/special", label: "ویژه‌نامه‌ها" },
  { href: "/podcast", label: "پادکست" },
  { href: "/conversations", label: "گفتگوها" },
  { href: "/multimedia", label: "چندرسانه" },
  { href: "/recommendations", label: "توصیه‌های ما" },
  { href: "/forms", label: "درخواست‌نامه‌ها" },
  { href: "/about", label: "درباره ما" },
];

const searchItems = [
  { title: "یادداشت‌ها", href: "/notes" },
  { title: "ویژه‌نامه‌ها", href: "/special" },
  { title: "پادکست", href: "/podcast" },
  { title: "گفتگوها", href: "/conversations" },
  { title: "چندرسانه", href: "/multimedia" },
  { title: "توصیه‌های ما", href: "/recommendations" },
  { title: "درخواست‌نامه‌ها", href: "/forms" },
  { title: "درباره ما", href: "/about" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSearch = useMemo(
    () =>
      searchItems.filter((item) =>
        item.title.includes(query) || item.href.includes(query.replace("/", ""))
      ),
    [query]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-6 sm:px-6 lg:h-[110px] lg:gap-6 lg:px-8 lg:py-0">
          <Link href="/" className="baru-focus shrink-0 text-[28px] font-bold text-[var(--ink)] sm:text-[32px]">
            نیلوفر
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto whitespace-nowrap lg:flex xl:gap-6">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`baru-link-hover baru-focus text-[20px] font-bold tracking-wide transition duration-150 ${
                    active ? "text-[var(--title)]" : "text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-5">
            <button
              type="button"
              aria-label="باز کردن جست‌وجو"
              className="baru-focus baru-link-hover text-[var(--ink)] transition duration-150"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="باز کردن فهرست"
              className="baru-focus text-xl lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />

      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)]">
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-6">
            <button
              type="button"
              aria-label="بستن جست‌وجو"
              className="baru-focus absolute left-6 top-6 text-2xl"
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </button>

            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="baru-focus w-full border-b border-[var(--ink)] bg-transparent pb-4 text-center text-3xl outline-none placeholder:text-[var(--muted)] focus:border-[var(--title)] sm:text-4xl"
              placeholder="جست‌وجو..."
            />
            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              کلمات را شما جستجو کنید، متن‌ها را ما پیدا می‌کنیم.
            </p>

            <div className="mt-10 space-y-1">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="baru-focus block border-b border-[var(--line)] py-4 text-center text-lg font-semibold transition duration-200 hover:text-[var(--title)]"
                  >
                    {item.title}
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-[var(--muted)]">چیزی پیدا نشد.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)]">
          <div className="mx-auto flex h-full max-w-lg flex-col px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMenuOpen(false)} className="baru-focus text-2xl font-bold text-[var(--ink)]">
                نیلوفر
              </Link>
              <button
                type="button"
                aria-label="بستن فهرست"
                className="baru-focus text-2xl"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="mt-10 flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`baru-focus border-b border-[var(--line)] py-4 text-xl ${
                    isActive(pathname, item.href) ? "font-semibold text-[var(--title)]" : "text-[var(--ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
