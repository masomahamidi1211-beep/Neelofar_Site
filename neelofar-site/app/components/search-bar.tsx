"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Redirect to the search results page
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs font-serif">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو در مقالات..."
        className="w-full px-3 py-1.5 pl-8 text-xs bg-white/80 border border-[#e2d8c9] rounded-md 
                   focus:outline-none focus:ring-1 focus:ring-[#8c2222] focus:bg-white
                   text-[#2a2421] placeholder-[#a09489] transition-all"
      />
      <button
        type="submit"
        aria-label="جستجو"
        className="absolute left-2 top-1/2 -translate-y-1/2 text-[#786e65] hover:text-[#8c2222] transition-colors"
      >
        🔍
      </button>
    </form>
  );
}