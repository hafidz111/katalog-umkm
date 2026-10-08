import { redirect, notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { buatSupabaseSession } from "@/lib/supabase/session";
import { idProdukValid } from "@/lib/validasi-id-produk";
import { ubahProdukAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  if (!idProdukValid(id)) notFound();
  const supabase = await buatSupabaseSession({ readOnly: true });
  const { data: sesi, error: errorSesi } = await supabase.auth.getUser();
  if (errorSesi || !sesi?.user) redirect("/admin/login");
  const { data: produk, error } = await supabase.from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
    .eq("id", id).maybeSingle();
  if (error) throw new Error("Gagal mengambil produk untuk diubah. Silakan coba lagi.");

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk key={id} action={ubahProdukAdmin.bind(null, id)} produk={produk} labelTombol="Simpan perubahan" />
    </div>
  );
}
