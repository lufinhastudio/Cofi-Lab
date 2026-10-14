import { site } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Contacto</h2>
      <ul className="mt-6 grid gap-2">
        <li>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">WhatsApp</a>
        </li>
        {site.contact.email ? (
          <li>
            <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">{site.contact.email}</a>
          </li>
        ) : null}
        {site.socials.map((social) => (
          <li key={social.href}>
            <a href={social.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{social.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
