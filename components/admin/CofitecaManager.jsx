"use client";

import { useState } from "react";
import { BookOpen, Eye, EyeOff, Info, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/client/api";
import { COFITECA_CATEGORIES } from "@/lib/content/options";
import { cn } from "@/lib/utils";
import { GalleryField, thumb } from "./ImageFields";
import { Badge, Button, Card, EmptyState, ErrorList, Field, Modal, MoveButtons, moveItem, PageHeader, Select, TextArea, TextInput, Toggle, useConfirm, useToast } from "./ui";

const blank = { name: "", category: "libro", shortDescription: "", description: "", images: [], whatsappMessage: "", linkUrl: "", visible: true };

export function CofitecaManager({ initialItems }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(null);
  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const open = (item) => {
    setEditing(item ? item.id : "new");
    setForm(
      item
        ? {
            name: item.name,
            slug: item.slug,
            category: item.category,
            shortDescription: item.shortDescription,
            description: item.description,
            images: item.images.map((image) => ({ url: image.url, alt: image.alt || "" })),
            whatsappMessage: item.whatsappMessage,
            linkUrl: item.linkUrl,
            visible: item.visible
          }
        : blank
    );
    setErrors([]);
  };

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setErrors([]);
    try {
      if (editing === "new") {
        const { product } = await api("/api/admin/cofiteca", { method: "POST", body: form });
        setItems((current) => [...current, product]);
      } else {
        const { product } = await api(`/api/admin/cofiteca/${editing}`, { method: "PUT", body: form });
        setItems((current) => current.map((item) => (item.id === editing ? product : item)));
      }
      toast("Producto guardado.");
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
      const { product } = await api(`/api/admin/cofiteca/${item.id}`, { method: "PATCH", body: { visible: !item.visible } });
      setItems((current) => current.map((entry) => (entry.id === item.id ? product : entry)));
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
      await api("/api/admin/cofiteca/reorder", { method: "POST", body: { ids: next.map((item) => item.id) } });
    } catch (error) {
      setItems(previous);
      toast(error.message, "error");
    }
  }

  async function remove(item) {
    const ok = await confirm({ title: `¿Eliminar «${item.name}»?`, message: "El producto se borra del catálogo. No se puede deshacer.", confirmLabel: "Eliminar", danger: true });
    if (!ok) return;
    setBusy(item.id);
    try {
      await api(`/api/admin/cofiteca/${item.id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      toast("Producto eliminado.");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="La Cofiteca"
        description="Libros, juegos y productos propios."
        actions={
          <Button onClick={() => open(null)}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Nuevo producto
          </Button>
        }
      />
      <div className="mb-5 flex gap-3 rounded-2xl bg-lemon/70 p-4 text-[14px]">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <strong>Todavía no se publica en la web.</strong> Pueden ir cargando el catálogo tranquilas: la página pública de La Cofiteca se habilita aparte cuando
          esté lista. Mientras tanto, el pie de página muestra la etiqueta «Próximamente» (se cambia en Configuración).
        </p>
      </div>
      {!items.length ? (
        <EmptyState icon={BookOpen} title="El catálogo está vacío" text="Agregá el primer libro, juego o producto." action={<Button onClick={() => open(null)}>Agregar producto</Button>} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <Card className={cn("flex h-full flex-col overflow-hidden", busy === item.id && "opacity-60")}>
                <div className="relative aspect-[4/3] bg-arena">
                  {item.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(item.images[0].url, 500)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="absolute inset-0 m-auto h-8 w-8 text-tinta/25" aria-hidden="true" />
                  )}
                  <span className="absolute left-2 top-2 flex gap-1.5">
                    <Badge tone="neutral">{COFITECA_CATEGORIES[item.category] || item.category}</Badge>
                    {!item.visible ? <Badge tone="hidden">Oculto</Badge> : null}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-display text-[16px] font-bold">{item.name}</p>
                  {item.shortDescription ? <p className="mt-1 line-clamp-2 text-[13px] text-muted">{item.shortDescription}</p> : null}
                  <div className="mt-auto flex flex-wrap items-center gap-1 pt-4">
                    <MoveButtons index={index} total={items.length} onMove={(from, to) => reorder(moveItem(items, from, to))} label="producto" />
                    <button
                      type="button"
                      onClick={() => toggleVisible(item)}
                      className="grid h-9 w-9 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5"
                      aria-label={item.visible ? "Ocultar" : "Mostrar"}
                      title={item.visible ? "Ocultar" : "Mostrar"}
                    >
                      {item.visible ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                    </button>
                    <Button size="sm" className="ml-auto" onClick={() => open(item)}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Editar
                    </Button>
                    <button type="button" onClick={() => remove(item)} className="grid h-9 w-9 place-items-center rounded-full text-[#c23434] hover:bg-watermelon/10" aria-label={`Eliminar ${item.name}`}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onClose={() => !saving && setEditing(null)} title={editing === "new" ? "Nuevo producto" : "Editar producto"} size="xl">
        <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre" required htmlFor="p-name">
            <TextInput id="p-name" maxLength={120} value={form.name} onChange={(event) => set({ name: event.target.value })} />
          </Field>
          <Field label="Categoría" htmlFor="p-category">
            <Select id="p-category" options={COFITECA_CATEGORIES} value={form.category} onChange={(event) => set({ category: event.target.value })} />
          </Field>
          <Field label="Descripción corta" htmlFor="p-short" className="sm:col-span-2">
            <TextInput id="p-short" maxLength={300} value={form.shortDescription} onChange={(event) => set({ shortDescription: event.target.value })} />
          </Field>
          <Field label="Descripción" htmlFor="p-desc" className="sm:col-span-2">
            <TextArea id="p-desc" rows={5} maxLength={4000} value={form.description} onChange={(event) => set({ description: event.target.value })} />
          </Field>
          <Field label="Imágenes" className="sm:col-span-2" help="La primera es la portada.">
            <GalleryField value={form.images} onChange={(images) => set({ images })} scope="cofiteca" max={12} />
          </Field>
          <Field label="Link (opcional)" htmlFor="p-link" help="Tienda, ficha del libro, etc.">
            <TextInput id="p-link" type="url" placeholder="https://" maxLength={600} value={form.linkUrl} onChange={(event) => set({ linkUrl: event.target.value })} />
          </Field>
          <Field label="Mensaje de WhatsApp (opcional)" htmlFor="p-wa" help="Texto que se precarga al consultar.">
            <TextInput id="p-wa" maxLength={500} value={form.whatsappMessage} onChange={(event) => set({ whatsappMessage: event.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Toggle checked={form.visible} onChange={(visible) => set({ visible })} label="Visible en el catálogo" description="Cuando se habilite la página pública." />
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
