import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// A malformed address such as /notes/%E0 makes Next's own URL decoding throw,
// which shows readers a 500 server error. Catch it first and show the normal
// "not found" page instead (an address with no page renders it).
export function proxy(request: NextRequest) {
  try {
    decodeURIComponent(request.nextUrl.pathname);
    return NextResponse.next();
  } catch {
    return NextResponse.rewrite(new URL("/__not-found__", request.url));
  }
}

export const config = {
  matcher: ["/notes/:path*", "/tag/:path*"],
};
