import { Suspense } from "react";
import DaftarKatalog from "@/components/DaftarKatalog";
import SkeletonKatalog from "@/components/SkeletonKatalog";
import ErrorToast from "@/components/ErrorToast";
import FormPencarian from "@/components/FormPencarian";
import { bacaPencarian } from "@/lib/katalog";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const pencarian = bacaPencarian(await searchParams);
  const { q, urut = "" } = pencarian;

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
        {pencarian.error ? (
          <ErrorToast pesan={pencarian.error} id="katalog-produk" />
        ) : (
          <Suspense key={`${q}:${urut}:${pencarian.halaman}`} fallback={<SkeletonKatalog />}>
            <DaftarKatalog q={q} urut={urut} halaman={pencarian.halaman} />
          </Suspense>
        )}
      </section>
    </>
  );
}
