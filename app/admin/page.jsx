import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import ErrorToast from "@/components/ErrorToast";
import { redirect } from "next/navigation";
import { buatSupabaseSession } from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await buatSupabaseSession({ readOnly: true });
  const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
  if (errorSesi || !sesi?.user) redirect("/admin/login");

  let daftarProduk = [];
  let pesanError = "";
  try {
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    daftarProduk = data ?? [];
  } catch {
    pesanError = "Gagal mengambil daftar produk. Silakan muat ulang halaman. Jika masalah berlanjut, periksa koneksi dan izin akses database Supabase.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {pesanError ? (
        <ErrorToast pesan={pesanError} id="daftar-produk-admin" />
      ) : daftarProduk.length === 0 ? (
        <p className="text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
