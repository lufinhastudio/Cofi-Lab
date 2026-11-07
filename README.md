# COFI LAB · Sitio + panel de administración

Sitio de COFI LAB (inicio, clientes, nosotras, contacto) con un panel en `/admin` para que el equipo administre todo el contenido sin tocar código: marcas y sus campañas, fotos, reels, textos de cada página, testimonios, La Cofiteca, mensajes y configuración.

## Stack

- **Next.js 16** (App Router, JavaScript) + React 19
- **Tailwind CSS 3**
- **Neon** (Postgres serverless) para contenido y auth admin
- **Cloudinary** para imágenes (subida firmada desde el servidor)
- Deploy en **Vercel**

## Estructura

```text
app/
  (site)/                     Sitio público (lee el contenido de Neon)
    clientes/[slug]/          Página de cada marca, generada por su slug
  admin/
    login/                    Login (público)
    (panel)/                  Todo exige sesión (layout.js lo verifica en el servidor)
      marcas/ [id]/           Marcas y trabajos + constructor de secciones
      contenido/ [area]/      Inicio, Clientes, Nosotras, Contacto
      testimonios/ cofiteca/ mensajes/ configuracion/
  api/admin/                  APIs protegidas (sesión + origen) para cada recurso
components/site/              Componentes del sitio (diseño público, sin cambios de estilo)
components/admin/             Interfaz del panel
lib/content/                  Esquemas editables, plantillas de secciones y validación (compartido)
lib/server/                   Solo servidor: db, auth, cloudinary, repositorios y revalidación
lib/client/                   Llamadas del panel y subida optimizada de imágenes
config/content.js, site.js    Textos originales: valores por defecto del contenido editable
docs/neon-schema.sql          Esquema completo (idempotente)
docs/migrations/              Migraciones incrementales
scripts/                      Esquema, admins, importación legacy, limpieza de imágenes
```

## Qué se administra desde el panel

| Sección del panel   | Qué controla                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Marcas y trabajos   | Crear, editar, ocultar, publicar, borradores, eliminar, ordenar, destacar en el inicio. Nombre, rubro, descripción, servicios, portada, Instagram, slug (con redirección del anterior). |
| Secciones de marca  | Plantillas fijas: mosaico, grilla cuadrada, fila de verticales, imagen destacada, imagen + texto, reel/video, bloque de texto. Agregar, duplicar, ordenar, ocultar y eliminar. |
| Contenido del sitio | Inicio (portada, intro, fotos, servicios, diferenciales, números, clientes, testimonios, llamado final), Clientes, Nosotras (equipo, esencia, valores) y Contacto (textos, foto, opciones del formulario). |
| Testimonios         | ABM, ocultar, ordenar, foto.                                                                                                   |
| La Cofiteca         | ABM de productos (nombre, categoría, descripciones, imágenes, link, WhatsApp). **Sin página pública todavía.**                  |
| Mensajes            | Consultas del formulario con estado leído / no leído, búsqueda y borrado.                                                      |
| Configuración       | Instagram, redes del equipo, email, WhatsApp, textos del pie y del menú, frase y descripción para buscadores.                  |

Logos, tipografías, colores y estructura están protegidos: los colores se eligen de la paleta del Brand Book y las secciones solo con plantillas.

### Cómo se publica

- Cada guardado escribe en Neon y llama a `revalidatePath("/", "layout")`: la web se regenera en la próxima visita, **sin deploy**. Además las páginas tienen `revalidate = 60` como respaldo.
- Estado de una marca: `draft` (borrador), `published` (publicada) u `hidden` (oculta). La columna `visible` se mantiene sincronizada (`visible = status = 'published'`), así que el sitio funciona igual antes y después de la migración.
- **Contenido legacy:** solo se usa si no hay `DATABASE_URL` (desarrollo). Con base configurada se respeta lo que diga aunque esté vacía, para que no reaparezcan marcas o testimonios ocultados o eliminados. Si la base falla, Next sigue sirviendo la última versión buena.
- El contenido de cada página se guarda en `site_content` (una fila por área). Lo que nunca se editó sale de `config/content.js`. “Textos originales” borra esa fila.

