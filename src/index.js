const MAX_NAME = 20;
const MAX_BODY = 400;
const MAX_REQUEST_CHARS = 4000;
const HOUR_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 5;
const MAX_ROWS = 300;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/expectations") {
      if (request.method === "GET") return listExpectations(env);
      if (request.method === "POST") return createExpectation(request, env);
      return json({ error: "不支援這個動作" }, 405);
    }
    return env.ASSETS.fetch(request);
  },
};

async function listExpectations(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, name, body, created_at FROM expectations ORDER BY id DESC LIMIT 100"
  ).all();
  return json({ expectations: results ?? [] });
}

async function createExpectation(request, env) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_REQUEST_CHARS) return json({ error: "內容太長" }, 413);

  let payload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_REQUEST_CHARS) return json({ error: "內容太長" }, 413);
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "請再試一次" }, 400);
  }

  if (payload && typeof payload.website === "string" && payload.website.trim() !== "") {
    return json({ ok: true });
  }

  const name = clean(payload?.name, MAX_NAME);
  const body = clean(payload?.body, MAX_BODY);
  if (!name || name.length > MAX_NAME) return json({ error: "請寫下你的名字，20 字以內" }, 400);
  if (!body || body.length > MAX_BODY) return json({ error: "請寫下你的期望，400 字以內" }, 400);

  const ipHash = await hashIp(request.headers.get("CF-Connecting-IP") || "unknown");
  const since = new Date(Date.now() - HOUR_MS).toISOString();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM expectations WHERE ip_hash = ? AND created_at > ?"
  ).bind(ipHash, since).first("n");
  if (Number(recent) >= MAX_PER_HOUR) {
    return json({ error: "寫得太密，請稍後再留一句" }, 429);
  }

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
    expectation: {
      id: inserted.meta.last_row_id,
      name,
      body,
      created_at: createdAt,
    },
  }, 201);
}

function clean(value, max) {
  if (typeof value !== "string") return "";
  const text = value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if (text.length > max) return text;
  return text;
}

async function hashIp(ip) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return [...new Uint8Array(digest)].slice(0, 8).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
