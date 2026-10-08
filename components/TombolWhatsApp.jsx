import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function TombolWhatsApp({ produk }) {
  const pesan = `Halo, saya ingin memesan ${produk.nama} dengan harga ${formatRupiah(produk.harga)}.`;
  const href = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <Button
      asChild
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 text-base font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        Pesan via WhatsApp
      </a>
    </Button>
  );
}
