"use client";

import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import Tombol from "@/components/Tombol";

export default function AksesAdminFooter() {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <Tombol href="/admin" varian="garis" className="min-h-11 shrink-0 self-start">
    <LogIn aria-hidden="true" />Masuk admin
  </Tombol>;
}
