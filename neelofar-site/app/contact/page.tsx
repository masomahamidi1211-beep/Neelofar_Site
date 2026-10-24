"use client";

import { Mail, Send } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/app/components/brand-icons";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col justify-between">
      {/* Contact Content Header */}
      <main className="mx-auto max-w-2xl px-6 py-16 text-center dir-rtl font-serif">
        <h1 className="text-3xl font-bold text-[#8c2222] mb-4">تماس با ما</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          برای ارتباط با مجله نیلوفر و برنامه ادبیات جهان می‌توانید از طریق ایمیل یا شبکه‌های اجتماعی با ما در تماس باشید.
        </p>
      </main>

      {/* Contact Footer Section */}
      <footer className="border-t border-[#e2d8c9] bg-[#f9f9f9] py-8 text-center text-sm text-[var(--muted)] font-serif">
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
              <FacebookIcon />
            </a>

            <a
              href="https://www.instagram.com/worldliteratureprogram?stkn=YWVjd3dzYzl1ZHRz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="اینستاگرام"
              className="text-[var(--ink)] transition-colors hover:text-[#8c2222]"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}