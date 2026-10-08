"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { hapusProdukAdmin } from "@/app/admin/actions";
import { tampilkanHasil } from "@/lib/toast";
import ModalKonfirmasi from "@/components/ModalKonfirmasi";
import Tombol from "@/components/Tombol";

export default function TombolHapusProduk({ id, nama }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const sedangDiproses = useRef(false);
  const router = useRouter();

  function hapus() {
    if (sedangDiproses.current) return;
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
        setOpen(false);
      }
    });
  }

  return <>
  <ModalKonfirmasi open={open} onClose={() => setOpen(false)} onConfirm={hapus} pending={pending} bahaya
    judul="Hapus produk?" deskripsi={`Produk “${nama}” akan dihapus. Tindakan ini tidak dapat dibatalkan.`} labelKonfirmasi="Hapus produk" />
  <Tombol type="button" varian="bahaya" size="icon" aria-label={pending ? `Menghapus ${nama}` : `Hapus ${nama}`} title="Hapus produk" disabled={pending} onClick={() => setOpen(true)}>
    {pending ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Trash2 aria-hidden="true" />}
  </Tombol>
  </>;
}
