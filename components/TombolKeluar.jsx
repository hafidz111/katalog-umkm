"use client";

import { LogOut } from "lucide-react";
import ModalKonfirmasi from "@/components/ModalKonfirmasi";
import { startTransition, useActionState, useRef, useState } from "react";
import { keluarAdmin } from "@/app/admin/actions";
import ErrorToast from "@/components/ErrorToast";
import { Button } from "@/components/ui/button";

export default function TombolKeluar() {
  const berjalan = useRef(false);
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(async () => {
    try {
      const hasil = await keluarAdmin();
      setOpen(false);
      return hasil;
    } finally { berjalan.current = false; }
  }, { pesan: "", percobaan: "awal" });

  return (
    <div className="shrink-0" aria-busy={pending}>
      <ErrorToast key={state.percobaan} pesan={state.pesan} id="keluar-admin" />
      <ModalKonfirmasi open={open} onClose={() => setOpen(false)} onConfirm={() => {
        if (berjalan.current) return;
        berjalan.current = true;
        startTransition(() => action());
      }}
        pending={pending} judul="Keluar dari admin?" deskripsi="Anda perlu masuk kembali untuk mengelola produk." labelKonfirmasi="Keluar" />
      <Button
        type="button"
        onClick={() => setOpen(true)}
        variant="outline"
        disabled={pending}
        className="min-h-11 px-3 text-teks-lembut hover:border-bahaya hover:text-bahaya"
      >
        <LogOut aria-hidden="true" />
        {pending ? "Keluar…" : "Keluar"}
      </Button>
    </div>
  );
}
