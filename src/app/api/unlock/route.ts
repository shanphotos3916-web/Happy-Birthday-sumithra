import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

function sameSecret(attempt: string, expected: string) {
  const left = createHash("sha256").update(attempt).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const expected = process.env.PASSWORD?.trim().toLowerCase() ?? "";
  if (!expected) {
    return Response.json({ ok: false }, { status: 500 });
  }

  let attempt = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    attempt = typeof body.password === "string" ? body.password.trim().toLowerCase() : "";
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!sameSecret(attempt, expected)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  return Response.json({ ok: true });
}
