import { NextResponse } from "next/server";

const loginAttempts = new Map<string, { count: number; start: number }>();

const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function getAllowedOrigins(request: Request) {
  const ownOrigin = new URL(request.url).origin;
  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = request.headers.get("host")?.split(",")[0]?.trim();
  const originHost = forwardedHost || host;
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || requestUrl.protocol.replace(":", "");
  const configured = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const inferredOrigins = originHost
    ? [
        `${protocol}://${originHost}`,
        `http://${originHost}`,
        `https://${originHost}`,
      ]
    : [];

  return new Set([ownOrigin, ...inferredOrigins, ...configured]);
}

export function isCrossSiteBlocked(request: Request) {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return false;
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite === "cross-site") {
    return true;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }

  const allowedOrigins = getAllowedOrigins(request);
  return !allowedOrigins.has(origin);
}

export function rejectCrossSiteRequest(request: Request) {
  if (!isCrossSiteBlocked(request)) {
    return null;
  }

  return NextResponse.json({ error: "Blocked by origin policy." }, { status: 403 });
}

export function rejectUntrustedOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite === "cross-site") {
    return NextResponse.json({ error: "Blocked by origin policy." }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  const allowedOrigins = getAllowedOrigins(request);
  if (!allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "Blocked by origin policy." }, { status: 403 });
  }

  return null;
}

export function isLoginRateLimited(ip: string) {
  const now = Date.now();
  const current = loginAttempts.get(ip);

  if (!current || now - current.start > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, start: now });
    return false;
  }

  current.count += 1;
  return current.count > MAX_LOGIN_ATTEMPTS;
}

export function clearLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
