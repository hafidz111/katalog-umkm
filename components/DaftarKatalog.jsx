import ErrorToast from "@/components/ErrorToast";
import ProdukKosong from "@/components/ProdukKosong";
import KartuProduk from "@/components/KartuProduk";
import PaginasiProduk from "@/components/PaginasiProduk";
import { ambilKatalog, urlKatalog } from "@/lib/katalog";

export default async function DaftarKatalog({ q, halaman, urut }) {
  let hasil;
  try { hasil = await ambilKatalog(q, halaman, urut); }
  catch { return <ErrorToast pesan="Gagal mengambil daftar produk. Silakan muat ulang halaman dan periksa koneksi." id="katalog-produk" />; }
  if (!hasil.daftarProduk.length) return <ProdukKosong pencarian={q} />;
  return <>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{hasil.daftarProduk.map(produk => <KartuProduk key={produk.id} produk={produk} />)}</div>
    <PaginasiProduk halaman={hasil.halaman} jumlahHalaman={hasil.jumlahHalaman} urlHalaman={page => urlKatalog(q, page, urut)} label="Halaman katalog" />
  </>;
}
