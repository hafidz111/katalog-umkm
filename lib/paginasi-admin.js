import "server-only";

export const UKURAN_HALAMAN_ADMIN = 12;

export function bacaHalamanAdmin(value = "1") {
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) return null;
  return Number(value);
}

export async function ambilProdukAdmin(supabase, halaman) {
  function query(page) {
    return supabase.from("produk")
      .select("id, nama, harga, foto_url, kategori", { count: "exact" })
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .range((page - 1) * UKURAN_HALAMAN_ADMIN, page * UKURAN_HALAMAN_ADMIN - 1);
  }
  let hasil = await query(halaman);
  if (hasil.error) throw hasil.error;
  const total = hasil.count ?? 0;
  const jumlahHalaman = Math.max(1, Math.ceil(total / UKURAN_HALAMAN_ADMIN));
  if (halaman > jumlahHalaman) {
    halaman = jumlahHalaman;
    hasil = await query(halaman);
    if (hasil.error) throw hasil.error;
  }
  return { daftarProduk: hasil.data ?? [], halaman, jumlahHalaman, total };
}
