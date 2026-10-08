"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Tombol from "@/components/Tombol";
import IkonFilter from "@/components/IkonFilter";

export default function FormPencarian({ q, urutAwal }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [teks, setTeks] = useState(q);
  const timer = useRef(null);
  const sedangMengetik = useRef(false);
  const [terbuka, setTerbuka] = useState(false);
  const [urut, setUrut] = useState(urutAwal);
  const id = useId();
  const tombolRef = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!sedangMengetik.current) setTeks(q);
    if (q === teks.trim()) sedangMengetik.current = false;
  }, [q, teks]);
  useEffect(() => { setUrut(urutAwal); }, [urutAwal]);

  function terapkan(teksBaru, pilihan) {
    clearTimeout(timer.current);
    const params = new URLSearchParams();
    if (teksBaru.trim()) params.set("q", teksBaru.trim());
    if (pilihan) params.set("urut", pilihan);
    startTransition(() => router.replace(params.size ? `/?${params}` : "/", { scroll: false }));
  }

  function ketik(event) {
    const nilai = event.target.value;
    sedangMengetik.current = true;
    setTeks(nilai);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => terapkan(nilai, urut), 400);
  }

  function pilih(nilai) {
    setUrut(nilai);
    setTerbuka(false);
    tombolRef.current?.focus();
    terapkan(teks, nilai);
  }

  return (
    <form action="/" method="get" className="flex items-center gap-2" aria-busy={pending}
      onSubmit={(event) => { event.preventDefault(); terapkan(teks, urut); }}>
      <div className="min-w-0 flex-1">
        <Input aria-label="Cari nama produk" name="q" type="search" value={teks} onChange={ketik}
          maxLength={100} placeholder="Nama produk" />
      </div>
      <input type="hidden" name="urut" value={urut} />
      <div className="relative" onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setTerbuka(false);
      }} onKeyDown={(event) => {
        if (event.key === "Escape") { setTerbuka(false); tombolRef.current?.focus(); }
      }}>
        <Tombol ref={tombolRef} type="button" varian={urut ? "utama" : "garis"}
          className="px-3" aria-label="Filter urutan produk" aria-expanded={terbuka}
          aria-controls={id} onClick={() => setTerbuka((nilai) => !nilai)}>
          <IkonFilter />
        </Tombol>
        {terbuka && (
          <fieldset id={id} className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-garis bg-latar p-4 shadow-lg">
            <legend className="sr-only">Urutan produk</legend>
            <p className="mb-3 text-sm font-semibold">Urutkan produk</p>
            <div className="flex flex-col gap-1" role="group" aria-label="Urutan produk">
              {[["nama-az", "Nama A–Z"], ["nama-za", "Nama Z–A"], ["harga-asc", "Harga termurah"], ["harga-desc", "Harga termahal"]].map(([nilai, label]) => (
                <Tombol key={nilai} type="button" varian={urut === nilai ? "utama" : "garis"}
                  className="justify-start" aria-pressed={urut === nilai} onClick={() => pilih(nilai)}>
                  {label}
                </Tombol>
              ))}
            </div>
          </fieldset>
        )}
      </div>
      <Tombol type="submit">Cari</Tombol>
    </form>
  );
}
