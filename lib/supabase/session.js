import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Koneksi sesi admin untuk Server Action; cookie hanya dibaca/ditulis di server.
export async function buatSupabaseSession() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Konfigurasi Supabase Auth belum lengkap.");
  }

  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
  });
}
