import { NextResponse } from "next/server";
import { authCookie } from "@/lib/auth";
import { rejectCrossSiteRequest } from "@/lib/security";

export async function POST(request: Request) {
  const blocked = rejectCrossSiteRequest(request);
  if (blocked) {
    return blocked;
  }

  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(authCookie.name, "", {
    ...authCookie.options,
    maxAge: 0,
  });
  return response;
}
