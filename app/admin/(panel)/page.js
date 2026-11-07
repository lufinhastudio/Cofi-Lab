import Link from "next/link";
import { AlertTriangle, ArrowRight, Briefcase, FileText, Mail, MessageSquareQuote, Plus, Settings } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { PROJECT_STATUS, STATUS_TONE } from "@/lib/content/options";
import { requireAdminPage } from "@/lib/server/admin";
import { getDashboardStats } from "@/lib/server/collections";
import { getContactEmailStatus } from "@/lib/server/email";

export const metadata = { title: { absolute: "Dashboard · Panel CoFi" } };

function Stat({ label, value, note, href, tone = "bg-white" }) {
  return (
    <Link href={href} className={`group flex flex-col justify-between rounded-2xl border border-line p-5 transition-transform hover:-translate-y-0.5 ${tone}`}>
      <p className="mono-label uppercase">{label}</p>
      <p className="mt-6 font-display text-[40px] font-black leading-none">{value}</p>
      {note ? <p className="mt-2 text-[13px] text-tinta/70">{note}</p> : null}
    </Link>
  );
}

const quickLinks = [
  { href: "/admin/marcas", label: "Marcas y trabajos", text: "Campañas, galerías y reels", icon: Briefcase },
  { href: "/admin/contenido", label: "Contenido del sitio", text: "Inicio, Clientes, Nosotras, Contacto", icon: FileText },
  { href: "/admin/testimonios", label: "Testimonios", text: "Lo que dicen las marcas", icon: MessageSquareQuote },
  { href: "/admin/configuracion", label: "Configuración", text: "Redes, contacto y pie", icon: Settings }
];

export default async function AdminHomePage() {
  const session = await requireAdminPage();
  let stats = null;
  let migrationMissing = false;
  try {
    stats = await getDashboardStats();
  } catch (error) {
    if (error?.code === "42P01" || error?.code === "42703") migrationMissing = true;
    else throw error;
  }
  const contactEmail = await getContactEmailStatus();
  const firstName = String(session.user.name || "").split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Hola${firstName && !firstName.includes("@") ? `, ${firstName}` : ""}.`}
        description="Desde acá manejan todo el contenido de la web. Los cambios se publican solos al guardar."
        actions={
          <Link href="/admin/marcas?nueva=1" className="inline-flex h-11 items-center gap-2 rounded-full bg-tinta px-5 text-[14px] font-bold text-crema hover:bg-cacao">
            <Plus className="h-4 w-4" aria-hidden="true" /> Nueva marca
          </Link>
        }
      />

      {migrationMissing ? (
        <div role="alert" className="mb-6 flex gap-3 rounded-2xl border border-watermelon/40 bg-watermelon/10 p-4 text-[14px]">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            <strong>Falta actualizar la base de datos.</strong> Hay que correr la migración <code>docs/migrations/004_panel_admin.sql</code> (o{" "}
            <code>npm run db:schema</code>) para usar el panel completo.
          </p>
        </div>
      ) : null}

      {stats ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat
              href="/admin/marcas"
              label="Marcas publicadas"
              value={stats.counts.projects_published}
              note={`${stats.counts.projects_draft} borradores · ${stats.counts.projects_hidden} ocultas`}
              tone="bg-periwinkle"
            />
            <Stat href="/admin/marcas" label="Fotos en galerías" value={stats.counts.images} note={`en ${stats.counts.sections} secciones`} tone="bg-lemon" />
            <Stat href="/admin/testimonios" label="Testimonios" value={stats.counts.testimonials_visible} note={`visibles de ${stats.counts.testimonials}`} tone="bg-cantaloupe" />
            <Stat href="/admin/marcas" label="Secciones" value={stats.counts.sections} note="campañas, galerías, reels y textos" />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[18px] font-black">Últimas marcas editadas</h2>
                <Link href="/admin/marcas" className="text-[13px] font-semibold text-muted hover:text-tinta">
                  Ver todas
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-line">
                {stats.recentProjects.map((project) => (
                  <li key={project.id}>
                    <Link href={`/admin/marcas/${project.id}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-70">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{project.clientName}</span>
                        <span className="text-[12px] text-muted">{new Date(project.updatedAt).toLocaleString("es-AR", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </span>
                      <Badge tone={STATUS_TONE[project.status]}>{PROJECT_STATUS[project.status]}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-[18px] font-black">
                <Mail className="h-5 w-5" aria-hidden="true" /> Formulario de contacto
              </h2>
              {contactEmail.configured ? (
                <p className="mt-4 text-[14px] leading-relaxed">
                  Las consultas de la web llegan por email a <strong className="[overflow-wrap:anywhere]">{contactEmail.to}</strong>. Para responder, alcanza con
                  contestar ese email.
                </p>
              ) : (
                <p className="mt-4 rounded-xl bg-lemon/70 p-3 text-[14px] leading-relaxed">
                  <strong>Todavía no se envían por email.</strong> Falta configurar Resend en el servidor (variables <code>RESEND_API_KEY</code> y{" "}
                  <code>CONTACT_EMAIL_TO</code>). Mientras tanto las consultas se guardan en la base como respaldo.
                </p>
              )}
            </Card>
          </div>
        </>
      ) : null}

      <h2 className="mb-3 mt-10 font-display text-[18px] font-black">Accesos rápidos</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-tinta">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-arena">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[15px] font-bold">{item.label}</span>
                  <span className="block truncate text-[13px] text-muted">{item.text}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
