"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group mono-label inline-flex items-center gap-3 text-crema/70 transition-colors hover:text-crema"
    >
      Volver arriba
      <span className="grid h-10 w-10 place-items-center rounded-full bg-lemon text-tinta transition-transform duration-300 group-hover:-translate-y-1">
        <ArrowUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
    </button>
  );
}
