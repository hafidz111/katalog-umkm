"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ModalKonfirmasi({ open, onClose, onConfirm, judul, deskripsi, labelKonfirmasi, pending = false, bahaya = false }) {
  const dialog = useRef(null);
  const id = useId();
  useEffect(() => {
    const element = dialog.current;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  return <dialog ref={dialog} aria-labelledby={`${id}-judul`} aria-describedby={`${id}-deskripsi`}
    onCancel={(event) => { event.preventDefault(); if (!pending) onClose(); }}
    className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md max-h-[calc(100dvh_-_2rem)] overflow-y-auto rounded-2xl border border-garis bg-latar p-6 text-teks shadow-xl backdrop:bg-teks/40">
    <h2 id={`${id}-judul`} className="text-xl font-bold">{judul}</h2>
    <p id={`${id}-deskripsi`} className="mt-3 break-words text-sm leading-relaxed text-teks-lembut">{deskripsi}</p>
    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <Button type="button" variant="outline" autoFocus disabled={pending} onClick={onClose}>Batal</Button>
      <Button type="button" disabled={pending} variant={bahaya ? "destructive" : "default"} onClick={onConfirm}>
        {pending ? "Memproses…" : labelKonfirmasi}
      </Button>
    </div>
  </dialog>;
}
