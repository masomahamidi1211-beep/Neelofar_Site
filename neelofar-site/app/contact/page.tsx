import { Mail, Send } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "./brand-icons";

export default function Footer() {
  return (
    <footer className="border-t border-[#e2d8c9] bg-[#f9f9f9] py-8 text-center text-sm text-[var(--muted)]">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
        <p>© ۱۴۰۵ نیلوفر — برنامه ادبیات جهان</p>

        <div className="flex items-center gap-4">
          <span className="font-medium text-[var(--ink)]">ارتباط با ما:</span>

          <a
            href="mailto:worldliteratureprogram@gmail.com"
            aria-label="ایمیل"
            className="text-[var(--ink)] transition-colors hover:text-[#8c2222]"
          >
            <Mail size={20} />
          </a>

          <a
            href="https://t.me/worldliteratureprogram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تلگرام"
            className="text-[var(--ink)] transition-colors hover:text-[#8c2222]"
          >
            <Send size={20} />
          </a>

          <a
            href="https://www.facebook.com/share/1DC6n4DkeW/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="فیس‌بوک"
            className="text-[var(--ink)] transition-colors hover:text-[#8c2222]"
          >
            <FacebookIcon size={20} />
          </a>

          <a
            href="https://www.instagram.com/worldliteratureprogram?stkn=YWVjd3dzYzl1ZHRz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="اینستاگرام"
            className="text-[var(--ink)] transition-colors hover:text-[#8c2222]"
          >
            <InstagramIcon size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}