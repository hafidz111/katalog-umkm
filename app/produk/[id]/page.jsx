import Link from "next/link";
import { notFound } from "next/navigation";
import PesananProduk from "@/components/PesananProduk";
import { buatSupabaseServer } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  // Kolom id bertipe bigint. URL yang tidak valid juga dianggap tidak ditemukan.
  if (!/^\d+$/.test(id) || BigInt(id) > 9223372036854775807n) {
    notFound();
  }

  const supabase = buatSupabaseServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal mengambil detail produk. Silakan coba lagi.");
  }

  if (!produk) {
    notFound();
  }

  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <img
        src={produk.foto_url}
        alt={produk.nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex min-w-0 flex-col gap-4 break-words">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <p className="text-sm text-teks-lembut">{produk.kategori}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
        <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
        <p className="max-w-prose whitespace-pre-line leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
        <PesananProduk produk={{ id: produk.id, nama: produk.nama, harga: produk.harga }} />
      </div>
    </article>
  );
}
