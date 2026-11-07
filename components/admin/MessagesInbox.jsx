"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Inbox, Mail, MailOpen, Reply, Search, Trash2 } from "lucide-react";
import { api } from "@/lib/client/api";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, EmptyState, PageHeader, TextInput, useConfirm, useToast } from "./ui";

const formatDate = (iso) => new Date(iso).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" });

export function MessagesInbox({ initialMessages }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [messages, setMessages] = useState(initialMessages);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const unread = messages.filter((message) => !message.read).length;
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return messages.filter(
      (message) =>
        (filter === "all" || (filter === "unread" ? !message.read : message.read)) &&
        (!text || `${message.name} ${message.email} ${message.message} ${message.services.join(" ")}`.toLowerCase().includes(text))
    );
  }, [messages, filter, query]);
  const selected = messages.find((message) => message.id === selectedId) || null;

  async function setRead(message, read, { silent = false } = {}) {
    setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, read } : item)));
    try {
      await api(`/api/admin/messages/${message.id}`, { method: "PATCH", body: { read } });
      if (!silent) toast(read ? "Marcado como leído." : "Marcado como no leído.");
      router.refresh();
    } catch (error) {
      setMessages((current) => current.map((item) => (item.id === message.id ? { ...item, read: !read } : item)));
      toast(error.message, "error");
    }
  }

  function openMessage(message) {
    setSelectedId(message.id);
    if (!message.read) setRead(message, true, { silent: true });
  }

  async function remove(message) {
    const ok = await confirm({
      title: `¿Eliminar el mensaje de ${message.name}?`,
      message: "Se borra definitivamente del panel. No se puede deshacer.",
      confirmLabel: "Eliminar",
      danger: true
    });
    if (!ok) return;
    try {
      await api(`/api/admin/messages/${message.id}`, { method: "DELETE" });
      setMessages((current) => current.filter((item) => item.id !== message.id));
      setSelectedId(null);
      toast("Mensaje eliminado.");
      router.refresh();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  return (
    <>
      <PageHeader eyebrow="Contacto" title="Mensajes recibidos" description="Las consultas que llegan desde el formulario de la web." />
      {!messages.length ? (
        <EmptyState icon={Inbox} title="Todavía no llegaron mensajes" text="Cuando alguien complete el formulario de Contacto, la consulta aparece acá." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <div className={cn("min-w-0", selected && "hidden lg:block")}>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {[
                ["all", `Todos ${messages.length}`],
                ["unread", `No leídos ${unread}`],
                ["read", "Leídos"]
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={cn("rounded-full px-3.5 py-2 text-[13px] font-bold", filter === key ? "bg-tinta text-crema" : "bg-white hover:bg-tinta/5")}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="relative mb-3 block">
              <span className="sr-only">Buscar mensajes</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, email o texto" className="pl-10" />
            </label>
            <Card className="overflow-hidden">
              {filtered.length ? (
                <ul className="divide-y divide-line">
                  {filtered.map((message) => (
                    <li key={message.id}>
                      <button
                        type="button"
                        onClick={() => openMessage(message)}
                        className={cn("flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-arena/60", selectedId === message.id && "bg-periwinkle/25")}
                      >
                        <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", message.read ? "bg-transparent" : "bg-watermelon")} aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className={cn("truncate text-[15px]", message.read ? "font-medium" : "font-bold")}>{message.name}</span>
                            <span className="shrink-0 text-[12px] text-muted">{new Date(message.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</span>
                          </span>
                          <span className="block truncate text-[13px] text-muted">{message.message || message.services.join(", ") || message.email}</span>
                        </span>
                        <span className="sr-only">{message.read ? "Leído" : "No leído"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-8 text-center text-[14px] text-muted">No hay mensajes con este filtro.</p>
              )}
            </Card>
          </div>

          <div className={cn("min-w-0", !selected && "hidden lg:block")}>
            {selected ? (
              <Card className="p-5 sm:p-7">
                <button type="button" onClick={() => setSelectedId(null)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-tinta lg:hidden">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a la lista
                </button>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-[22px] font-black">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-[14px] font-semibold underline-offset-4 hover:underline [overflow-wrap:anywhere]">
                      {selected.email}
                    </a>
                    <p className="mt-1 text-[12px] text-muted">Recibido el {formatDate(selected.createdAt)}</p>
                  </div>
                  {selected.read ? <Badge tone="neutral">Leído</Badge> : <Badge tone="unread">No leído</Badge>}
                </div>
                {selected.services.length ? (
                  <div className="mt-5">
                    <p className="mono-label text-muted">Le interesa</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selected.services.map((service) => (
                        <Badge key={service} tone="neutral" className="bg-lemon">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-arena/70 p-4 text-[15px] leading-relaxed">{selected.message || "(Sin mensaje escrito)"}</div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent("Tu consulta a CoFi")}`}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-tinta px-5 text-[14px] font-bold text-crema hover:bg-cacao"
                  >
                    <Reply className="h-4 w-4" aria-hidden="true" /> Responder por email
                  </a>
                  <Button variant="secondary" onClick={() => setRead(selected, !selected.read)}>
                    {selected.read ? <Mail className="h-4 w-4" aria-hidden="true" /> : <MailOpen className="h-4 w-4" aria-hidden="true" />}
                    {selected.read ? "Marcar como no leído" : "Marcar como leído"}
                  </Button>
                  <Button variant="danger-ghost" onClick={() => remove(selected)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Eliminar
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid h-full min-h-[240px] place-items-center rounded-2xl border border-dashed border-tinta/15 text-[14px] text-muted">Elegí un mensaje para leerlo.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
