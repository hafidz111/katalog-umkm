import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonFormProduk() {
  return <div role="status" aria-label="Memuat form produk" aria-busy="true" className="flex w-full max-w-xl flex-col gap-5 py-8">
    <Skeleton className="h-10 w-1/2" />
    {Array.from({ length: 4 }, (_, i) => <div key={i} className="flex flex-col gap-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-11 w-full" /></div>)}
    <Skeleton className="h-28 w-full" /><Skeleton className="h-11 w-1/2 self-end" />
  </div>;
}
