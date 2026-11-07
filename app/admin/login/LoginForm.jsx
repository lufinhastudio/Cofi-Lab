"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const input =
  "h-12 w-full rounded-xl border border-tinta/15 bg-white px-4 text-[15px] outline-none transition-colors focus:border-tinta focus:ring-2 focus:ring-periwinkle/60";

export function LoginForm({ next = "/admin" }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "No se pudo iniciar sesión.");
      router.replace(next);
      router.refresh();
    } catch (loginError) {
      setError(loginError.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label className="grid gap-1.5 text-[14px] font-semibold">
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className={input}
        />
      </label>
      <label className="grid gap-1.5 text-[14px] font-semibold">
        Contraseña
        <span className="relative block">
          <input
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className={`${input} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-tinta/60 hover:bg-tinta/5"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </span>
      </label>
      {error ? (
        <p role="alert" className="rounded-xl border border-watermelon/40 bg-watermelon/10 px-4 py-3 text-[14px]">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tinta font-display text-[15px] font-bold text-crema transition-colors hover:bg-cacao disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
