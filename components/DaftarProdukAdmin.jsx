import { ambilProdukAdmin } from "@/lib/paginasi-admin";
import ErrorToast from "@/components/ErrorToast";
import ProdukKosong from "@/components/ProdukKosong";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";

export default async function DaftarProdukAdmin({ supabase, halaman }) {
  let hasil;
  try { hasil = await ambilProdukAdmin(supabase, halaman); }
  catch { return <ErrorToast pesan="Gagal mengambil daftar produk. Silakan muat ulang halaman dan periksa koneksi." id="daftar-produk-admin" />; }
  const { daftarProduk, total, jumlahHalaman } = hasil;
  if (!daftarProduk.length) return <ProdukKosong />;
  return <>
    <p className="text-sm text-teks-lembut">{total} produk · Halaman {hasil.halaman} dari {jumlahHalaman}</p>
    <TabelProduk daftarProduk={daftarProduk} />
    {jumlahHalaman > 1 && <nav aria-label="Halaman produk admin" className="flex flex-wrap items-center justify-between gap-3">
      <div>{hasil.halaman > 1 && <Tombol href={`/admin?page=${hasil.halaman - 1}`} varian="garis">Sebelumnya</Tombol>}</div>
      {hasil.halaman < jumlahHalaman && <Tombol href={`/admin?page=${hasil.halaman + 1}`} varian="garis">Berikutnya</Tombol>}
    </nav>}
  </>;
}
