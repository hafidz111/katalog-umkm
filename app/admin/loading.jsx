import { Skeleton } from "@/components/ui/skeleton";
import SkeletonDaftarAdmin from "@/components/SkeletonDaftarAdmin";

export default function LoadingAdmin() {
  return <div className="flex flex-col gap-6 py-8"><Skeleton className="h-11 w-full" /><Skeleton className="h-8 w-1/2" /><SkeletonDaftarAdmin /></div>;
}
