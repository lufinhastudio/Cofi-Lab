import Link from "next/link";
import { ArrowRight, Briefcase, Contact, Home, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { CONTENT_AREAS } from "@/lib/content/schemas";

export const metadata = { title: { absolute: "Contenido · Panel CoFi" } };

const areas = [
  { href: "/admin/contenido/inicio", key: "home", icon: Home },
  { href: "/admin/contenido/clientes", key: "clients", icon: Briefcase },
  { href: "/admin/contenido/nosotras", key: "about", icon: Users },
  { href: "/admin/contenido/contacto", key: "contact", icon: Contact }
];

function AreaLink({ href, title, description, icon: Icon }) {
  return (
    <Link href={href} className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-tinta">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-periwinkle">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[17px] font-bold">{title}</span>
        <span className="mt-1 block text-[14px] text-muted">{description}</span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

export default function AdminContentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contenido del sitio"
        title="¿Qué querés editar?"
        description="Textos, fotos y listas de cada página. El diseño, los colores de marca y los logos están protegidos: solo cambia el contenido."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {areas.map((area) => (
          <li key={area.key}>
            <AreaLink href={area.href} title={CONTENT_AREAS[area.key].title} description={CONTENT_AREAS[area.key].description} icon={area.icon} />
          </li>
        ))}
      </ul>
    </>
  );
}
