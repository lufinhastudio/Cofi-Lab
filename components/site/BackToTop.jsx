"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-3 font-display text-[10px] uppercase tracking-label text-paper/60 transition-colors hover:text-paper"
      aria-label="Volver arriba"
    >
      Volver arriba
      <span className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-paper">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
          <path d="M5 16V1M1 5l4-4 4 4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </span>
    </button>
  );
}
