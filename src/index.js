import { DEFAULT_CONTENT, sanitizeContent } from "./default-content.js";

const MAX_NAME = 20;
const MAX_BODY = 400;
const MAX_REQUEST_CHARS = 4000;
const MAX_CONTENT_CHARS = 80000;
const HOUR_MS = 60 * 60 * 1000;
const SESSION_MS = 12 * HOUR_MS;
const MAX_PER_HOUR = 5;
const MAX_ROWS = 300;
const MAX_LOGINS = 8;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/expectations" && request.method === "GET") return listExpectations(env);
    if (url.pathname === "/api/expectations" && request.method === "POST") return createExpectation(request, env);
    if (url.pathname === "/api/content" && request.method === "GET") return getContent(env);
    if (url.pathname === "/api/admin/login" && request.method === "POST") return login(request, env);
    if (url.pathname === "/api/admin/logout" && request.method === "POST") return logout(request);
    if (url.pathname === "/admin" || url.pathname === "/admin/") return adminPage(request, env);
    if (url.pathname === "/api/admin/session" && request.method === "GET") {
      return json({ ok: await isAdmin(request, env) });
    }
    if (url.pathname === "/api/admin/content" && request.method === "PUT") {
      if (!(await isAdmin(request, env))) return json({ error: "請先登入" }, 401);
      return saveContent(request, env);
    }
    if (url.pathname === "/api/admin/expectations" && request.method === "GET") {
      if (!(await isAdmin(request, env))) return json({ error: "請先登入" }, 401);
      return listExpectations(env);
    }
    const expectationId = url.pathname.match(/^\/api\/admin\/expectations\/(\d+)$/);
    if (expectationId && request.method === "DELETE") {
      if (!(await isAdmin(request, env))) return json({ error: "請先登入" }, 401);
      await env.DB.prepare("DELETE FROM expectations WHERE id = ?").bind(Number(expectationId[1])).run();
      return json({ ok: true });
    }
    if (url.pathname.startsWith("/api/")) return json({ error: "不支援這個動作" }, 405);
    return env.ASSETS.fetch(request);
  },
};

async function getContent(env) {
  try {
    const row = await env.DB.prepare("SELECT body, updated_at FROM site_content WHERE id = 1").first();
    if (!row) return json({ content: DEFAULT_CONTENT, updatedAt: null });
    return json({ content: sanitizeContent(JSON.parse(row.body)), updatedAt: row.updated_at });
  } catch {
    return json({ content: DEFAULT_CONTENT, updatedAt: null });
  }
}

async function adminPage(request, env) {
  const assetUrl = new URL("/admin.html", request.url);
  return env.ASSETS.fetch(new Request(assetUrl, { method: "GET", headers: request.headers }));
}

async function saveContent(request, env) {
  const payload = await readJson(request, MAX_CONTENT_CHARS);
  if (payload.error) return payload.error;
  const content = payload.value.reset === true ? DEFAULT_CONTENT : sanitizeContent(payload.value.content);
  const updatedAt = new Date().toISOString();
  await env.DB.prepare(
    "INSERT INTO site_content (id, body, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at"
  ).bind(JSON.stringify(content), updatedAt).run();
  return json({ ok: true, content, updatedAt });
}

async function login(request, env) {
  if (!env.ADMIN_PASSWORD) return json({ error: "管理員密碼未設定" }, 503);
  const ipHash = await hashIp(request.headers.get("CF-Connecting-IP") || "unknown");
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM login_attempts WHERE ip_hash = ? AND created_at > ?"
  ).bind(ipHash, since).first("n");
  if (Number(recent) >= MAX_LOGINS) return json({ error: "試太多次，請 15 分鐘後再試" }, 429);

  const payload = await readJson(request, 1000);
  if (payload.error) return payload.error;
  const password = typeof payload.value.password === "string" ? payload.value.password : "";
  const ok = await passwordsMatch(password, env.ADMIN_PASSWORD);
  if (!ok) {
    await env.DB.prepare("INSERT INTO login_attempts (ip_hash, created_at) VALUES (?, ?)").bind(ipHash, new Date().toISOString()).run();
    return json({ error: "密碼不對" }, 401);
  }
  const exp = Date.now() + SESSION_MS;
  const sig = await hmac(env.ADMIN_PASSWORD, String(exp));
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, {
    "set-cookie": `mission_admin=${exp}.${sig}; HttpOnly; Path=/; Max-Age=${SESSION_MS / 1000}; SameSite=Lax${secure ? "; Secure" : ""}`,
  });
}

