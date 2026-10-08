import { Suspense } from "react";
import DaftarProdukAdmin from "@/components/DaftarProdukAdmin";
import SkeletonDaftarAdmin from "@/components/SkeletonDaftarAdmin";
import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import ErrorToast from "@/components/ErrorToast";
import { redirect } from "next/navigation";
import { buatSupabaseSession } from "@/lib/supabase/session";
import { bacaHalamanAdmin } from "@/lib/paginasi-admin";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin({ searchParams }) {
  const supabase = await buatSupabaseSession({ readOnly: true });
  const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
  if (errorSesi || !sesi?.user) redirect("/admin/login");

  const halaman = bacaHalamanAdmin((await searchParams)?.page);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {halaman === null ? (
        <ErrorToast pesan="Nomor halaman tidak valid. Buka kembali daftar produk dari tab Produk." id="daftar-produk-admin" />
      ) : (
        <Suspense key={halaman} fallback={<SkeletonDaftarAdmin />}>
          <DaftarProdukAdmin supabase={supabase} halaman={halaman} />
        </Suspense>
      )}
    </div>
  );
}
