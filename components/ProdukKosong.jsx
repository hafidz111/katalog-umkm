import IlustrasiProdukKosong from "@/components/IlustrasiProdukKosong";

export default function ProdukKosong({ pencarian = "", judul }) {
  return <div className="flex flex-col items-center gap-3 rounded-2xl border border-garis px-5 py-10 text-center">
    <IlustrasiProdukKosong pencarian={Boolean(pencarian)} />
    <h2 className="max-w-md text-lg font-bold">{judul || (pencarian ? "Tidak ada produk yang cocok dengan pencarian" : "Belum ada produk")}</h2>
    <p className="max-w-sm break-words text-sm leading-relaxed text-teks-lembut">{pencarian ? `Coba kata kunci lain untuk “${pencarian}”.` : "Produk yang tersedia akan ditampilkan di sini."}</p>
  </div>;
}
