"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tampilkanError } from "@/lib/toast";

function namaFoto(url) {
  try { return decodeURIComponent(url.split(/[?#]/)[0].split("/").pop()) || "Foto saat ini"; }
  catch { return "Foto saat ini"; }
}

export default function UploadFotoProduk({ fotoLama, disabled, onSelect }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [hapusLama, setHapusLama] = useState(false);
  const input = useRef(null);
  const pilihButton = useRef(null);
  const id = useId();
  const gambar = preview || (!hapusLama && fotoLama);
  const nama = file?.name || (!hapusLama && fotoLama ? namaFoto(fotoLama) : "");
  function pulihkanFile(field, foto) {
    if (!foto) return;
    const transfer = new DataTransfer();
    transfer.items.add(foto);
    field.files = transfer.files;
  }
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    const field = input.current;
    function pulihkan() {
      requestAnimationFrame(() => { if (field.isConnected) pulihkanFile(field, file); });
    }
    field.form?.addEventListener("reset", pulihkan);
    return () => field.form?.removeEventListener("reset", pulihkan);
  }, [file]);
  function pilih(event) {
    const foto = event.target.files?.[0];
    if (!foto) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(foto.type) || foto.size > 3 * 1024 * 1024) {
      tampilkanError("Pilih gambar JPG, PNG, atau WebP, maksimal 3 MB.", "foto-produk");
      event.target.value = "";
      pulihkanFile(event.target, file);
      return;
    }
    setFile(foto);
    onSelect(foto);
  }
  function hapusPilihan() {
    input.current.value = "";
    if (!file) setHapusLama(true);
    setFile(null);
    onSelect(null);
    pilihButton.current?.focus();
  }
  return <div className="flex min-w-0 flex-col gap-3">
    <label htmlFor={id} className="text-sm font-semibold">Foto produk <span aria-hidden="true" className="text-bahaya">*</span></label>
    <input id={id} required={!fotoLama || hapusLama} aria-required="true" className="sr-only" tabIndex={-1}
      name="foto" type="file" accept="image/jpeg,image/png,image/webp" ref={input} onChange={pilih}
      disabled={disabled} aria-describedby={`${id}-petunjuk`} onInvalid={() => pilihButton.current?.focus()} />
    <input type="hidden" name="hapus_foto" value={hapusLama ? "1" : "0"} />
    <Button ref={pilihButton} type="button" variant="outline" className="self-start" disabled={disabled} onClick={() => input.current.click()}>
      <ImagePlus aria-hidden="true" />{gambar ? "Ganti gambar" : "Pilih gambar"}
    </Button>
    <p id={`${id}-petunjuk`} className="text-xs text-teks-lembut">JPG, PNG, atau WebP, maksimal 3 MB.</p>
    {gambar && <div className="flex min-w-0 items-center gap-3 rounded-xl border border-garis p-3">
      <img src={gambar} alt="Pratinjau foto produk" className="size-16 shrink-0 rounded-lg bg-permukaan object-cover sm:size-20" />
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold">{nama}</p>
        <p className="mt-1 text-xs text-teks-lembut">{file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "Foto saat ini"}</p>
      </div>
      <Button type="button" variant="ghost" size="icon" aria-label="Hapus pilihan gambar" title="Hapus pilihan gambar" className="shrink-0 text-teks-lembut hover:text-bahaya" disabled={disabled} onClick={hapusPilihan}><X aria-hidden="true" /></Button>
    </div>}
  </div>;
}
