import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
    >
      <img
        src={produk.foto_url}
        alt={produk.nama}
        className="aspect-square w-full bg-permukaan object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="break-words text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="break-words font-semibold leading-snug group-hover:text-utama">{produk.nama}</h3>
        <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 break-all text-xs font-bold text-harga sm:text-sm">
          {formatRupiah(produk.harga)}
        </p>
      </div>
    </Link>
  );
}
