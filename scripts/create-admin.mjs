// Crea o actualiza un usuario admin en Neon.
// Uso: npm run create-admin -- admin@email.com "password-segura" "Nombre"
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const [, , emailArg, passwordArg, nameArg = "Administrador"] = process.argv;

if (!emailArg || !passwordArg) {
  console.error('Uso: npm run create-admin -- admin@email.com "password-segura" ["Nombre"]');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL (en .env.local).");
  process.exit(1);
}

const email = String(emailArg).trim().toLowerCase();
const password = String(passwordArg);
if (password.length < 10) {
  console.error("La contraseña debe tener al menos 10 caracteres.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const passwordHash = await bcrypt.hash(password, 12);

const [admin] = await sql`
  insert into admin_users (email, name, password_hash, role, active)
  values (${email}, ${nameArg}, ${passwordHash}, 'admin', true)
  on conflict (email) do update
  set name = excluded.name,
      password_hash = excluded.password_hash,
      active = true,
      updated_at = now()
  returning id, email
`;

console.log(`Admin listo: ${admin.email} (${admin.id})`);
