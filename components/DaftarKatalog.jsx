import ErrorToast from "@/components/ErrorToast";
import ProdukKosong from "@/components/ProdukKosong";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { ambilKatalog, urlKatalog } from "@/lib/katalog";

export default async function DaftarKatalog({ q, halaman, urut }) {
  let hasil;
  try { hasil = await ambilKatalog(q, halaman, urut); }
  catch { return <ErrorToast pesan="Gagal mengambil daftar produk. Silakan muat ulang halaman dan periksa koneksi." id="katalog-produk" />; }
  if (!hasil.daftarProduk.length) return <ProdukKosong pencarian={q} />;
  return <>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{hasil.daftarProduk.map(produk => <KartuProduk key={produk.id} produk={produk} />)}</div>
    {hasil.jumlahHalaman > 1 && <nav aria-label="Halaman katalog" className="flex flex-wrap items-center gap-3">
      {hasil.halaman > 1 && <Tombol href={urlKatalog(q, hasil.halaman - 1, urut)} varian="garis">Sebelumnya</Tombol>}
      <span className="text-sm text-teks-lembut">Halaman {hasil.halaman} dari {hasil.jumlahHalaman}</span>
      {hasil.halaman < hasil.jumlahHalaman && <Tombol href={urlKatalog(q, hasil.halaman + 1, urut)} varian="garis">Berikutnya</Tombol>}
    </nav>}
  </>;
}
