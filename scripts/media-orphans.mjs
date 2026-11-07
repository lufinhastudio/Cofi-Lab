// Limpieza segura de imágenes de Cloudinary.
//
// El panel NUNCA borra archivos de Cloudinary al quitar una foto de una galería:
// solo saca la referencia. Este script encuentra las imágenes subidas desde el
// panel (tabla media_assets) que ya no usa ninguna marca, testimonio, producto ni
// texto del sitio, y que tienen más de N días.
//
//   npm run media:huerfanas                 → solo lista (no borra nada)
//   npm run media:huerfanas -- --dias 60    → cambia la antigüedad mínima (default 30)
//   npm run media:huerfanas -- --borrar     → borra esas imágenes de Cloudinary y del registro
//
// No toca las fotos importadas del sitio anterior (no están en media_assets).
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const remove = args.includes("--borrar");
const daysIndex = args.indexOf("--dias");
const days = daysIndex >= 0 ? Math.max(1, Number(args[daysIndex + 1]) || 30) : 30;

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);

const orphans = await sql`
  select m.id, m.url, m.public_id, m.created_at
  from media_assets m
  where m.created_at < now() - make_interval(days => ${days})
    and not exists (select 1 from projects p where p.cover_url = m.url or p.instagram_image_url = m.url)
    and not exists (select 1 from project_sections s where s.media::text like '%' || m.url || '%')
    and not exists (select 1 from testimonials t where t.image_url = m.url or t.logo_url = m.url)
    and not exists (select 1 from cofiteca_products c where c.images::text like '%' || m.url || '%')
    and not exists (select 1 from site_content sc where sc.data::text like '%' || m.url || '%')
  order by m.created_at
`;

console.log(`Imágenes sin uso con más de ${days} días: ${orphans.length}`);
for (const item of orphans) console.log(`  ${new Date(item.created_at).toISOString().slice(0, 10)}  ${item.url}`);

if (!remove || !orphans.length) {
  if (orphans.length) console.log("\nNo se borró nada. Para borrarlas: npm run media:huerfanas -- --borrar");
  process.exit(0);
}

const cloud = process.env.CLOUDINARY_CLOUD_NAME || (process.env.CLOUDINARY_URL ? new URL(process.env.CLOUDINARY_URL).hostname : "");
const key = process.env.CLOUDINARY_API_KEY || (process.env.CLOUDINARY_URL ? decodeURIComponent(new URL(process.env.CLOUDINARY_URL).username) : "");
const secret = process.env.CLOUDINARY_API_SECRET || (process.env.CLOUDINARY_URL ? decodeURIComponent(new URL(process.env.CLOUDINARY_URL).password) : "");
if (!cloud || !key || !secret) {
  console.error("Faltan las variables de Cloudinary.");
  process.exit(1);
}

const withId = orphans.filter((item) => item.public_id && item.public_id.startsWith("cofilab/"));
for (let index = 0; index < withId.length; index += 100) {
  const batch = withId.slice(index, index + 100);
  const params = new URLSearchParams();
  batch.forEach((item) => params.append("public_ids[]", item.public_id));
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload?${params}`, {
    method: "DELETE",
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Cloudinary respondió con error:", data.error?.message || response.status);
    process.exit(1);
  }
  const done = Object.entries(data.deleted || {})
    .filter(([, value]) => value === "deleted" || value === "not_found")
    .map(([publicId]) => publicId);
  await sql`delete from media_assets where public_id = any(${done})`;
  console.log(`Borradas ${done.length} de ${batch.length}`);
}
