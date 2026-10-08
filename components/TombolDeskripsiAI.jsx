"use client";

import { useRef, useState } from "react";
import Tombol from "@/components/Tombol";
import { buatDeskripsiProdukAdmin } from "@/app/admin/actions";
import { tampilkanError } from "@/lib/toast";

export default function TombolDeskripsiAI({ snapshot, onHasil, onPending, disabled }) {
  const [pending, setPending] = useState(false);
  const berjalan = useRef(false);

  async function buat() {
    if (berjalan.current || disabled) return;
    const awal = snapshot();
    if (awal.values.deskripsi.trim() && !window.confirm("Ganti deskripsi yang sudah diisi dengan deskripsi AI?")) return;
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

  return <Tombol type="button" varian="garis" disabled={disabled || pending} onClick={buat}>
    {pending ? "Membuat deskripsi…" : "Buat deskripsi AI"}
  </Tombol>;
}
