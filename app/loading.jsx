import { Skeleton } from "@/components/ui/skeleton";
import SkeletonKatalog from "@/components/SkeletonKatalog";

export default function Loading() {
  return <div className="flex flex-col gap-6 py-10"><Skeleton className="h-12 w-2/3 max-w-sm" /><Skeleton className="h-5 w-3/4 max-w-xl" /><Skeleton className="my-4 h-11 w-full" /><SkeletonKatalog /></div>;
}
