import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDetailProduk() {
  return <div role="status" aria-label="Memuat detail produk" aria-busy="true" className="grid gap-8 py-8 md:grid-cols-2">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <div className="flex flex-col gap-4"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-10 w-4/5" /><Skeleton className="h-8 w-1/2" /><Skeleton className="h-24 w-full" /><Skeleton className="h-11 w-full" /></div>
  </div>;
}
