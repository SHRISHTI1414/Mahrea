import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.JWT_ACCESS_SECRET ?? "fallback_secret";

export interface AdminPayload {
  userId: string;
  role: "admin";
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, ADMIN_SECRET, { expiresIn: "8h" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, ADMIN_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(req: NextRequest): Promise<AdminPayload | null> {
  const token = req.cookies.get("mahrea_admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin(req: NextRequest): Promise<AdminPayload> {
  const admin = await getAdminFromRequest(req);
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("mahrea_admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
