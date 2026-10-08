import "server-only";
import { cookies } from "next/headers";

const NAMA_COOKIE = "notifikasi-admin";
const pesan = {
  masuk: "Berhasil masuk sebagai admin.",
  keluar: "Berhasil keluar dari admin.",
  tambah: "Produk berhasil ditambahkan.",
  ubah: "Produk berhasil diperbarui.",
};

export async function simpanNotifikasiAdmin(kode) {
  const cookieStore = await cookies();
  cookieStore.set(NAMA_COOKIE, JSON.stringify({ kode, id: crypto.randomUUID() }), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60,
  });
}

export async function konsumsiNotifikasiAdmin() {
  const cookieStore = await cookies();
  const value = cookieStore.get(NAMA_COOKIE)?.value;
  if (!value) return null;
  cookieStore.delete(NAMA_COOKIE);
  try {
    const data = JSON.parse(value);
    if (!Object.hasOwn(pesan, data.kode) || typeof data.id !== "string" || !/^[a-f0-9-]{36}$/.test(data.id)) return null;
    return { pesan: pesan[data.kode], id: data.id };
  } catch { return null; }
}
