"use client";

import { useEffect, useRef } from "react";
import { tampilkanError } from "@/lib/toast";

export default function ErrorToast({ pesan, id }) {
  const pesanTerakhir = useRef(null);

  useEffect(() => {
    if (pesan && pesanTerakhir.current !== pesan) {
      tampilkanError(pesan, id);
    }
    pesanTerakhir.current = pesan;
  }, [pesan, id]);

  return null;
}
