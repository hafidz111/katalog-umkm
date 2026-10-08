"use client";

import { tampilkanError } from "@/lib/toast";

export default function FormDenganToast({ children, ...props }) {
  function tanganiInvalid(event) {
    event.preventDefault();
    const field = event.target;
    const form = field.form;
    // Browser memicu invalid untuk setiap field. Hanya laporkan field pertama.
    if (form?.querySelector(":invalid") !== field) return;
    const label = field.labels?.[0]?.textContent?.trim() || "Isian";
    const validity = field.validity;
    let pesan = `${label} tidak valid. Periksa kembali isian ini.`;
    if (validity.valueMissing) pesan = `${label} wajib diisi.`;
    else if (validity.typeMismatch) pesan = `${label} harus memakai format ${field.type === "email" ? "email" : "yang benar"}.`;
    else if (validity.tooShort) pesan = `${label} minimal ${field.minLength} karakter.`;
    else if (validity.rangeUnderflow) pesan = `${label} minimal ${field.min}.`;
    else if (validity.rangeOverflow) pesan = `${label} maksimal ${field.max}.`;
    tampilkanError(pesan, "validasi-form");
    field.focus();
  }

  return <form {...props} onInvalidCapture={tanganiInvalid}>{children}</form>;
}
