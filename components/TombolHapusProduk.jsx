"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { hapusProdukAdmin } from "@/app/admin/actions";
import { tampilkanHasil } from "@/lib/toast";
import Tombol from "@/components/Tombol";

export default function TombolHapusProduk({ id, nama }) {
  const [pending, startTransition] = useTransition();
  const sedangDiproses = useRef(false);
  const router = useRouter();

  function hapus() {
    if (sedangDiproses.current) return;
    if (!window.confirm(`Hapus produk "${nama}"? Produk yang dihapus tidak dapat dikembalikan.`)) return;
    sedangDiproses.current = true;
    startTransition(async () => {
      try {
        const hasil = await hapusProdukAdmin(String(id));
        // Pemanggilan langsung tetap menampilkan hasil ketika baris tabel dilepas.
        tampilkanHasil(hasil.pesan, hasil.berhasil, `hapus-produk-${id}`);
        if (hasil.berhasil) router.refresh();
      } catch {
        tampilkanHasil("Tidak dapat menghapus produk. Silakan coba lagi.", false, `hapus-produk-${id}`);
      } finally {
        sedangDiproses.current = false;
      }
    });
  }

  return <Tombol type="button" varian="bahaya" disabled={pending} onClick={hapus}>Hapus</Tombol>;
}
