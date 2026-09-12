"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import Footer from "./footer";
import PageFade from "./page-fade";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/notes", label: "یادداشت‌ها" },
  { href: "/special", label: "ویژه‌نامه‌ها" },
  { href: "/magazine", label: "مجله نیلوفر" },
  { href: "/podcast", label: "پادکست" },
  { href: "/conversations", label: "گفتگوها" },
  { href: "/multimedia", label: "چندرسانه" },
  { href: "/recommendations", label: "توصیه‌های ما" },
  { href: "/forms", label: "درخواست‌نامه‌ها" },
  { href: "/about", label: "درباره ما" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useEnterExit(open: boolean, durationMs: number) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const mountTimeout = setTimeout(() => setMounted(true), 0);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => {
        clearTimeout(mountTimeout);
        cancelAnimationFrame(raf);
      };
    }
    const hideRaf = requestAnimationFrame(() => setVisible(false));
    const timeout = setTimeout(() => setMounted(false), durationMs);
    return () => {
      cancelAnimationFrame(hideRaf);
      clearTimeout(timeout);
    };
  }, [open, durationMs]);

  return { mounted, visible };
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

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

  const search = useEnterExit(searchOpen, 250);
  const drawer = useEnterExit(menuOpen, 300);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:h-[104px] lg:w-[77vw] lg:max-w-[1100px] lg:gap-7 lg:px-0 lg:py-0">
          <Link href="/" className="baru-focus flex shrink-0 items-center gap-2 sm:gap-3" aria-label="نیلوفر، صفحه اصلی">
            <Image src="/logo.png" alt="" width={48} height={48} priority className="h-9 w-9 sm:h-12 sm:w-12" />
            <span className="flex flex-col leading-none">
              <span className="text-[28px] font-bold text-black sm:text-[34px]">نیلوفر</span>
              <span className="mt-1 hidden text-[10px] font-medium tracking-wide text-[var(--muted)] sm:block">برنامه ادبیات جهان</span>
            </span>
          </Link>

          <nav aria-label="ناوبری اصلی" className="hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto whitespace-nowrap lg:flex xl:gap-5">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`baru-focus nav-underline pb-1 text-[15px] font-bold text-black xl:text-[16px] ${
                    active ? "is-active" : ""
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
              <Search size={20} strokeWidth={1.75} />
            </button>

            <button
              type="button"
              aria-label="باز کردن فهرست"
              className="baru-focus text-2xl lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="lg:mx-[8px] lg:border-x lg:border-[#e5e5e5] lg:bg-[#f9f9f9]">
          <div className="lg:mx-auto lg:w-[77vw] lg:max-w-[1100px]">
            <PageFade key={pathname}>{children}</PageFade>
          </div>
        </div>
      </main>

      <Footer />

      {/* SEARCH OVERLAY */}
      {search.mounted && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto bg-[var(--bg)]/95 backdrop-blur-md transition-opacity duration-[250ms] ${
            search.visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-start pt-24 px-6 transition-[opacity,transform] duration-[250ms] ${
              search.visible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
            }`}
          >
            <button
              type="button"
              aria-label="بستن جست‌وجو"
              className="baru-focus absolute left-6 top-6 text-3xl hover:opacity-70"
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </button>

            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="baru-focus w-full border-b-2 border-[var(--ink)] bg-transparent pb-4 text-center text-3xl outline-none placeholder:text-[var(--muted)] focus:border-[#8c2222] sm:text-4xl"
                placeholder="جست‌وجو کنید..."
              />
            </form>
            <p className="mt-6 text-center text-base text-[var(--muted)]">
              عنوان یا متن مورد نظر را تایپ کرده و کلید Enter را فشار دهید.
            </p>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {drawer.mounted && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
              drawer.visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-40 w-full max-w-sm bg-[var(--bg)] shadow-2xl transition-transform duration-300 ease-out ${
              drawer.visible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col px-6 py-6">
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setMenuOpen(false)} className="baru-focus flex items-center gap-2 text-3xl font-bold text-black">
                  <Image src="/logo.png" alt="" width={36} height={36} className="h-8 w-8" />
                  نیلوفر
                </Link>
                <button
                  type="button"
                  aria-label="بستن فهرست"
                  className="baru-focus text-3xl"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={28} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="mt-10 flex flex-1 flex-col justify-center gap-2 overflow-y-auto">
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`baru-focus border-b border-b-[var(--line)] py-4 ps-4 text-2xl text-black transition duration-150 hover:opacity-60 ${
                        active ? "border-s-2 border-s-black font-semibold" : "border-s-2 border-s-transparent"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}