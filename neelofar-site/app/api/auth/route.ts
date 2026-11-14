// Step 1 of the CMS login (/admin): send the editor to GitHub to sign in.
// Needs GITHUB_OAUTH_CLIENT_ID (from the GitHub OAuth app) in Vercel's
// environment variables. See README "Content editor (CMS)".

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response(
      "ورود به ویرایشگر هنوز راه‌اندازی نشده است: GITHUB_OAUTH_CLIENT_ID در تنظیمات Vercel تعریف نشده.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const origin = new URL(request.url).origin;
  // Random value checked again in /api/callback, so a login response can only
  // complete a login that started here (protects against forged callbacks).
  const state = crypto.randomUUID();

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${origin}/api/callback`);
  // The repository is public, so write access to public repos is enough.
  authorize.searchParams.set("scope", "public_repo");
  authorize.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      "Cache-Control": "no-store",
    },
  });
}
