import "server-only";
import crypto from "node:crypto";
import { getSql } from "./db";
import { getAuthSecret } from "./auth";
import { PublicApiError } from "./http";

// Protección simple contra fuerza bruta en el login admin.
// Se cuentan fallos por IP y por email (hasheados con AUTH_SECRET, no se guardan en claro).
// Superado el límite dentro de la ventana, la clave queda bloqueada LOCK_MINUTES.
const WINDOW_MINUTES = 15;
const LOCK_MINUTES = 15;
const LIMITS = { ip: 20, email: 5 };

export function buildLoginKeys({ ip, email }) {
  return [
    { key: hashKey(`ip:${ip}`), max: LIMITS.ip },
    { key: hashKey(`email:${String(email || "").trim().toLowerCase().slice(0, 254) || "missing"}`), max: LIMITS.email }
  ];
}

export async function assertLoginAllowed(keys) {
  const sql = getSql();
  const hashes = keys.map((item) => item.key);
  const [row] = await sql`
    select ceil(extract(epoch from max(locked_until) - now()))::int as retry_after
    from admin_login_attempts
    where key_hash = any(${hashes}) and locked_until > now()
  `;
  const retryAfter = Number(row?.retry_after) || 0;
  if (retryAfter > 0) {
    throw new PublicApiError("RATE_LIMITED", "Demasiados intentos. Esperá unos minutos antes de volver a intentar.", {
      status: 429,
      retryAfter
    });
  }
}

export async function recordLoginFailure(keys) {
  const sql = getSql();
  for (const { key, max } of keys) {
    await sql`
      insert into admin_login_attempts as a (key_hash, failures, locked_until, updated_at)
      values (${key}, 1, null, now())
      on conflict (key_hash) do update set
        failures = case
          when a.updated_at < now() - make_interval(mins => ${WINDOW_MINUTES}) then 1
          else a.failures + 1
        end,
        locked_until = case
          when (case when a.updated_at < now() - make_interval(mins => ${WINDOW_MINUTES}) then 1 else a.failures + 1 end) >= ${max}
            then now() + make_interval(mins => ${LOCK_MINUTES})
          else a.locked_until
        end,
        updated_at = now()
    `;
  }
}

export async function clearLoginFailures(keys) {
  const sql = getSql();
  const hashes = keys.map((item) => item.key);
  await sql`delete from admin_login_attempts where key_hash = any(${hashes})`;
}

function hashKey(value) {
  return crypto.createHmac("sha256", getAuthSecret()).update(`cofilab:login:v1:${value}`).digest("hex");
}
