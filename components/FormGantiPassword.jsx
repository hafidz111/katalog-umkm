"use client";

import { useActionState } from "react";
import { gantiPasswordAdmin } from "@/app/admin/actions";
import FormDenganToast from "@/components/FormDenganToast";
import HasilToast from "@/components/HasilToast";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormGantiPassword() {
  const [state, action, pending] = useActionState(gantiPasswordAdmin, {
    pesan: "", berhasil: false, percobaan: "awal",
  });

  return (
    <>
      <HasilToast key={state.percobaan} pesan={state.pesan} berhasil={state.berhasil} id="ganti-password" />
      <FormDenganToast action={action} className="flex w-full min-w-0 max-w-sm flex-col gap-4" aria-busy={pending}>
        <Input
          label="Password baru"
          name="password_baru"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          label="Ulangi password baru"
          name="konfirmasi_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Tombol type="submit" className="w-full sm:w-auto sm:self-end" disabled={pending}>
          Simpan password
        </Tombol>
      </FormDenganToast>
    </>
  );
}
