"use client";

import { toast } from "sonner";

// Semua error memakai satu tempat agar pesan yang sama tidak ditampilkan ganda.
export function tampilkanError(pesan, id = pesan) {
  return toast.error(pesan, { id: `error:${id}` });
}

export function tampilkanHasil(pesan, berhasil, id) {
  const tampilkan = berhasil ? toast.success : toast.error;
  return tampilkan(pesan, { id: `hasil:${id}` });
}
