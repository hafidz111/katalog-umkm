"use client";

import { useEffect } from "react";

export default function DaftarServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    // Pembaruan mengikuti siklus browser; tidak mengganti halaman/form yang sedang dibuka.
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {
      // PWA opsional: kegagalan registrasi tidak mengganggu katalog atau memicu toast berulang.
    });
  }, []);

  return null;
}
