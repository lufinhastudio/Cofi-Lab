-- COFI LAB · Esquema Neon (Postgres)
-- Ejecutar completo en el SQL Editor de Neon. Es idempotente: se puede correr más de una vez.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin: usuarios, sesiones y protección contra fuerza bruta en el login
-- (mismo esquema que Mayma)
-- ---------------------------------------------------------------------------

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  password_hash text,
  role text not null default 'admin',
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists admin_users_email_unique_idx on admin_users(lower(email));

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references admin_users(id) on delete cascade,
  session_token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_user_idx on admin_sessions(admin_user_id);

create table if not exists admin_login_attempts (
  key_hash text primary key,
  failures integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Trabajos (portfolio) y su contenido de "Ver más"
-- media: array JSON de { "url": "...", "type": "image" | "video", "alt": "..." }
-- ---------------------------------------------------------------------------

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  client_name text not null,
  title text,
  work_type text,
  summary text,
  cover_url text,
  media jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_idx on projects(visible, sort_order);

-- Campañas / bloques dentro del "Ver más" de un trabajo (ej: Angus > campañas)
create table if not exists project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  concept text,
  description text,
  media jsonb not null default '[]'::jsonb,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_sections_project_idx on project_sections(project_id, sort_order);

-- ---------------------------------------------------------------------------
-- La Cofiteca: libros, juegos y productos propios
-- ---------------------------------------------------------------------------

create table if not exists cofiteca_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'libro',
  short_description text,
  description text,
  images jsonb not null default '[]'::jsonb,
  whatsapp_message text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cofiteca_products_public_idx on cofiteca_products(visible, sort_order);

-- ---------------------------------------------------------------------------
-- Testimonios (opcional en el admin)
-- ---------------------------------------------------------------------------

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  company text,
  logo_url text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_public_idx on testimonials(visible, sort_order);

-- ---------------------------------------------------------------------------
-- v2 · Estructura real del sitio (migración desde Pixieset)
-- ---------------------------------------------------------------------------

-- Página de cada cliente: título de la sección de videos y bloque de Instagram
alter table projects add column if not exists videos_heading text;
alter table projects add column if not exists instagram_url text;
alter table projects add column if not exists instagram_label text;
alter table projects add column if not exists instagram_image_url text;

-- Secciones de la página de un cliente, en orden:
--   kind = 'gallery' (fotos; layout grid | row | square | single | feature)
--   kind = 'video'   (portada + link al reel en link_url)
alter table project_sections add column if not exists kind text not null default 'gallery';
alter table project_sections add column if not exists layout text not null default 'grid';
alter table project_sections add column if not exists link_url text;
alter table project_sections alter column title drop not null;

-- Foto que acompaña cada testimonio
alter table testimonials add column if not exists image_url text;

-- Mensajes del formulario de contacto
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  services text[] not null default '{}',
  message text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on contact_messages(created_at desc);

-- v3 · Resumen rápido de cada cliente (rubro + etiquetas de lo que hicimos)
alter table projects add column if not exists industry text;
alter table projects add column if not exists services text[] not null default '{}';
