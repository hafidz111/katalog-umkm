"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatSupabaseSession } from "@/lib/supabase/session";

function gagal(pesan) {
  // Identitas hasil baru memungkinkan toast muncul lagi pada percobaan berikutnya.
  return { pesan, percobaan: crypto.randomUUID() };
}

export async function masukAdmin(_state, formData) {
  const emailInput = formData.get("email");
  const password = formData.get("password");
  const email = typeof emailInput === "string" ? emailInput.trim() : "";

  if (!email || typeof password !== "string" || !password) {
    return gagal("Email dan password wajib diisi.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return gagal("Format email tidak valid. Periksa kembali email Anda.");
  }

  try {
    const supabase = await buatSupabaseSession();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.code === "invalid_credentials") {
        return gagal("Email atau password salah. Silakan periksa dan coba lagi.");
      }
      if (error.code === "email_not_confirmed") {
        return gagal("Email belum dikonfirmasi. Hubungi pengelola akun admin.");
      }
      if (error.status === 429) {
        return gagal("Terlalu banyak percobaan login. Tunggu sebentar lalu coba lagi.");
      }
      return gagal("Login gagal. Periksa koneksi atau hubungi pengelola akun admin.");
    }
    if (!data.user || !data.session) {
      return gagal("Sesi login belum terbentuk. Silakan coba lagi.");
    }
  } catch {
    return gagal("Tidak dapat terhubung ke layanan login. Coba lagi atau hubungi pengelola toko untuk memeriksa konfigurasi Supabase.");
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function keluarAdmin() {
  try {
    const supabase = await buatSupabaseSession();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      return gagal("Gagal mengakhiri sesi. Silakan coba keluar lagi.");
    }
  } catch {
    return gagal("Tidak dapat terhubung ke layanan login. Silakan coba keluar lagi.");
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
