import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({ className, ...props }) {
  return <nav role="navigation" aria-label="Pagination" data-slot="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />;
}

export function PaginationContent({ className, ...props }) {
  return <ul data-slot="pagination-content" className={cn("flex flex-wrap items-center justify-center gap-1", className)} {...props} />;
}

export function PaginationItem(props) {
  return <li data-slot="pagination-item" {...props} />;
}

export function PaginationLink({ className, isActive, disabled, size = "icon", href, ...props }) {
  const classes = cn(buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-utama focus-visible:ring-offset-2",
    isActive && "border-utama bg-permukaan text-utama",
    disabled && "cursor-default opacity-40", className);
  if (disabled) return <span data-slot="pagination-link" aria-disabled="true" className={classes} {...props} />;
  return <Link data-slot="pagination-link" aria-current={isActive ? "page" : undefined} className={classes} href={href} {...props} />;
}

export function PaginationPrevious({ className, ...props }) {
  return <PaginationLink aria-label="Halaman sebelumnya" className={cn("px-0 sm:w-auto sm:px-3", className)} {...props}>
    <ChevronLeft aria-hidden="true" /><span className="hidden sm:block">Sebelumnya</span>
  </PaginationLink>;
}

export function PaginationNext({ className, ...props }) {
  return <PaginationLink aria-label="Halaman berikutnya" className={cn("px-0 sm:w-auto sm:px-3", className)} {...props}>
    <span className="hidden sm:block">Berikutnya</span><ChevronRight aria-hidden="true" />
  </PaginationLink>;
}

export function PaginationEllipsis({ className, ...props }) {
  return <span data-slot="pagination-ellipsis" className={cn("flex size-11 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="size-4" aria-hidden="true" /><span className="sr-only">Halaman lainnya</span>
  </span>;
}
