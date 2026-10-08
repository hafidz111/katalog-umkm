"use client";

import ErrorToast from "@/components/ErrorToast";
import Tombol from "@/components/Tombol";

export default function ErrorHalaman({ reset }) {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <ErrorToast id="halaman" pesan="Halaman gagal dimuat. Silakan coba lagi." />
      <Tombol type="button" onClick={reset}>Coba lagi</Tombol>
    </div>
  );
}
