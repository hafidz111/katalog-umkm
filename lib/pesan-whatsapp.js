import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export function bacaJumlah(nilai) {
  if (typeof nilai !== "string" || !/^\d{1,2}$/.test(nilai)) return null;
  const jumlah = Number(nilai);
  return jumlah >= 1 && jumlah <= 99 ? jumlah : null;
}

export function tautanPesanan(produk, nilai) {
  const jumlah = bacaJumlah(nilai);
  if (jumlah === null) return null;
  const pesan = `Halo, saya ingin memesan ${produk.nama}.\nHarga satuan: ${formatRupiah(produk.harga)}\nJumlah: ${jumlah}\nTotal: ${formatRupiah(produk.harga * jumlah)}`;
  return `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
}
