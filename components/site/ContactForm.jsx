"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "./icons";
import { Sparkle } from "./Doodles";

// Formulario en forma de carta: se completa como una frase.
// Mismos datos que antes (nombre, email, servicios, mensaje) + campo trampa anti-bots.
const blank =
  "mx-1 inline-block min-w-0 border-0 border-b-2 border-dashed border-stone/60 bg-transparent px-1 pb-0.5 align-baseline font-display text-[18px] font-normal text-bordo outline-none transition-colors placeholder:font-light placeholder:text-stone/50 focus:border-solid focus:border-bordo focus:ring-0 sm:text-[22px]";

export function ContactForm({ services }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          services: selected,
          website: data.get("website")
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "No pudimos enviar el mensaje. Probá de nuevo.");
      setStatus("sent");
      form.reset();
      setSelected([]);
    } catch (submitError) {
      setStatus("idle");
      setError(submitError.message);
    }
  }

  if (status === "sent") {
    const firstName = name.trim().split(" ")[0];
    return (
      <div className="relative flex min-h-[460px] animate-fade-in flex-col items-center justify-center text-center" role="status">
        <p className="font-hand text-[34px] leading-none text-bordo">¡Llegó al laboratorio!</p>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink">
          Gracias{firstName ? `, ${firstName}` : ""}. Ya tenemos tu idea en la mesa de pruebas: te respondemos a la brevedad.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="group mt-10 inline-flex items-center gap-3 font-display text-[11px] uppercase tracking-label text-muted transition-colors hover:text-heading">
          Escribir otro mensaje
          <ArrowIcon className="h-2.5 w-8 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative">
      <p className="font-hand text-[30px] leading-none text-bordo sm:text-[36px]">¡Hola CoFi!</p>

      <div className="mt-8 font-display text-[18px] font-light leading-[2.4] text-heading sm:text-[22px]">
        Me llamo
        <label className="sr-only" htmlFor="contact-name">
          Tu nombre
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          placeholder="tu nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={cn(blank, "w-[11ch] sm:w-[13ch]")}
        />
        y me pueden escribir a
        <label className="sr-only" htmlFor="contact-email">
          Tu correo electrónico
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="tu@mail.com"
          className={cn(blank, "w-full sm:w-[18ch]")}
        />
        .
      </div>

      <fieldset className="mt-8">
        <legend className="font-display text-[18px] font-light text-heading sm:text-[22px]">Me interesa…</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {services.map((service, index) => {
            const active = selected.includes(service);
            return (
              <label
                key={service}
                className={cn(
                  "group inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition-all duration-300",
                  active
                    ? "-rotate-1 border-bordo bg-bordo text-white shadow-[0_8px_20px_-10px_rgb(122_52_24/0.6)]"
                    : "border-heading/20 bg-white/40 text-ink hover:-translate-y-0.5 hover:border-heading/50",
                  index % 2 === 1 && active && "rotate-1"
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => setSelected((current) => (active ? current.filter((item) => item !== service) : [...current, service]))}
                />
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded-full border transition-all duration-300",
                    active ? "border-white bg-white text-bordo" : "border-heading/30 text-transparent group-hover:border-heading/60"
                  )}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
                    <path d="M2.5 6.5l2.2 2L9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {service}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-10 block">
        <span className="font-display text-[18px] font-light text-heading sm:text-[22px]">Les cuento un poco:</span>
        <span className="relative mt-3 block">
          <textarea
            name="message"
            rows={5}
            maxLength={3000}
            placeholder="Mi marca es… quiero lograr… "
            className="block w-full resize-y rounded-none border-0 bg-[linear-gradient(transparent_31px,rgb(151_147_142/0.35)_32px)] bg-[length:100%_32px] bg-local px-0 pt-1 text-[15px] leading-8 text-heading outline-none placeholder:text-stone/60 focus:ring-0"
          />
        </span>
      </label>

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-6 text-[14px] text-[#9b3b2f]">
          {error}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <p className="flex items-center gap-2 font-hand text-[22px] text-bordo">
          Firmado, {name.trim() ? name.trim().split(" ")[0] : "vos"}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-heading py-4 pl-8 pr-6 font-display text-[11px] uppercase tracking-label text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        >
          <span className="absolute inset-0 -translate-x-full bg-bordo transition-transform duration-500 ease-out group-hover:translate-x-0" aria-hidden="true" />
          <span className="relative">{status === "sending" ? "Enviando…" : "Enviar al laboratorio"}</span>
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-[-35deg]">
            {status === "sending" ? <Sparkle draw={false} className="h-4 w-4 animate-spin text-white" /> : <ArrowIcon className="h-2.5 w-4" />}
          </span>
        </button>
      </div>
    </form>
  );
}