### Imágenes (Cloudinary)

- Se optimizan en el navegador (WebP, máx. 2000 px) y se suben con firma del servidor a carpetas fijas (`cofilab/trabajos`, `cofilab/testimonios`, `cofilab/cofiteca`, `cofilab/sitio`). El API secret nunca sale del servidor.
- El servidor solo acepta URLs de la cuenta propia de Cloudinary (y las del sitio anterior).
- Las ~180 fotos ya migradas (`data/legacy/cloudinary-map.json`) se siguen usando tal cual; no se vuelven a subir.
- **Quitar una foto no la borra de Cloudinary.** Cada subida queda registrada en `media_assets`; `npm run media:huerfanas` lista las que ya no usa nada (y con `-- --borrar` las elimina).

### Seguridad

- Usuarios en `admin_users` (bcrypt), sesión en `admin_sessions` (solo el hash del token) y cookie `httpOnly` firmada con `AUTH_SECRET` (8 h).
- Todas las pantallas de `(panel)` verifican la sesión en el servidor. Todas las APIs `/api/admin/*` usan `adminRoute()` (`lib/server/admin.js`): sesión válida + bloqueo de pedidos de otros dominios (CSRF) + errores sin detalles internos.
- Validación del lado servidor de todos los campos (largos, links solo `http(s)`, emails, colores e íconos de listas cerradas, imágenes de Cloudinary propio, slugs únicos, cantidad de fotos por plantilla) y control de edición concurrente (409 si otra persona guardó antes).
- Login bloqueado 15 min tras 5 intentos fallidos por email o 20 por IP.

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local   # o .env: completar DATABASE_URL, AUTH_SECRET y Cloudinary
npm run db:schema            # crea/actualiza tablas (idempotente, no borra datos)
npm run create-admin -- admin@email.com "Nombre"   # pide la contraseña por teclado
npm run dev                  # http://localhost:3000 · panel en /admin
```

Requiere Node 22.9 o superior.

### Variables de entorno

| Variable                 | Uso                                                                  |
| ------------------------ | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`   | URL pública (metadata y validación de origen)                        |
| `DATABASE_URL`           | Connection string de Neon (privada)                                  |
| `AUTH_SECRET`            | Firma de cookies de sesión, mínimo 32 caracteres (privada)           |
| `CLOUDINARY_CLOUD_NAME`  | Nombre de la cuenta de Cloudinary                                    |
| `CLOUDINARY_API_KEY`     | API key (privada)                                                    |
| `CLOUDINARY_API_SECRET`  | API secret (privada, nunca con prefijo `NEXT_PUBLIC_`)               |

`CLOUDINARY_URL=cloudinary://KEY:SECRET@CLOUD` puede reemplazar las tres de Cloudinary.

### Base de datos

- Esquema completo: `docs/neon-schema.sql` (`npm run db:schema` lo aplica entero; es idempotente).
- Migración del panel: `docs/migrations/004_panel_admin.sql` (solo agrega columnas `status`, `published_at`, `previous_slugs`, `link_url`; tablas `site_content` y `media_assets`; índices). Se puede pegar en el SQL Editor de Neon.
- `npm run import:legacy` ya no reimporta marcas si la base tiene datos (para no pisar lo editado). Forzar: `-- --solo-base --forzar`.

## Deploy (Vercel)

1. Aplicar la migración en la base de producción (`npm run db:schema` con la `DATABASE_URL` de producción, o pegar `docs/migrations/004_panel_admin.sql` en Neon). Es aditiva: el sitio actual sigue funcionando.
2. Cargar las variables de la tabla en el proyecto de Vercel (Production y Preview).
3. Mergear la rama y dejar que Vercel despliegue. Framework preset **Next.js**, sin configuración extra.
