-- COFI LAB · v4 · Panel de administración completo
-- Migración incremental, idempotente y NO destructiva: solo agrega columnas,
-- tablas e índices. Se puede correr más de una vez sin efectos secundarios.
-- También está incluida al final de docs/neon-schema.sql (npm run db:schema).

-- Marcas: estado de publicación (draft | published | hidden).
-- "visible" se mantiene sincronizado (visible = status 'published') para que
-- cualquier versión anterior del sitio que lea solo "visible" siga funcionando.
alter table projects add column if not exists status text not null default 'published';
update projects set status = 'hidden' where visible = false and status = 'published';
alter table projects add column if not exists published_at timestamptz;
update projects set published_at = created_at where status = 'published' and published_at is null;
-- Slugs anteriores: si se renombra una marca, la URL vieja redirige a la nueva.
alter table projects add column if not exists previous_slugs text[] not null default '{}';
create index if not exists projects_status_idx on projects(status, sort_order);
create unique index if not exists projects_slug_lower_idx on projects(lower(slug));

-- Testimonios y Cofiteca: enlace opcional
alter table cofiteca_products add column if not exists link_url text;

-- Contenido editable del sitio (Inicio, Nosotras, Contacto, Configuración…).
-- Una fila por área; data guarda solo lo que las administradoras cambiaron
-- y el sitio completa el resto con los textos por defecto.
create table if not exists site_content (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_by uuid references admin_users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Registro de imágenes subidas desde el panel. Sirve para una limpieza segura
-- futura (comparar contra las referencias en uso). Nunca se borra nada de
-- Cloudinary automáticamente al quitar una imagen de una galería.
create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  public_id text,
  scope text,
  width integer,
  height integer,
  bytes integer,
  uploaded_by uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists media_assets_created_idx on media_assets(created_at desc);
create index if not exists contact_messages_unread_idx on contact_messages(read_at) where read_at is null;
