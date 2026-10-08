import { Pencil } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapusProduk from "@/components/TombolHapusProduk";

export default function TabelProduk({ daftarProduk }) {
  return (
    <div className="min-w-0 rounded-2xl border border-garis">
      <table className="block w-full text-left text-sm md:table md:table-fixed">
        <thead className="hidden bg-permukaan text-teks-lembut md:table-header-group">
          <tr>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {daftarProduk.map((produk) => (
            <tr key={produk.id} className="grid grid-cols-2 gap-y-1 border-t border-garis first:border-t-0 md:table-row md:first:border-t">
              <td className="col-span-2 block px-4 pt-4 pb-1 md:table-cell md:py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={produk.foto_url} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                  <span className="min-w-0 break-words font-semibold">{produk.nama}</span>
                </div>
              </td>
              <td className="block break-words px-4 py-2 text-teks-lembut md:table-cell md:py-3">{produk.kategori}</td>
              <td className="block break-words px-4 py-2 text-right font-semibold md:table-cell md:py-3 md:text-left">{formatRupiah(produk.harga)}</td>
              <td className="col-span-2 block px-4 pt-2 pb-4 md:table-cell md:py-3">
                <div className="flex flex-wrap justify-end gap-2">
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis" size="icon" aria-label={`Ubah ${produk.nama}`} title="Ubah produk">
                    <Pencil aria-hidden="true" />
                  </Tombol>
                  <TombolHapusProduk id={produk.id} nama={produk.nama} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
