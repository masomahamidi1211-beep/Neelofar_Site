// Step 2 of the CMS login: GitHub sends the editor back here with a one-time
// code. We swap it for an access token (using the secret, which never leaves
// the server) and hand the token to the /admin window that opened this popup,
// using Decap CMS's postMessage handshake.

export const dynamic = "force-dynamic";

function popupPage(origin: string, status: "success" | "error", content: object): Response {
  // JSON.stringify output is embedded in a <script>; escape "<" so the
  // payload can never close the script tag.
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, "\\u003c");
  const allowedOrigin = JSON.stringify(origin);
  const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>ورود</title></head><body>
<p>${status === "success" ? "ورود انجام شد؛ این پنجره بسته می‌شود…" : "ورود انجام نشد. این پنجره را ببندید و دوباره تلاش کنید."}</p>
<script>
(function () {
  var origin = ${allowedOrigin};
  if (!window.opener) return;
  // Only ever reply to the editor on this same site.
  window.addEventListener("message", function receive(event) {
    if (event.origin !== origin) return;
    window.opener.postMessage(${message}, origin);
    window.removeEventListener("message", receive);
    setTimeout(function () { window.close(); }, 500);
  });
  window.opener.postMessage("authorizing:github", origin);
})();
</script></body></html>`;
  return new Response(html, {
    status: status === "success" ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      // The one-time state cookie is used up either way.
      "Set-Cookie": "cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = /(?:^|;\s*)cms_oauth_state=([^;]+)/.exec(request.headers.get("cookie") ?? "")?.[1];

  if (!code || !state || !cookieState || state !== cookieState) {
    return popupPage(origin, "error", { message: "Login expired or was not started from /admin. Please try again." });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return popupPage(origin, "error", { message: "CMS login is not configured on the server." });
  }

  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${origin}/api/callback` }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) {
      return popupPage(origin, "error", { message: data.error_description ?? "GitHub did not return a token." });
    }
    return popupPage(origin, "success", { token: data.access_token, provider: "github" });
  } catch {
    return popupPage(origin, "error", { message: "Could not reach GitHub. Please try again." });
  }
}
