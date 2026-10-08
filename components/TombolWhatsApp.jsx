"use client";

import { Button } from "@/components/ui/button";
import { tautanPesanan } from "@/lib/pesan-whatsapp";
import { tampilkanError } from "@/lib/toast";

export default function TombolWhatsApp({ produk, jumlah = "1" }) {
  const href = tautanPesanan(produk, jumlah);

  function periksa(event) {
    if (!href) {
      event.preventDefault();
      tampilkanError("Jumlah harus bilangan bulat antara 1 dan 99. Perbaiki jumlah sebelum memesan.", `jumlah-produk-${produk.id}`);
    }
  }

  return (
    <Button
      asChild
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 text-base font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      <a href={href ?? undefined} target="_blank" rel="noopener noreferrer"
        role={href ? undefined : "button"} tabIndex={href ? undefined : 0}
        onClick={periksa} onKeyDown={(event) => {
          if (!href && (event.key === "Enter" || event.key === " ")) periksa(event);
        }}>
        Pesan via WhatsApp
      </a>
    </Button>
  );
}
