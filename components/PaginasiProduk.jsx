import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { halamanPagination } from "@/lib/halaman-pagination";

export default function PaginasiProduk({ halaman, jumlahHalaman, urlHalaman, label }) {
  if (jumlahHalaman <= 1) return null;
  return <Pagination aria-label={label}>
    <PaginationContent>
      <PaginationItem><PaginationPrevious href={halaman > 1 ? urlHalaman(halaman - 1) : undefined} disabled={halaman === 1} /></PaginationItem>
      {halamanPagination(halaman, jumlahHalaman).map(item => <PaginationItem key={item}>
        {typeof item === "number"
          ? <PaginationLink href={urlHalaman(item)} isActive={item === halaman} aria-label={`Halaman ${item}`}>{item}</PaginationLink>
          : <PaginationEllipsis />}
      </PaginationItem>)}
      <PaginationItem><PaginationNext href={halaman < jumlahHalaman ? urlHalaman(halaman + 1) : undefined} disabled={halaman === jumlahHalaman} /></PaginationItem>
    </PaginationContent>
  </Pagination>;
}
