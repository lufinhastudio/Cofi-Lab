"use client";

import { useId, useState } from "react";
import { ChevronDown, Copy, Info, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageField, thumb } from "./ImageFields";
import { Button, Card, Field, MoveButtons, moveItem, Select, TextArea, TextInput, Toggle, ToneSelect, useConfirm } from "./ui";

// Arma un formulario a partir de un esquema de lib/content/schemas.js.
// Las administradoras solo completan contenido: el diseño queda fijo.

export function TagsInput({ value = [], onChange, max = 60, maxItems = 20, placeholder = "Escribí y apretá Enter", id }) {
  const [draft, setDraft] = useState("");
  const add = (text) => {
    const clean = text.trim().slice(0, max);
    if (!clean || value.some((item) => item.toLowerCase() === clean.toLowerCase()) || value.length >= maxItems) return;
    onChange([...value, clean]);
    setDraft("");
  };
  return (
    <div className="rounded-xl border border-tinta/15 bg-white p-2 focus-within:border-tinta focus-within:ring-2 focus-within:ring-periwinkle/60">
      {value.length ? (
        <ul className="mb-1 flex flex-wrap gap-1.5">
          {value.map((item, index) => (
            <li key={`${item}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-arena py-1 pl-3 pr-1 text-[13px]">
              {item}
              <span className="inline-flex">
                {index > 0 ? (
                  <button type="button" className="rounded-full px-1 text-muted hover:text-tinta" onClick={() => onChange(moveItem(value, index, index - 1))} aria-label={`Mover ${item} antes`}>
                    ‹
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                  className="grid h-5 w-5 place-items-center rounded-full hover:bg-tinta/10"
                  aria-label={`Quitar ${item}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <input
        id={id}
        value={draft}
        maxLength={max}
        disabled={value.length >= maxItems}
        placeholder={value.length >= maxItems ? `Máximo ${maxItems}` : placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            add(draft);
          } else if (event.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        className="h-9 w-full bg-transparent px-1.5 text-[15px] outline-none placeholder:text-tinta/35"
      />
    </div>
  );
}

function emptyItem(fields) {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.type === "tags" || field.type === "list" ? [] : field.type === "toggle" ? false : field.type === "select" ? Object.keys(field.options)[0] : ""
    ])
  );
}

function ListField({ field, value = [], onChange }) {
  const confirm = useConfirm();
  const [open, setOpen] = useState(() => (value.length <= 3 ? value.map((_, index) => index) : []));
  const full = field.maxItems && value.length >= field.maxItems;
  const toggle = (index) => setOpen((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]));
  const titleOf = (item, index) => {
    const raw = field.titleField ? item[field.titleField] : item.label || item.name || item.title;
    return raw ? String(raw) : `${field.itemLabel || "Elemento"} ${index + 1}`;
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {value.map((item, index) => {
        const expanded = open.includes(index);
        const hasImage = field.fields.find((sub) => sub.type === "image");
        return (
          <div key={index} className="rounded-xl border border-tinta/10 bg-crema/60">
            <div className="flex items-center gap-1 py-1.5 pl-3 pr-1.5">
              <button type="button" onClick={() => toggle(index)} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-expanded={expanded}>
                <span className="font-mono text-[12px] text-muted">{String(index + 1).padStart(2, "0")}</span>
                {hasImage && item[hasImage.name] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb(item[hasImage.name], 80)} alt="" className="h-7 w-7 shrink-0 rounded-md object-cover" />
                ) : null}
                <span className="truncate text-[14px] font-semibold">{titleOf(item, index)}</span>
                <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
              </button>
              <MoveButtons
                index={index}
                total={value.length}
                label={field.itemLabel?.toLowerCase()}
                onMove={(from, to) => {
                  onChange(moveItem(value, from, to));
                  setOpen((current) => current.map((item) => (item === from ? to : item === to ? from : item)));
                }}
              />
              <button
                type="button"
                disabled={full}
                onClick={() => onChange([...value.slice(0, index + 1), structuredClone(item), ...value.slice(index + 1)])}
                className="grid h-8 w-8 place-items-center rounded-full text-tinta/70 hover:bg-tinta/5 disabled:opacity-25"
                aria-label="Duplicar"
                title="Duplicar"
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await confirm({
                    title: `¿Quitar «${titleOf(item, index)}»?`,
                    message: "Se quita de la lista. El cambio se aplica en la web cuando guardes.",
                    confirmLabel: "Quitar",
                    danger: true
                  });
                  if (ok) onChange(value.filter((_, itemIndex) => itemIndex !== index));
                }}
                className="grid h-8 w-8 place-items-center rounded-full text-[#c23434] hover:bg-watermelon/10"
                aria-label="Quitar"
                title="Quitar"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {expanded ? (
              <div className="grid grid-cols-1 gap-4 border-t border-tinta/10 bg-white p-4 sm:grid-cols-2">
                {field.fields.map((sub) => (
                  <SchemaField
                    key={sub.name}
                    field={sub}
                    value={item[sub.name]}
                    className={sub.type === "textarea" || sub.type === "tags" || sub.type === "select" ? "sm:col-span-2" : ""}
                    onChange={(next) => onChange(value.map((current, itemIndex) => (itemIndex === index ? { ...current, [sub.name]: next } : current)))}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={full}
          onClick={() => {
            onChange([...value, emptyItem(field.fields)]);
            setOpen((current) => [...current, value.length]);
          }}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Agregar {field.itemLabel?.toLowerCase() || "elemento"}
        </Button>
        {field.maxItems ? (
          <span className="text-[12px] text-muted">
            {value.length} de {field.maxItems}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SchemaField({ field, value, onChange, className }) {
  const id = useId();
  if (field.type === "note") {
    return (
      <div className={cn("flex gap-3 rounded-xl bg-periwinkle/25 p-4 text-[14px]", className)}>
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">{field.label}</p>
          <p className="mt-1 text-tinta/75">{field.help}</p>
        </div>
      </div>
    );
  }
  if (field.type === "toggle") {
    return (
      <div className={className}>
        <Toggle checked={value} onChange={onChange} label={field.label} description={field.help} />
      </div>
    );
  }

  let control;
  switch (field.type) {
    case "textarea":
      control = <TextArea id={id} rows={field.rows || 4} maxLength={field.max} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />;
      break;
    case "select":
      control =
        field.name === "tone" ? (
          <ToneSelect options={field.options} value={value} onChange={onChange} label={field.label} />
        ) : (
          <Select id={id} options={field.options} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
        );
      break;
    case "image":
      control = <ImageField value={value} onChange={onChange} scope={field.scope || "site"} aspect="aspect-[4/3] max-w-xs" />;
      break;
    case "tags":
      control = <TagsInput id={id} value={value || []} onChange={onChange} max={field.max} maxItems={field.maxItems} />;
      break;
    case "list":
      control = <ListField field={field} value={value || []} onChange={onChange} />;
      break;
    default:
      control = (
        <TextInput
          id={id}
          type={field.type === "url" ? "url" : field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          inputMode={field.type === "phone" ? "numeric" : undefined}
          placeholder={field.type === "url" ? "https://" : undefined}
          maxLength={field.max || (field.type === "url" ? 600 : undefined)}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }

  const counter = field.max && (field.type === "text" || field.type === "textarea") && String(value || "").length > field.max * 0.8;
  return (
    <Field
      htmlFor={field.type === "list" || field.type === "image" ? undefined : id}
      label={field.label}
      required={field.required}
      help={[field.help, counter ? `${String(value || "").length}/${field.max} caracteres` : ""].filter(Boolean).join(" · ") || undefined}
      className={className}
    >
      {control}
    </Field>
  );
}

// Formulario completo con grupos en tarjetas.
export function SchemaForm({ fields, value, onChange }) {
  const groups = [];
  for (const field of fields) {
    const name = field.group || "";
    let group = groups.find((item) => item.name === name);
    if (!group) groups.push((group = { name, fields: [] }));
    group.fields.push(field);
  }
  return (
    <div className="grid grid-cols-1 gap-5">
      {groups.map((group) => (
        <Card key={group.name || "general"} className="p-5 sm:p-6">
          {group.name ? <h2 className="mb-5 font-display text-[18px] font-black">{group.name}</h2> : null}
          <div className="grid grid-cols-1 gap-5">
            {group.fields.map((field) => (
              <SchemaField key={field.name} field={field} value={value[field.name]} onChange={(next) => onChange({ ...value, [field.name]: next })} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
