import "server-only";
import { buatSupabaseServer } from "@/lib/supabase/server";

export const PANJANG_PENCARIAN = 100;
export const UKURAN_HALAMAN = 12;

export function bacaPencarian(params = {}) {
  const nilai = params.q ?? "";
  if (typeof nilai !== "string" || nilai.length > PANJANG_PENCARIAN || /[\x00-\x1f\x7f]/.test(nilai)) {
    return { q: "", halaman: 1, error: "Pencarian harus berupa teks maksimal 100 karakter tanpa karakter kontrol." };
  }
  const q = nilai.trim();
  const urut = params.urut ?? "";
  if (typeof urut !== "string" || !["", "nama-az", "nama-za", "harga-asc", "harga-desc"].includes(urut)) {
    return { q, urut: "", halaman: 1, error: "Pilihan urutan tidak valid. Pilih salah satu urutan nama atau harga." };
  }
  const page = params.page ?? "1";
  if (typeof page !== "string" || !/^[1-9]\d{0,5}$/.test(page)) {
    return { q, urut, halaman: 1, error: "Nomor halaman tidak valid. Ulangi pencarian untuk membuka halaman pertama." };
  }
  return { q, urut, halaman: Number(page), error: "" };
}

export function urlKatalog(q, halaman = 1, urut = "") {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (urut) params.set("urut", urut);
  if (halaman > 1) params.set("page", String(halaman));
  return params.size ? `/?${params}` : "/";
}

export async function ambilKatalog(q, halaman, urut = "") {
  const supabase = buatSupabaseServer();
  function query(page) {
    let request = supabase.from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori, created_at", { count: "exact" });
    // Regex literal menjaga %, _, *, tanda kurung, dan backslash sebagai teks.
    if (q) request = request.filter("nama", "imatch", q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const urutan = {
      "nama-az": ["nama", true], "nama-za": ["nama", false],
      "harga-asc": ["harga", true], "harga-desc": ["harga", false],
    };
    const [kolom, ascending] = urutan[urut] ?? ["created_at", false];
    request = request.order(kolom, { ascending });
    return request
      .order("id", { ascending: false })
      .range((page - 1) * UKURAN_HALAMAN, page * UKURAN_HALAMAN - 1);
  }
  let hasil = await query(halaman);
  if (hasil.error) throw hasil.error;
  const jumlahHalaman = Math.max(1, Math.ceil((hasil.count ?? 0) / UKURAN_HALAMAN));
  // Tautan lama tetap berguna saat jumlah produk berkurang.
  if (halaman > jumlahHalaman) {
    halaman = jumlahHalaman;
    hasil = await query(halaman);
    if (hasil.error) throw hasil.error;
  }
  return { daftarProduk: hasil.data ?? [], halaman, jumlahHalaman };
}
