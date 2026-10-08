"use client";

import { useActionState, useRef, useState } from "react";
import TombolDeskripsiAI from "@/components/TombolDeskripsiAI";
import ErrorToast from "@/components/ErrorToast";
import FormDenganToast from "@/components/FormDenganToast";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
async function aksiBelumAktif() {
  return { pesan: "Simpan perubahan belum tersedia. Fitur ubah produk belum dihubungkan.", percobaan: crypto.randomUUID() };
}

export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [values, setValues] = useState(() => ({
    nama: produk.nama ?? "", harga: produk.harga ?? "", kategori: produk.kategori ?? "",
    foto_url: produk.foto_url ?? "", deskripsi: produk.deskripsi ?? "",
  }));
  const latest = useRef({ values, revisi: 0 });
  const [aiPending, setAiPending] = useState(false);
  const [state, formAction, pending] = useActionState(action ?? aksiBelumAktif, { pesan: "", percobaan: "awal" });
  function ubahField(event) {
    const { name, value } = event.target;
    const baru = { ...latest.current.values, [name]: value };
    latest.current = { values: baru, revisi: latest.current.revisi + (["nama", "kategori", "deskripsi"].includes(name) ? 1 : 0) };
    setValues(baru);
  }
  return (
    <FormDenganToast action={formAction} aria-busy={pending} className="flex max-w-xl flex-col gap-4">
      <ErrorToast key={state.percobaan} pesan={state.pesan} id="simpan-produk" />
      <Input label="Nama produk" name="nama" value={values.nama} onChange={ubahField} required />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        max="2147483647"
        step="1"
        value={values.harga} onChange={ubahField}
        required
      />
      <Input label="Kategori" name="kategori" value={values.kategori} onChange={ubahField} />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        value={values.foto_url} onChange={ubahField}
      />
      <Input label="Deskripsi" name="deskripsi" textarea value={values.deskripsi} onChange={ubahField} />
      <div className="self-start">
        <TombolDeskripsiAI disabled={pending} snapshot={() => latest.current} onPending={setAiPending}
          onHasil={(deskripsi) => {
            const baru = { ...latest.current.values, deskripsi };
            latest.current = { values: baru, revisi: latest.current.revisi + 1 };
            setValues(baru);
          }} />
      </div>
      <div className="flex gap-3">
        <Tombol type="submit" disabled={pending || aiPending}>{labelTombol}</Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </FormDenganToast>
  );
}
