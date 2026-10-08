import Link from "next/link";
import { Button } from "@/components/ui/button";

const varianTombol = { utama: "default", garis: "outline", bahaya: "destructive" };

export default function Tombol({ href, varian = "utama", className = "", children, ...props }) {
  if (href) {
    return (
      <Button asChild variant={varianTombol[varian]} className={className}>
        <Link href={href} {...props}>{children}</Link>
      </Button>
    );
  }

  return <Button variant={varianTombol[varian]} className={className} {...props}>{children}</Button>;
}
