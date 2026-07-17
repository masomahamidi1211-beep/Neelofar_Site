import Link from "next/link";
import { Send } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./brand-icons";

const quickLinks = [
  { href: "/notes", label: "یادداشت‌ها" },
  { href: "/special", label: "ویژه‌نامه‌ها" },
  { href: "/podcast", label: "پادکست" },
  { href: "/conversations", label: "گفتگوها" },
  { href: "/multimedia", label: "چندرسانه" },
  { href: "/about", label: "درباره ما" },
];

// Neelofar's only 4 real accounts. Do not add any other platform here.
const socialLinks = [
  { label: "فیسبوک", href: "https://www.facebook.com/worldliteratureprogram", Icon: FacebookIcon },
  { label: "اینستاگرام", href: "https://www.instagram.com/worldliteratureprogram/", Icon: InstagramIcon },
  { label: "تلگرام", href: "https://t.me/worldliteratureprogram", Icon: Send },
  { label: "لینکدین", href: "https://www.linkedin.com/company/the-world-literature-program/", Icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg)] text-[var(--ink)]">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="baru-focus shrink-0 text-3xl font-bold text-[var(--ink)] sm:text-4xl">
            نیلوفر
          </Link>

          <nav
            aria-label="لینک‌های سریع"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold lg:justify-center"
          >
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="baru-focus baru-link-hover transition duration-150">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-[var(--muted)]">ما را دنبال کنید</p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="baru-focus baru-link-hover text-[var(--ink)] transition duration-150"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)]">
        <p className="mx-auto max-w-[1600px] px-4 py-4 text-center text-xs text-[var(--muted)] sm:px-6 lg:px-8">
          © ۱۴۰۵ نیلوفر — برنامهٔ ادبیات جهان
        </p>
      </div>
    </footer>
  );
}