function logout(request) {
  const secure = new URL(request.url).protocol === "https:";
  return json({ ok: true }, 200, {
    "set-cookie": `mission_admin=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure ? "; Secure" : ""}`,
  });
}

async function isAdmin(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)mission_admin=(\d+)\.([0-9a-f]+)/);
  if (!match) return false;
  const exp = Number(match[1]);
  if (!exp || exp < Date.now()) return false;
  const expected = await hmac(env.ADMIN_PASSWORD, match[1]);
  return safeEqual(expected, match[2]);
}

async function listExpectations(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, name, body, created_at FROM expectations ORDER BY id DESC LIMIT 100"
  ).all();
  return json({ expectations: results ?? [] });
}

async function createExpectation(request, env) {
  const payload = await readJson(request, MAX_REQUEST_CHARS);
  if (payload.error) return payload.error;
  const data = payload.value;
  if (data && typeof data.website === "string" && data.website.trim() !== "") return json({ ok: true });

  const name = clean(data?.name);
  const body = clean(data?.body);
  if (!name || name.length > MAX_NAME) return json({ error: "請寫下你的名字，20 字以內" }, 400);
  if (!body || body.length > MAX_BODY) return json({ error: "請寫下你的期望，400 字以內" }, 400);

  const ipHash = await hashIp(request.headers.get("CF-Connecting-IP") || "unknown");
  const since = new Date(Date.now() - HOUR_MS).toISOString();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM expectations WHERE ip_hash = ? AND created_at > ?"
  ).bind(ipHash, since).first("n");
  if (Number(recent) >= MAX_PER_HOUR) return json({ error: "寫得太密，請稍後再留一句" }, 429);

  const total = await env.DB.prepare("SELECT COUNT(*) AS n FROM expectations").first("n");
  if (Number(total) >= MAX_ROWS) return json({ error: "留言已滿，請跟隊長說" }, 403);

  const duplicate = await env.DB.prepare(
    "SELECT id FROM expectations WHERE name = ? AND body = ? LIMIT 1"
  ).bind(name, body).first();
  if (duplicate) return json({ error: "這句已經留低了" }, 409);

  const createdAt = new Date().toISOString();
  const inserted = await env.DB.prepare(
    "INSERT INTO expectations (name, body, ip_hash, created_at) VALUES (?, ?, ?, ?)"
  ).bind(name, body, ipHash, createdAt).run();
  return json({
    ok: true,
    expectation: { id: inserted.meta.last_row_id, name, body, created_at: createdAt },
  }, 201);
}

async function readJson(request, maxChars) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maxChars) return { error: json({ error: "內容太長" }, 413) };
  try {
    const raw = await request.text();
    if (raw.length > maxChars) return { error: json({ error: "內容太長" }, 413) };
    return { value: JSON.parse(raw) };
  } catch {
    return { error: json({ error: "請再試一次" }, 400) };
  }
}

function clean(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

async function hashIp(ip) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].slice(0, 8).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return [...new Uint8Array(sig)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordsMatch(input, secret) {
  const enc = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(String(input))),
    crypto.subtle.digest("SHA-256", enc.encode(String(secret))),
  ]);
  return crypto.subtle.timingSafeEqual(new Uint8Array(left), new Uint8Array(right));
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  const a = new Uint8Array(left.length);
  const b = new Uint8Array(right.length);
  for (let i = 0; i < left.length; i += 1) {
    a[i] = left.charCodeAt(i);
    b[i] = right.charCodeAt(i);
  }
  return crypto.subtle.timingSafeEqual(a, b);
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extra,
    },
  });
}
