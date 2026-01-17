import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "ai-learning-hub-session";
const SESSION_SECRET = process.env.SESSION_SECRET || "default-secret-change-me";

export async function verifyPassword(password: string): Promise<boolean> {
  const appPassword = process.env.APP_PASSWORD;
  
  // If no password is set, allow access (development mode)
  if (!appPassword) {
    return true;
  }
  
  return password === appPassword;
}

export async function createSession(): Promise<string> {
  // Simple session token - in production you'd use something more secure
  const token = Buffer.from(`${SESSION_SECRET}-${Date.now()}`).toString("base64");
  return token;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

export async function isAuthenticated(): Promise<boolean> {
  // If no password is set, always authenticated (development mode)
  if (!process.env.APP_PASSWORD) {
    return true;
  }
  
  const session = await getSession();
  if (!session) return false;
  
  // Verify the session token starts with our secret
  try {
    const decoded = Buffer.from(session, "base64").toString();
    return decoded.startsWith(SESSION_SECRET);
  } catch {
    return false;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
