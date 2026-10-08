import AksesAdminFooter from "@/components/AksesAdminFooter";
import { toko } from "@/lib/toko";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-garis bg-permukaan">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-teks-lembut sm:flex-row sm:justify-between">
        <div className="min-w-0 max-w-xl break-words leading-relaxed">
          <p className="font-bold text-teks">{toko.nama}</p>
          <p>{toko.alamat}</p>
          <p>{toko.jamBuka}</p>
        </div>
        <AksesAdminFooter />
      </div>
    </footer>
  );
}
