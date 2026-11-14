// What the برنامه ادبیات جهان involves, written as prose. Shared by the
// درخواست‌نامه‌ها page and each city's page so the wording stays the same.
export function ProgramDescription({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-5 text-justify text-lg leading-9 text-[#333333] ${className}`}>
      <p>
        «برنامه‌ی ادبیات جهان» یک دوره‌ی شش‌ماهه‌ی کتاب‌خوانی برای دختران نوجوان و جوان است که به ادبیات و
        خواندن علاقه دارند. هر صنف آموزگار خودش را دارد و در طول دوره، هر هفته دو جلسه برگزار می‌شود.
      </p>
      <p>
        در هر ماه یک کتاب از ادبیات جهان خوانده می‌شود و در جلسه‌ها درباره‌ی آن گفت‌وگو می‌کنیم. جلسه‌ها آنلاین
        برگزار می‌شوند و هزینه‌ی انترنت شرکت‌کنندگان را برنامه می‌پردازد.
      </p>
    </div>
  );
}
