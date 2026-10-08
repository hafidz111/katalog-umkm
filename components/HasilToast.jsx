"use client";

import { useEffect, useRef } from "react";
import { tampilkanHasil } from "@/lib/toast";

export default function HasilToast({ pesan, berhasil, id }) {
  const sudahTampil = useRef(false);

  useEffect(() => {
    if (pesan && !sudahTampil.current) {
      tampilkanHasil(pesan, berhasil, id);
      sudahTampil.current = true;
    }
  }, [pesan, berhasil, id]);

  return null;
}
