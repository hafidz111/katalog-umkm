import ErrorToast from "@/components/ErrorToast";
import KartuProduk from "@/components/KartuProduk";
import FormPencarian from "@/components/FormPencarian";
import Tombol from "@/components/Tombol";
import { ambilKatalog, bacaPencarian, urlKatalog } from "@/lib/katalog";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const pencarian = bacaPencarian(await searchParams);
  const { q, urut = "" } = pencarian;
  let daftarProduk = [];
  let halaman = pencarian.halaman;
  let jumlahHalaman = 1;
  let pesanError = pencarian.error;

  if (!pesanError) {
    try {
      ({ daftarProduk, halaman, jumlahHalaman } = await ambilKatalog(q, halaman, urut));
    } catch {
      pesanError = "Gagal mengambil daftar produk. Silakan muat ulang halaman. Jika masalah berlanjut, hubungi pemilik toko untuk memeriksa koneksi dan konfigurasi Supabase.";
    }
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>
        <FormPencarian q={q} urutAwal={urut} />
        {pesanError ? (
          <ErrorToast pesan={pesanError} id="katalog-produk" />
        ) : daftarProduk.length === 0 ? (
          <p className="text-teks-lembut">{q ? "Tidak ada produk yang cocok dengan pencarian" : "Belum ada produk"}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
        {!pesanError && daftarProduk.length > 0 && jumlahHalaman > 1 && (
          <nav aria-label="Halaman katalog" className="flex flex-wrap items-center gap-3">
            {halaman > 1 && <Tombol href={urlKatalog(q, halaman - 1, urut)} varian="garis">Sebelumnya</Tombol>}
            <span className="text-sm text-teks-lembut">Halaman {halaman} dari {jumlahHalaman}</span>
            {halaman < jumlahHalaman && <Tombol href={urlKatalog(q, halaman + 1, urut)} varian="garis">Berikutnya</Tombol>}
          </nav>
        )}
      </section>
    </>
  );
}
