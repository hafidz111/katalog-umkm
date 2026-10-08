import { ambilProdukAdmin } from "@/lib/paginasi-admin";
import ErrorToast from "@/components/ErrorToast";
import ProdukKosong from "@/components/ProdukKosong";
import TabelProduk from "@/components/TabelProduk";
import PaginasiProduk from "@/components/PaginasiProduk";

export default async function DaftarProdukAdmin({ supabase, halaman }) {
  let hasil;
  try { hasil = await ambilProdukAdmin(supabase, halaman); }
  catch { return <ErrorToast pesan="Gagal mengambil daftar produk. Silakan muat ulang halaman dan periksa koneksi." id="daftar-produk-admin" />; }
  const { daftarProduk, total, jumlahHalaman } = hasil;
  if (!daftarProduk.length) return <ProdukKosong />;
  return <>
    <p className="text-sm text-teks-lembut">{total} produk · Halaman {hasil.halaman} dari {jumlahHalaman}</p>
    <TabelProduk daftarProduk={daftarProduk} />
    <PaginasiProduk halaman={hasil.halaman} jumlahHalaman={jumlahHalaman} urlHalaman={page => page === 1 ? "/admin" : `/admin?page=${page}`} label="Halaman produk admin" />
  </>;
}
