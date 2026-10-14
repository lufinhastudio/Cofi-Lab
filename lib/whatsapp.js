import { site } from "@/config/site";

export function whatsappUrl(message = site.contact.defaultWhatsappMessage) {
  const phone = String(site.contact.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(message || "");
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function productWhatsappMessage(product) {
  return product.whatsappMessage || `Hola COFI LAB! Quería consultar por "${product.name}" de La Cofiteca.`;
}
