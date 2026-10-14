"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-4">
      <label className="grid gap-1 text-sm">
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="h-11 rounded border border-black/20 px-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Contraseña
        <input
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          className="h-11 rounded border border-black/20 px-3"
        />
      </label>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      <button type="submit" disabled={loading} className="h-11 rounded bg-black text-sm font-medium text-white disabled:opacity-60">
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
