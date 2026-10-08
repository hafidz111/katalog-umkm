"use server";

import { simpanNotifikasiAdmin, konsumsiNotifikasiAdmin } from "@/lib/notifikasi-admin";

import { unggahFotoProduk, batalkanUploadFoto, ErrorFotoProduk } from "@/lib/supabase/foto-produk";
import { ErrorDeskripsi } from "@/lib/ai/error";
import { buatDeskripsiAI } from "@/lib/ai/deskripsi";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatSupabaseSession } from "@/lib/supabase/session";
import { validasiProduk } from "@/lib/validasi-produk";
import { idProdukValid } from "@/lib/validasi-id-produk";

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
  await simpanNotifikasiAdmin("masuk");
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
  await simpanNotifikasiAdmin("keluar");
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


export async function tambahProdukAdmin(_state, formData) {
  let supabase, foto, hapusUpload = false;
  try {
    supabase = await buatSupabaseSession();
    const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
    if (errorSesi || !sesi?.user) {
      return gagal("Sesi login tidak valid atau telah berakhir. Silakan masuk kembali sebelum menambah produk.");
    }

    const hasil = validasiProduk(formData);
    if (hasil.error) return gagal(hasil.error);

    foto = await unggahFotoProduk(supabase, sesi.user.id, formData);
    if (!foto) return gagal("Foto produk wajib diisi. Pilih gambar sebelum menyimpan.");
    hasil.data.foto_url = foto.url;
    const { data, error } = await supabase.from("produk").insert(hasil.data).select("id").single();
    if (error || !data?.id) {
      hapusUpload = Boolean(error);
      return gagal("Gagal menyimpan produk. Periksa koneksi dan izin akses database, lalu coba lagi.");
    }
  } catch (error) {
    return gagal(error instanceof ErrorFotoProduk ? error.message : "Tidak dapat menyimpan produk. Periksa koneksi dan coba lagi.");
  } finally {
    if (hapusUpload && foto) await batalkanUploadFoto(supabase, foto);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  await simpanNotifikasiAdmin("tambah");
  redirect("/admin");
}


export async function ubahProdukAdmin(id, _state, formData) {
  let supabase, foto, hapusUpload = false;
  try {
    supabase = await buatSupabaseSession();
    const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
    if (errorSesi || !sesi?.user) {
      return gagal("Sesi login tidak valid atau telah berakhir. Silakan masuk kembali sebelum mengubah produk.");
    }
    if (!idProdukValid(id)) return gagal("ID produk tidak valid. Buka kembali produk dari daftar admin.");
    const hasil = validasiProduk(formData);
    if (hasil.error) return gagal(hasil.error);

    const { data: lama, error: errorLama } = await supabase.from("produk").select("id, foto_url").eq("id", id).maybeSingle();
    if (errorLama) return gagal("Gagal memeriksa produk. Silakan coba lagi.");
    if (!lama) return gagal("Produk tidak ditemukan atau tidak dapat diubah.");
    foto = await unggahFotoProduk(supabase, sesi.user.id, formData);
    if (!foto && (formData.get("hapus_foto") === "1" || !(typeof lama.foto_url === "string" && lama.foto_url.trim()))) return gagal("Foto produk wajib diisi. Pilih gambar sebelum menyimpan.");
    if (foto) hasil.data.foto_url = foto.url;
    const { data, error } = await supabase.from("produk")
      .update(hasil.data).eq("id", id).select("id").maybeSingle();
    if (error || !data) {
      hapusUpload = true;
      return gagal(error ? "Gagal menyimpan perubahan. Periksa koneksi dan izin akses database, lalu coba lagi." : "Produk tidak ditemukan atau tidak dapat diubah. Buka kembali daftar produk.");
    }
  } catch (error) {
    return gagal(error instanceof ErrorFotoProduk ? error.message : "Tidak dapat menyimpan perubahan. Periksa koneksi dan coba lagi.");
  } finally {
    if (hapusUpload && foto) await batalkanUploadFoto(supabase, foto);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${BigInt(id).toString()}`);
  await simpanNotifikasiAdmin("ubah");
  redirect("/admin");
}

export async function hapusProdukAdmin(id) {
  try {
    const supabase = await buatSupabaseSession();
    const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
    if (errorSesi || !sesi?.user) {
      return gagal("Sesi login tidak valid atau telah berakhir. Silakan masuk kembali sebelum menghapus produk.");
    }
    if (!idProdukValid(id)) return gagal("ID produk tidak valid. Buka kembali produk dari daftar admin.");

    const { data, error } = await supabase.from("produk")
      .delete().eq("id", id).select("id").maybeSingle();
    if (error) return gagal("Gagal menghapus produk. Periksa koneksi dan izin akses database, lalu coba lagi.");
    if (!data) return gagal("Produk tidak ditemukan, sudah dihapus, atau tidak dapat dihapus.");
  } catch {
    return gagal("Tidak dapat menghapus produk. Periksa koneksi dan coba lagi.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${BigInt(id).toString()}`);
  return { berhasil: true, pesan: "Produk berhasil dihapus.", percobaan: crypto.randomUUID() };
}


export async function buatDeskripsiProdukAdmin(nama, kategori) {
  try {
    const supabase = await buatSupabaseSession();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return gagal("Sesi login tidak valid atau telah berakhir. Silakan masuk kembali sebelum membuat deskripsi AI.");
    const deskripsi = await buatDeskripsiAI(nama, kategori);
    return { berhasil: true, deskripsi };
  } catch (error) {
    return gagal(error instanceof ErrorDeskripsi ? error.message : "Tidak dapat membuat deskripsi AI. Periksa koneksi lalu coba lagi.");
  }
}

export async function ambilNotifikasiAdmin() {
  return konsumsiNotifikasiAdmin();
}
