"use client";

import { useState } from "react";
import { ExternalLink, RotateCcw } from "lucide-react";
import { api } from "@/lib/client/api";
import { SchemaForm } from "./SchemaForm";
import { Button, ErrorList, PageHeader, SaveBar, useConfirm, useToast, useUnsavedWarning } from "./ui";

// Editor de un área de contenido (Inicio, Nosotras, Contacto, Configuración…).
export function ContentEditor({ areaKey, area, initial, updatedAt: initialUpdatedAt, customized: initialCustomized, eyebrow = "Contenido del sitio" }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [customized, setCustomized] = useState(initialCustomized);
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);
  useUnsavedWarning(dirty);

  async function save() {
    setSaving(true);
    setErrors([]);
    try {
      const result = await api(`/api/admin/content/${areaKey}`, { method: "PUT", body: value });
      setSaved(result.data);
      setValue(result.data);
      setUpdatedAt(result.updatedAt);
      setCustomized(true);
      toast("Cambios guardados y publicados en la web.");
    } catch (error) {
      setErrors(error.messages || [error.message]);
      toast(error.message, "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    const ok = await confirm({
      title: "¿Volver a los textos originales?",
      message: `Se descartan todas las ediciones de «${area.title}» y vuelven los textos y fotos con los que se lanzó la web. No se puede deshacer.`,
      confirmLabel: "Restablecer",
      danger: true
    });
    if (!ok) return;
    setSaving(true);
    try {
      const result = await api(`/api/admin/content/${areaKey}`, { method: "DELETE" });
      setSaved(result.data);
      setValue(result.data);
      setUpdatedAt(null);
      setCustomized(false);
      toast("Se restablecieron los textos originales.");
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={area.title}
        description={area.description}
        actions={
          area.path ? (
            <a href={area.path} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-tinta/20 bg-white px-3.5 text-[13px] font-bold hover:border-tinta">
              Ver en la web <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null
        }
      >
        {updatedAt ? (
          <p className="mt-2 text-[12px] text-muted">
            Última edición: {new Date(updatedAt).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        ) : null}
      </PageHeader>
      <ErrorList messages={errors} className="mb-5" />
      <SchemaForm fields={area.fields} value={value} onChange={setValue} />
      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={() => setValue(saved)} savedAt={updatedAt}>
        {customized ? (
          <Button variant="ghost" size="sm" onClick={reset} disabled={saving}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Textos originales
          </Button>
        ) : null}
      </SaveBar>
    </>
  );
}
