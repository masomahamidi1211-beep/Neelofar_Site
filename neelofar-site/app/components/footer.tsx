import Image from "next/image";
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
    <footer className="border-t border-[#333] bg-[#0a0a0a] text-white">
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:w-[77vw] lg:max-w-[1100px] lg:px-0">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="footer-link baru-focus flex shrink-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={90}
              height={90}
              className="h-16 w-16 [filter:brightness(0)_invert(1)] sm:h-[90px] sm:w-[90px]"
            />
            <span className="text-4xl font-bold text-white sm:text-5xl">نیلوفر</span>
          </Link>

          <nav
            aria-label="لینک‌های سریع"
            className="flex flex-wrap gap-x-6 gap-y-3 text-base font-semibold lg:justify-center"
          >
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="footer-link nav-underline baru-focus pb-1 text-white transition duration-150 hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <p className="text-base font-semibold text-white">ما را دنبال کنید</p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-link baru-focus text-white transition duration-150 hover:opacity-70"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#333]">
        <p className="mx-auto w-full px-4 py-4 text-center text-sm text-white sm:px-6 lg:w-[77vw] lg:max-w-[1100px] lg:px-0">
          © ۱۴۰۵ نیلوفر — برنامهٔ ادبیات جهان
        </p>
      </div>
    </footer>
  );
}
