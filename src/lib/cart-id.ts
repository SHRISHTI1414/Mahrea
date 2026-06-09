import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function getOrCreateGuestId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get("mahrea_guest_id")?.value;
  if (existing) return existing;
  return uuidv4();
}

export async function getGuestId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("mahrea_guest_id")?.value;
}
