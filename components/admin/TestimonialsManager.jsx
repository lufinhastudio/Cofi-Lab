"use client";

import { useState } from "react";
import { Eye, EyeOff, MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/client/api";
import { cn } from "@/lib/utils";
import { ImageField, thumb } from "./ImageFields";
import { Badge, Button, Card, EmptyState, ErrorList, Field, Modal, MoveButtons, moveItem, PageHeader, TextArea, TextInput, Toggle, useConfirm, useToast } from "./ui";

const blank = { quote: "", authorName: "", company: "", imageUrl: "", visible: true };

export function TestimonialsManager({ initialItems }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(null);

  const open = (item) => {
    setEditing(item ? item.id : "new");
    setForm(item ? { quote: item.quote, authorName: item.authorName, company: item.company, imageUrl: item.imageUrl, visible: item.visible } : blank);
    setErrors([]);
  };

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setErrors([]);
    try {
      if (editing === "new") {
        const { testimonial } = await api("/api/admin/testimonials", { method: "POST", body: form });
        setItems((current) => [...current, testimonial]);
        toast(testimonial.visible ? "Testimonio agregado y publicado." : "Testimonio guardado (oculto).");
      } else {
        const { testimonial } = await api(`/api/admin/testimonials/${editing}`, { method: "PUT", body: form });
        setItems((current) => current.map((item) => (item.id === editing ? testimonial : item)));
        toast("Testimonio actualizado.");
      }
      setEditing(null);
    } catch (error) {
      setErrors(error.messages || [error.message]);
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(item) {
    setBusy(item.id);
    try {
      const { testimonial } = await api(`/api/admin/testimonials/${item.id}`, { method: "PATCH", body: { visible: !item.visible } });
      setItems((current) => current.map((entry) => (entry.id === item.id ? testimonial : entry)));
      toast(testimonial.visible ? "Testimonio visible en la web." : "Testimonio oculto.");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(null);
    }
  }

  async function reorder(next) {
    const previous = items;
    setItems(next);
    try {
      await api("/api/admin/testimonials/reorder", { method: "POST", body: { ids: next.map((item) => item.id) } });
    } catch (error) {
      setItems(previous);
      toast(error.message, "error");
    }
  }

  async function remove(item) {
    const ok = await confirm({
      title: `¿Eliminar el testimonio de ${item.authorName}?`,
      message: "Deja de verse en la web y no se puede recuperar. Si solo querés sacarlo un tiempo, ocultalo.",
      confirmLabel: "Eliminar",
      danger: true
    });
    if (!ok) return;
    setBusy(item.id);
    try {
      await api(`/api/admin/testimonials/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast("Testimonio eliminado.");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contenido"
        title="Testimonios"
        description="Se muestran en el carrusel del inicio, en este orden. Cada uno lleva una foto del trabajo con esa marca."
        actions={
          <Button onClick={() => open(null)}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo testimonio
          </Button>
        }
      />
      {!items.length ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No hay testimonios"
          text="Mientras no haya testimonios visibles, el carrusel no aparece en el inicio."
          action={<Button onClick={() => open(null)}>Agregar testimonio</Button>}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <Card className={cn("flex flex-col gap-4 p-4 sm:flex-row sm:items-center", busy === item.id && "opacity-60", !item.visible && "bg-white/60")}>
                <div className="flex min-w-0 flex-1 gap-4">
                  <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-arena">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb(item.imageUrl, 200)} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[16px] font-bold">
                      {item.authorName}
                      {item.company ? <span className="font-normal text-muted"> · {item.company}</span> : null}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[14px] text-tinta/75">“{item.quote}”</p>
                    <div className="mt-2">{item.visible ? <Badge tone="published">Visible</Badge> : <Badge tone="hidden">Oculto</Badge>}</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <MoveButtons index={index} total={items.length} onMove={(from, to) => reorder(moveItem(items, from, to))} label="testimonio" />
                  <Button variant="secondary" size="sm" onClick={() => toggleVisible(item)} disabled={busy === item.id}>
                    {item.visible ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                    {item.visible ? "Ocultar" : "Mostrar"}
                  </Button>
                  <Button size="sm" onClick={() => open(item)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Editar
                  </Button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="grid h-9 w-9 place-items-center rounded-full text-[#c23434] hover:bg-watermelon/10"
                    aria-label={`Eliminar testimonio de ${item.authorName}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onClose={() => !saving && setEditing(null)} title={editing === "new" ? "Nuevo testimonio" : "Editar testimonio"} size="lg">
        <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-[200px_minmax(0,1fr)]">
          <Field label="Foto" required={form.visible} help="Foto del trabajo con esa marca.">
            <ImageField value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} scope="testimonials" aspect="aspect-[4/3]" label="foto" />
          </Field>
          <div className="grid content-start gap-4">
            <Field label="Nombre" required htmlFor="t-name">
              <TextInput id="t-name" maxLength={80} value={form.authorName} onChange={(event) => setForm((current) => ({ ...current, authorName: event.target.value }))} placeholder="Ej: Nico" />
            </Field>
            <Field label="Empresa o rol" htmlFor="t-company">
              <TextInput id="t-company" maxLength={80} value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} placeholder="Ej: Socio de Angus" />
            </Field>
          </div>
          <Field label="Testimonio" required htmlFor="t-quote" className="sm:col-span-2">
            <TextArea id="t-quote" rows={5} maxLength={1200} value={form.quote} onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))} />
          </Field>
          <div className="sm:col-span-2">
            <Toggle checked={form.visible} onChange={(visible) => setForm((current) => ({ ...current, visible }))} label="Mostrar en la web" />
          </div>
          <ErrorList messages={errors} className="sm:col-span-2" />
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
