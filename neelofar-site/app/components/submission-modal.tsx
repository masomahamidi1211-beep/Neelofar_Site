"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionModal({ isOpen, onClose }: SubmissionModalProps) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dir-rtl font-serif"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl text-center text-[#111]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-4 left-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[#8c2222]">
          شرایط ارسال اثر برای نیلوفر
        </h2>

        <ul className="text-right text-base leading-relaxed space-y-3 mb-6 text-gray-800 list-disc list-inside">
          <li>متنِ خود را در قالبِ فایل ورد ارسال کنید.</li>
          <li>نام و شمارهٔ تماسِ خود را در آغازِ متن بنویسید.</li>
        </ul>

        <p className="mb-6 text-base font-semibold text-gray-700">
          از همکاری‌تان با نیلوفر متشکریم.
        </p>

        <a
          href="mailto:worldliteratureprogram@gmail.com?subject=ارسال اثر برای نیلوفر"
          className="inline-block bg-black hover:bg-[#8c2222] text-white px-8 py-3 rounded text-base font-medium transition-colors"
        >
          ارسال ایمیل
        </a>
      </div>
    </div>
  );
}