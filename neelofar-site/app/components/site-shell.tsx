"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

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

const footerLinks = [
  { href: "/notes", label: "یادداشت‌ها" },
  { href: "/special", label: "ویژه‌نامه‌ها" },
  { href: "/podcast", label: "پادکست" },
  { href: "/conversations", label: "گفتگوها" },
  { href: "/multimedia", label: "چندرسانه" },
  { href: "/about", label: "درباره ما" },
];

const programLinks = [
  { href: "/forms/kabul", label: "کابل" },
  { href: "/forms/herat", label: "هرات" },
  { href: "/forms/balkh", label: "بلخ" },
  { href: "/forms/bamyan", label: "بامیان" },
  { href: "/forms/collaboration", label: "همکاری با ما" },
];

const socialLinks = [
  { label: "تلگرام", href: "#" },
  { label: "یوتیوب", href: "#" },
  { label: "اینستاگرام", href: "#" },
  { label: "ایکس", href: "#" },
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
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <header className="sticky top-0 z-30 border-b border-[var(--hairline)] bg-white/95 backdrop-blur-sm">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="z-10 text-2xl font-bold tracking-[0.2em]">
            نیلوفر
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3.5 whitespace-nowrap text-[13px] xl:gap-5 xl:text-sm lg:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b pb-1 transition duration-200 ${
                    active
                      ? "border-[var(--accent)] font-semibold text-[var(--accent)]"
                      : "border-transparent hover:border-[var(--accent)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="باز کردن جست‌وجو"
            className="z-10 hidden text-lg transition duration-200 hover:text-[var(--accent)] lg:block"
            onClick={() => setSearchOpen(true)}
          >
            🔎
          </button>

          <div className="flex items-center gap-4 lg:hidden">
            <button
              type="button"
              aria-label="باز کردن جست‌وجو"
              className="text-lg"
              onClick={() => setSearchOpen(true)}
            >
              🔎
            </button>
            <button type="button" aria-label="باز کردن فهرست" className="text-lg" onClick={() => setMenuOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[var(--hairline)] bg-black text-[#e5e5e5]">
        <div
          className="hairline-grid grid-cols-1 border-white/10 sm:grid-cols-3 lg:grid-cols-4"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <div className="hairline-cell bg-black">
            <div className="text-xl font-bold text-white">نیلوفر</div>
            <p className="mt-4 text-sm leading-7 text-[#a3a3a3]">
              برنامه‌ای برای گسترش کتاب‌خوانی و رمان‌خوانی در میان نوجوانان و جوانان افغانستان.
            </p>
          </div>
          <div className="hairline-cell bg-black">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3a3a3]">نیلوفر</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition duration-200 hover:text-[var(--accent-light)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline-cell bg-black">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3a3a3]">برنامه‌ها</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition duration-200 hover:text-[var(--accent-light)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline-cell bg-black">
            <p className="text-sm text-[#a3a3a3]">حقوق متعلق به نیلوفر است.</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--accent-light)]">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition duration-200 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-6">
            <button
              type="button"
              aria-label="بستن جست‌وجو"
              className="absolute left-6 top-6 text-2xl"
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </button>

            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-b border-[#111111] bg-transparent pb-4 text-center text-3xl outline-none placeholder:text-[#9a9a9a] focus:border-[var(--accent)] sm:text-4xl"
              placeholder="جست‌وجو..."
            />
            <p className="mt-6 text-center text-sm text-[#6b6b6b]">
              کلمات را شما جستجو کنید، متن‌ها را ما پیدا می‌کنیم.
            </p>

            <div className="mt-10 space-y-1">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="block border-b border-[var(--hairline)] py-4 text-center text-lg font-semibold transition duration-200 hover:text-[var(--accent)]"
                  >
                    {item.title}
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-[#6b6b6b]">چیزی پیدا نشد.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-sm border-l border-[var(--hairline)] bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">فهرست</div>
              <button type="button" aria-label="بستن فهرست" className="text-xl" onClick={() => setMenuOpen(false)}>
                ✕
              </button>
            </div>
            <nav className="mt-8 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b border-[var(--hairline)] py-4 text-base ${
                    isActive(pathname, item.href) ? "font-semibold text-[var(--accent)]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}
