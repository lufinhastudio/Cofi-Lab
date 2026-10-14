# COFI LAB · Landing + admin

Landing de COFI LAB (portfolio, La Cofiteca, testimonios, nosotros y contacto) con panel admin en `/admin` para el contenido que cambia seguido.

## Stack

- **Next.js 16** (App Router, JavaScript) + React 19
- **Tailwind CSS 3**
- **Neon** (Postgres serverless) para contenido y auth admin
- **Cloudinary** para imágenes (subida firmada desde el servidor)
- Deploy en **Vercel**

## Estructura

```text
app/
  page.js                     Landing (una sola página con secciones)
  admin/
    login/                    Login del admin (público)
    (panel)/                  Todo lo de acá adentro exige sesión
      layout.js               Verifica la sesión en el servidor → si no hay, /admin/login
      trabajos/ cofiteca/ testimonios/
  api/admin/
    login/ logout/ session/   Auth admin
    cloudinary-signature/     Firma para subir imágenes
components/site/              Secciones de la landing
config/site.js                Datos fijos: nombre, contacto, redes, menú
data/placeholder.js           Contenido de ejemplo mientras no hay base
lib/server/                   Solo servidor: db, auth, rate limit del login, cloudinary, contenido
lib/client/uploadImages.js    Optimiza a WebP y sube a Cloudinary desde el admin
docs/neon-schema.sql          Esquema completo de la base
scripts/create-admin.mjs      Crea/actualiza usuarios admin
```

## Cómo funciona el admin

- Usuarios en `admin_users` con contraseña bcrypt (sin usuarios ni claves en el código).
- Al iniciar sesión se crea una fila en `admin_sessions` (se guarda solo el hash del token) y se manda una cookie `httpOnly` firmada con `AUTH_SECRET`. La sesión dura 8 h.
- `app/admin/(panel)/layout.js` valida la sesión en el servidor antes de mostrar cualquier pantalla.
- Las rutas `/api/admin/*` que modifican algo validan sesión y origen (bloquea pedidos desde otros dominios).
- El login se bloquea 15 min tras 5 intentos fallidos por email o 20 por IP.

El diseño del panel está pendiente: por ahora es un esqueleto sin estilos propios.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar DATABASE_URL, AUTH_SECRET y Cloudinary
npm run dev                  # http://localhost:3000 · admin en /admin
```

Sin `DATABASE_URL` la landing se ve igual con el contenido de ejemplo de `data/placeholder.js`.

### Base de datos

1. Crear el proyecto en Neon y copiar la connection string a `DATABASE_URL`.
2. Crear las tablas: `npm run db:schema` (o pegar `docs/neon-schema.sql` en el SQL Editor de Neon).
3. Crear el primer admin:

```bash
npm run create-admin -- admin@email.com "Nombre"
```

La contraseña se pide por teclado y no se muestra (mínimo 10 caracteres).

### Vercel

Framework preset **Next.js**, sin configuración extra. Cargar las mismas variables de `.env.example` en el proyecto de Vercel.

## Próximos pasos

- Relevar la página actual (Pixieset) y el Instagram `@cofi_labb`: textos, fotos, colores y tipografías.
- Diseñar la landing con la identidad de COFI LAB.
- Diseñar y construir el admin desde cero: ABM de Trabajos (+ “Ver más”), La Cofiteca y Testimonios.
