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
    const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
    if (errorSesi || !sesi?.user) {
      return gagal("Sesi login tidak valid atau telah berakhir. Silakan masuk kembali.");
    }
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

export async function gantiPasswordAdmin(_state, formData) {
  try {
    const supabase = await buatSupabaseSession();
    const { data: sesi, error: errorSesi } = await supabase.auth.getUser();

    if (errorSesi || !sesi?.user) {
      return gagal("Sesi login tidak valid atau telah berakhir. Silakan masuk kembali sebelum mengganti password.");
    }

    const password = formData.get("password_baru");
    const konfirmasi = formData.get("konfirmasi_password");
    if (typeof password !== "string" || typeof konfirmasi !== "string" || !password || !konfirmasi) {
      return gagal("Password baru dan konfirmasi password wajib diisi.");
    }
    if (password.length < 8) {
      return gagal("Password baru minimal 8 karakter.");
    }
    if (password !== konfirmasi) {
      return gagal("Konfirmasi password tidak sama dengan password baru.");
    }

    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      if (error.code === "same_password") {
        return gagal("Password baru harus berbeda dari password sebelumnya.");
      }
      if (error.code === "weak_password") {
        return gagal("Password ditolak karena terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.");
      }
      if (error.code === "reauthentication_needed" || error.code === "reauth_nonce_missing") {
        return gagal("Supabase meminta verifikasi ulang. Silakan keluar dan masuk kembali sebelum mengganti password.");
      }
      if (error.status === 429) {
        return gagal("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");
      }
      return gagal("Gagal mengganti password. Periksa koneksi dan coba lagi.");
    }
    if (!data?.user) {
      return gagal("Perubahan password belum dapat dikonfirmasi. Silakan coba lagi.");
    }

    return { berhasil: true, pesan: "Password berhasil diganti.", percobaan: crypto.randomUUID() };
  } catch {
    return gagal("Tidak dapat terhubung ke layanan akun. Silakan coba lagi atau hubungi pengelola toko.");
  }
}
