import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDaftarAdmin() {
  return <div role="status" aria-label="Memuat daftar produk admin" aria-busy="true" className="rounded-2xl border border-garis">
    {Array.from({ length: 6 }, (_, i) => <div key={i} className="flex min-w-0 items-center gap-4 border-b border-garis p-4 last:border-0">
      <Skeleton className="size-11 shrink-0" /><div className="flex min-w-0 flex-1 flex-col gap-3"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
      <Skeleton className="size-11 shrink-0" />
    </div>)}
  </div>;
}
