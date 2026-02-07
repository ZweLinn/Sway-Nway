import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/books/:path*",
    "/notes/:path*",
    "/settings/:path*",
    "/api/books/:path*",
    "/api/discussions/:path*",
    "/api/notes/:path*",
    "/api/chat/:path*",
  ],
};
