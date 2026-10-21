"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Shape } from "./Brand";

// Formulario en forma de frase ("Hola CoFi, me llamo ___…"), con la tipografía y
// colores del manual. Mismos datos que antes + campo trampa anti-bots.
const blank =
  "mx-1 inline-block min-w-0 border-0 border-b-[2.5px] border-tinta bg-transparent px-1 pb-0.5 align-baseline font-display text-[22px] font-bold text-tinta outline-none transition-colors placeholder:font-normal placeholder:text-tinta/35 focus:border-watermelon focus:ring-0 sm:text-[28px]";

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
      <div className="relative flex min-h-[460px] animate-fade-in flex-col items-start justify-center" role="status">
        <Shape type="flor" color="watermelon" className="h-20 w-20" />
        <p className="title-pop mt-8 text-[44px] sm:text-[56px]">¡Gracias{firstName ? `, ${firstName}` : ""}!</p>
        <p className="mt-4 max-w-sm text-[17px] leading-relaxed">Ya tenemos tu idea en el laboratorio. Te respondemos a la brevedad.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-outline mt-10">
          Escribir otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative">
      <p className="mono-label text-watermelon">Formulario</p>
      <p className="title-pop mt-3 text-[40px] sm:text-[52px]">Hola CoFi:</p>

      <div className="mt-8 font-display text-[22px] leading-[2.3] sm:text-[28px]">
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
          className={cn(blank, "w-[9ch] sm:w-[11ch]")}
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
          className={cn(blank, "w-full sm:w-[16ch]")}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="font-display text-[22px] sm:text-[28px]">Me interesa…</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {services.map((service) => {
            const active = selected.includes(service);
            return (
              <label
                key={service}
                className={cn(
                  "inline-flex cursor-pointer select-none items-center gap-2 rounded-full border-[1.5px] px-4 py-2.5 font-display text-[15px] font-bold transition-all duration-200",
                  active ? "border-tinta bg-lemon" : "border-tinta/25 bg-crema hover:border-tinta"
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => setSelected((current) => (active ? current.filter((item) => item !== service) : [...current, service]))}
                />
                <span
                  className={cn("grid h-5 w-5 place-items-center rounded-full transition-colors", active ? "bg-tinta text-lemon" : "border-[1.5px] border-tinta/30 text-transparent")}
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {service}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-10 block">
        <span className="font-display text-[22px] sm:text-[28px]">Les cuento un poco:</span>
        <textarea
          name="message"
          rows={5}
          maxLength={3000}
          placeholder="Mi marca es… quiero lograr…"
          className="mt-4 block w-full resize-y border-[1.5px] border-tinta bg-crema px-4 py-3 text-[16px] leading-relaxed outline-none transition-colors placeholder:text-tinta/40 focus:border-watermelon focus:ring-0"
        />
      </label>

      {/* Campo trampa para bots: las personas no lo ven */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-6 border-l-4 border-watermelon bg-watermelon/10 px-4 py-3 text-[15px]">
          {error}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
        <p className="mono-label">Firmado, {name.trim() ? name.trim().split(" ")[0] : "vos"}</p>
        <button type="submit" disabled={status === "sending"} className="btn-watermelon px-7 py-4 text-[16px] disabled:opacity-60">
          {status === "sending" ? "Enviando…" : "Enviar al laboratorio"}
          {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" strokeWidth={2} />}
        </button>
      </div>
    </form>
  );
}
