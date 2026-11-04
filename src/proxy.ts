import { NextResponse, type NextRequest } from "next/server";
import { isPublishedSlug } from "@/lib/publishedSlugs";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/recepti/")) {
    // An unknown recipe must answer 404, not a 200 "not found" page, so
    // search engines drop the URL instead of reporting a soft 404.
    const slug = decodeURIComponent(pathname.slice("/recepti/".length));
    if (!(await isPublishedSlug(slug))) {
      // A rewrite keeps its target's status, so it goes to the prerendered
      // not-found page, which is served as a 404.
      return NextResponse.rewrite(new URL("/_not-found", request.url));
    }
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/recepti/:slug"],
};
