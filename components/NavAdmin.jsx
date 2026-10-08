import Link from "next/link";
import TombolKeluar from "@/components/TombolKeluar";

export default function NavAdmin() {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-garis pb-4 text-sm">
      <Link href="/admin" className="font-semibold hover:text-utama">
        Produk
      </Link>
      <Link href="/admin/password" className="font-semibold hover:text-utama">
        Ganti password
      </Link>
      <TombolKeluar />
    </nav>
  );
}
