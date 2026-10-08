"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import Tombol from "@/components/Tombol";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { bacaJumlah } from "@/lib/pesan-whatsapp";
import { tampilkanError } from "@/lib/toast";

export default function PesananProduk({ produk }) {
  const [jumlah, setJumlah] = useState("1");
  const inputId = useId();
  const jumlahValid = bacaJumlah(jumlah);

  function ubahJumlah(selisih) {
    if (jumlahValid === null) {
      tampilkanError("Jumlah harus bilangan bulat antara 1 dan 99. Perbaiki jumlah sebelum memesan.", `jumlah-produk-${produk.id}`);
      return;
    }
    setJumlah(String(Math.min(99, Math.max(1, jumlahValid + selisih))));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-semibold">Jumlah</label>
        <div className="flex items-center gap-2">
          <Tombol type="button" varian="garis" size="icon" aria-label="Kurangi jumlah"
            disabled={jumlahValid === 1} onClick={() => ubahJumlah(-1)}>−</Tombol>
          <Input id={inputId} name="jumlah" inputMode="numeric" value={jumlah}
            className="w-20 text-center" onChange={(event) => setJumlah(event.target.value)}
            aria-label="Jumlah produk (1–99)" />
          <Tombol type="button" varian="garis" size="icon" aria-label="Tambah jumlah"
            disabled={jumlahValid === 99} onClick={() => ubahJumlah(1)}>+</Tombol>
        </div>
      </div>
      <TombolWhatsApp produk={produk} jumlah={jumlah} />
    </div>
  );
}
