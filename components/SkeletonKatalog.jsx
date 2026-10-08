import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonKatalog() {
  return <div role="status" aria-label="Memuat produk" aria-busy="true" className="grid grid-cols-2 gap-4 md:grid-cols-3">
    {Array.from({ length: 6 }, (_, i) => <div key={i} className="min-w-0 overflow-hidden rounded-2xl border border-garis">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-3 p-3"><Skeleton className="h-3 w-1/2" /><Skeleton className="h-5 w-full" /><Skeleton className="h-6 w-2/3" /></div>
    </div>)}
  </div>;
}
