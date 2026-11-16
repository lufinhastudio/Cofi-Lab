import { Fragment } from "react";

// Convierte **negrita** y *cursiva* en <strong>/<em> sin usar HTML crudo.
export function Emphasis({ text, strongClassName = "font-semibold text-ink", emClassName }) {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  const value = String(text || "");

  while ((match = pattern.exec(value))) {
    if (match.index > lastIndex) parts.push(<Fragment key={key++}>{value.slice(lastIndex, match.index)}</Fragment>);
    const token = match[0];
    if (token.startsWith("**")) parts.push(<strong key={key++} className={strongClassName}>{token.slice(2, -2)}</strong>);
    else parts.push(<em key={key++} className={emClassName}>{token.slice(1, -1)}</em>);
    lastIndex = match.index + token.length;
  }
  if (lastIndex < value.length) parts.push(<Fragment key={key++}>{value.slice(lastIndex)}</Fragment>);
  return <>{parts}</>;
}

export function Paragraphs({ text, className }) {
  const paragraphs = Array.isArray(text) ? text : String(text || "").split(/\n{2,}/);
  return paragraphs.filter(Boolean).map((paragraph, index) => (
    <p key={index} className={className}>
      <Emphasis text={paragraph} />
    </p>
  ));
}
