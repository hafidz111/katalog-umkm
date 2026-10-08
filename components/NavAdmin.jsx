"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TombolKeluar from "@/components/TombolKeluar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NavAdmin() {
  const pathname = usePathname();
  const value = pathname === "/admin/password" ? "password" : "produk";
  return <nav aria-label="Navigasi admin" className="flex flex-wrap items-center justify-between gap-3 border-b border-garis pb-4">
    <Tabs className="min-w-0" value={value} activationMode="manual">
      <TabsList aria-label="Halaman admin">
        <TabsTrigger value="produk" asChild><Link href="/admin" aria-current={value === "produk" ? "page" : undefined}>Produk</Link></TabsTrigger>
        <TabsTrigger value="password" asChild><Link href="/admin/password" aria-current={value === "password" ? "page" : undefined}>Ganti password</Link></TabsTrigger>
      </TabsList>
    </Tabs>
    <TombolKeluar />
  </nav>;
}
