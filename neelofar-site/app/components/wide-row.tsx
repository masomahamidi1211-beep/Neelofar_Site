"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { BaruArticle } from "./article-box";

export function WideRow({ article }: { article: BaruArticle }) {
  // Determine if this article is سرسخن
  const isSarsokhan =
    article.slug.includes("sarsokhan") || article.title.includes("سرسخن");

  // Determine starting image URL
  const initialSrc = isSarsokhan
    ? "/images/zan-0.png"
    : article.image || "/images/zan-0.png";

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  // Sync state if article prop changes
  useEffect(() => {
    setImgSrc(
      isSarsokhan ? "/images/zan-0.png" : article.image || "/images/zan-0.png"
    );
  }, [article, isSarsokhan]);

  const handleImageError = () => {
    // Fallback logic for case sensitivity on Vercel/Linux
    if (imgSrc.endsWith(".png")) {
      setImgSrc(imgSrc.replace(/\.png$/, ".PNG"));
    } else if (imgSrc.endsWith(".PNG")) {
      setImgSrc(imgSrc.replace(/\.PNG$/, ".png"));
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 w-full">
      {/* 1. TEXT CONTENT (Right Side in RTL) */}
      <div className="w-full md:w-7/12 flex flex-col justify-between order-1 md:order-1">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-4">
            <Link
              href={`/articles/${article.slug}`}
              className="hover:text-[#8c2222] transition-colors"
            >
              {article.title}
            </Link>
          </h2>
          <p className="text-[#4a423c] leading-relaxed text-justify line-clamp-6 mb-6">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs font-sans text-[#786e65] pt-4 border-t border-[#d8ccbc]">
          <span>نویسنده: {article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>

      {/* 2. STICKER IMAGE CONTAINER (Left Side in RTL) */}
      <div className="w-full md:w-5/12 flex justify-center items-center p-2 shrink-0 order-2 md:order-2">
        <img
          src={imgSrc}
          alt={article.imageAlt || article.title}
          onError={handleImageError}
          className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain
                     filter drop-shadow-[0_0_4px_rgba(255,255,255,1)] 
                     drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] 
                     drop-shadow-[0_10px_20px_rgba(42,36,33,0.15)]
                     transform -rotate-1 hover:rotate-0 transition-all duration-300"
        />
      </div>
    </div>
  );
}