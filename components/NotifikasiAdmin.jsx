"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ambilNotifikasiAdmin } from "@/app/admin/actions";
import { tampilkanHasil } from "@/lib/toast";

export default function NotifikasiAdmin() {
  const pathname = usePathname();
  const terakhir = useRef("");
  const ditampilkan = useRef(new Set());
  useEffect(() => {
    if (!pathname.startsWith("/admin") || terakhir.current === pathname) return;
    terakhir.current = pathname;
    ambilNotifikasiAdmin().then((hasil) => {
      if (!hasil || ditampilkan.current.has(hasil.id)) return;
      ditampilkan.current.add(hasil.id);
      tampilkanHasil(hasil.pesan, true, `admin-${hasil.id}`);
    }).catch(() => {});
  }, [pathname]);
  return null;
}
