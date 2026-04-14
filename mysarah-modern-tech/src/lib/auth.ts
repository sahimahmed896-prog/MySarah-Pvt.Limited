import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const AUTH_COOKIE = "mysarah_admin_token";
const AUTH_SECRET = process.env.AUTH_SECRET || "";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

function ensureAuthConfig() {
  if (!AUTH_SECRET) {
    throw new Error("AUTH_SECRET is not configured.");
  }
}

function hasAdminCredentialConfig() {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD_HASH);
}

export async function verifyAdminCredentials(username: string, password: string) {
  if (!hasAdminCredentialConfig()) {
    return false;
  }

  if (username !== ADMIN_USERNAME) {
    return false;
  }

  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch {
    return false;
  }
}

export function createAdminToken(payload: { username: string }) {
  ensureAuthConfig();
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "2d" });
}

export function verifyAdminToken(token: string) {
  ensureAuthConfig();
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verifyAdminToken(token);
}

export const authCookie = {
  name: AUTH_COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 2,
  },
};
