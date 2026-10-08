"use client";

import { useRef, useState } from "react";
import ModalKonfirmasi from "@/components/ModalKonfirmasi";
import Tombol from "@/components/Tombol";
import { buatDeskripsiProdukAdmin } from "@/app/admin/actions";
import { tampilkanError } from "@/lib/toast";

export default function TombolDeskripsiAI({ snapshot, onHasil, onPending, disabled }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const berjalan = useRef(false);

  async function buat() {
    if (berjalan.current || disabled) return;
    const awal = snapshot();
    setOpen(false);
    berjalan.current = true;
    setPending(true);
    onPending(true);
    try {
      const hasil = await buatDeskripsiProdukAdmin(awal.values.nama, awal.values.kategori);
      if (!hasil.berhasil) { tampilkanError(hasil.pesan, "deskripsi-ai"); return; }
      if (snapshot().revisi !== awal.revisi) {
        tampilkanError("Isian produk berubah saat AI bekerja. Hasil lama tidak dimasukkan; silakan buat deskripsi lagi.", "deskripsi-ai");
        return;
      }
      onHasil(hasil.deskripsi);
    } catch {
      tampilkanError("Tidak dapat membuat deskripsi AI. Periksa koneksi lalu coba lagi.", "deskripsi-ai");
    } finally {
      berjalan.current = false;
      setPending(false);
      onPending(false);
    }
  }

  return <>
    <ModalKonfirmasi open={open} onClose={() => setOpen(false)} onConfirm={buat} judul="Ganti deskripsi?"
      deskripsi="Deskripsi yang sudah diisi akan diganti dengan hasil AI. Anda dapat meninjau dan mengedit hasilnya sebelum menyimpan." labelKonfirmasi="Buat deskripsi AI" />
    <Tombol type="button" varian="garis" disabled={disabled || pending} onClick={() => { if (snapshot().values.deskripsi.trim()) setOpen(true); else buat(); }}>
    {pending ? "Membuat deskripsi…" : "Buat deskripsi AI"}
  </Tombol>
  </>;
}
