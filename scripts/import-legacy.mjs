// Migra el sitio anterior (Pixieset) al nuevo:
//   1. Copia todas las fotos a Cloudinary (Cloudinary las descarga desde la URL original)
//      y guarda el mapeo en data/legacy/cloudinary-map.json.
//   2. Carga en la base los clientes, sus secciones y los testimonios.
// Es idempotente: se puede volver a correr sin duplicar nada.
// Uso: npm run import:legacy            (fotos + base)
//      npm run import:legacy -- --solo-fotos
//      npm run import:legacy -- --solo-base
import crypto from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const root = new URL("..", import.meta.url);
const mapPath = new URL("data/legacy/cloudinary-map.json", root);
const PIXIESET = "https://images-pw.pixieset.com/elementfield/";
const args = new Set(process.argv.slice(2));
const doImages = !args.has("--solo-base");
const doDatabase = !args.has("--solo-fotos");

const projects = JSON.parse(await readFile(new URL("data/legacy/pixieset-projects.json", root), "utf8"));
const highlights = JSON.parse(await readFile(new URL("data/legacy/project-highlights.json", root), "utf8"));
const legacyTestimonials = JSON.parse(await readFile(new URL("data/legacy/testimonials.json", root), "utf8"));
// Fotos fijas de Inicio y Nosotras: se toman las rutas escritas en config/content.js
const contentSource = await readFile(new URL("config/content.js", root), "utf8");
const staticImages = [...contentSource.matchAll(/"([A-Za-z0-9]{7}\/[^"\s]+\.(?:jpe?g|png))"/g)].map((m) => m[1]);
const map = JSON.parse(await readFile(mapPath, "utf8").catch(() => "{}"));

// --- 1. Fotos -----------------------------------------------------------------
const jobs = [];
const add = (path, folder) => path && jobs.push({ path, folder });
for (const project of projects) {
  const folder = `cofilab/clientes/${project.slug}`;
  add(project.cover, folder);
  add(project.instagram?.image, folder);
  for (const section of project.sections) section.images.forEach((image) => add(image, folder));
}
staticImages.forEach((path) => add(path, "cofilab/sitio"));
legacyTestimonials.forEach((item) => add(item.image, "cofilab/testimonios"));

if (doImages) {
  const config = cloudinaryConfig();
  const pending = jobs.filter((job) => !map[job.path]);
  console.log(`Fotos: ${jobs.length} en total, ${pending.length} por subir.`);
  let done = 0;
  let failed = 0;
  await runPool(pending, 4, async (job) => {
    try {
      map[job.path] = await uploadFromUrl(config, `${PIXIESET}${job.path}`, job.folder, publicIdFor(job.path));
      done += 1;
      if (done % 10 === 0) {
        process.stdout.write(`  ${done}/${pending.length}\n`);
        await saveMap();
      }
    } catch (error) {
      failed += 1;
      console.error(`  ✗ ${job.path}: ${error.message}`);
    }
  });
  await saveMap();
  console.log(`Fotos listas: ${done} subidas, ${failed} con error.`);
  if (failed) process.exitCode = 1;
}

// --- 2. Base de datos ---------------------------------------------------------
if (doDatabase) {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL (en .env.local).");
  const sql = neon(process.env.DATABASE_URL);
  const img = (path) => (path ? map[path] || `${PIXIESET}${path}` : null);

  for (const [index, project] of projects.entries()) {
    const [row] = await sql`
      insert into projects (slug, client_name, summary, cover_url, videos_heading, instagram_url, instagram_label, instagram_image_url, visible, sort_order)
      values (
        ${project.slug}, ${titleCase(project.name)}, ${project.description.join("\n\n")}, ${img(project.cover)},
        ${project.videosHeading || null}, ${project.instagram?.url || null}, ${project.instagram?.label || null},
        ${img(project.instagram?.image)}, true, ${index}
      )
      on conflict (slug) do update set
        client_name = excluded.client_name,
        summary = excluded.summary,
        cover_url = excluded.cover_url,
        videos_heading = excluded.videos_heading,
        instagram_url = excluded.instagram_url,
        instagram_label = excluded.instagram_label,
        instagram_image_url = excluded.instagram_image_url,
        updated_at = now()
      returning id
    `;
    const highlight = highlights[project.slug] || {};
    await sql`update projects set industry = ${highlight.industry || null}, services = ${highlight.services || []} where id = ${row.id}`;
    await sql`delete from project_sections where project_id = ${row.id}`;
    for (const [sectionIndex, section] of project.sections.entries()) {
      const media = section.images.map((image) => ({ url: img(image), type: "image" }));
      await sql`
        insert into project_sections (project_id, kind, layout, title, description, link_url, media, visible, sort_order)
        values (
          ${row.id}, ${section.kind}, ${section.layout || (section.kind === "video" ? "video" : "grid")},
          ${section.title || null}, ${section.description || null}, ${section.url || null},
          ${JSON.stringify(media)}::jsonb, true, ${sectionIndex}
        )
      `;
    }
    console.log(`Cliente cargado: ${titleCase(project.name)} (${project.sections.length} secciones)`);
  }

  const [{ count }] = await sql`select count(*)::int as count from testimonials`;
  if (count === 0) {
    for (const [index, item] of legacyTestimonials.entries()) {
      await sql`
        insert into testimonials (quote, author_name, company, image_url, visible, sort_order)
        values (${item.quote}, ${item.authorName}, ${item.company}, ${img(item.image)}, true, ${index})
      `;
    }
    console.log(`Testimonios cargados: ${legacyTestimonials.length}`);
  } else {
    console.log("Testimonios: ya había cargados, no se tocaron.");
  }
}

// --- helpers ------------------------------------------------------------------
async function saveMap() {
  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(mapPath, `${JSON.stringify(sorted, null, 2)}\n`);
}

function publicIdFor(path) {
  // "my3xpqQ/Angus36-9c1f8a13-1000.jpg" -> "angus36-9c1f8a13"
  const file = path.split("/").pop().replace(/\.[a-z]+$/i, "");
  return file.replace(/-\d{3,4}$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
}

async function uploadFromUrl({ cloudName, apiKey, apiSecret }, fileUrl, folder, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, overwrite: "true", public_id: publicId, timestamp };
  const payload = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
  const signature = crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");

  const form = new FormData();
  form.append("file", fileUrl);
  for (const [key, value] of Object.entries(params)) form.append(key, String(value));
  form.append("api_key", apiKey);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.secure_url) throw new Error(data.error?.message || `HTTP ${response.status}`);
  return data.secure_url;
}

function cloudinaryConfig() {
  let { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
    const parsed = new URL(process.env.CLOUDINARY_URL);
    cloudName ||= parsed.hostname;
    apiKey ||= decodeURIComponent(parsed.username);
    apiSecret ||= decodeURIComponent(parsed.password);
  }
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Faltan las variables de Cloudinary en .env.local.");
  return { cloudName, apiKey, apiSecret };
}

async function runPool(items, size, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) await worker(items[cursor++]);
  }));
}

function titleCase(name) {
  const value = String(name || "").trim();
  if (value.length <= 3 || value !== value.toUpperCase()) return value;
  return value.charAt(0) + value.slice(1).toLowerCase();
}
