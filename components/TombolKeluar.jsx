"use client";

import { useActionState } from "react";
import { keluarAdmin } from "@/app/admin/actions";
import ErrorToast from "@/components/ErrorToast";
import { Button } from "@/components/ui/button";

export default function TombolKeluar() {
  const [state, action, pending] = useActionState(keluarAdmin, { pesan: "", percobaan: "awal" });

  return (
    <form action={action} className="ml-auto" aria-busy={pending}>
      <ErrorToast key={state.percobaan} pesan={state.pesan} id="keluar-admin" />
      <Button
        type="submit"
        variant="link"
        disabled={pending}
        className="gap-0 rounded-none p-0 font-normal text-teks-lembut hover:text-bahaya hover:no-underline"
      >
        Keluar
      </Button>
    </form>
  );
}
