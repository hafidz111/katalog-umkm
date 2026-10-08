"use client";

import { useActionState } from "react";
import { masukAdmin } from "@/app/admin/actions";
import ErrorToast from "@/components/ErrorToast";
import FormDenganToast from "@/components/FormDenganToast";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormLogin() {
  const [state, action, pending] = useActionState(masukAdmin, { pesan: "", percobaan: "awal" });

  return (
    <>
      <ErrorToast key={state.percobaan} pesan={state.pesan} id="login-admin" />
      <FormDenganToast action={action} className="flex flex-col gap-4" aria-busy={pending}>
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Tombol type="submit" disabled={pending}>Masuk</Tombol>
      </FormDenganToast>
    </>
  );
}
