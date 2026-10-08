import Link from "next/link";
import { Button } from "@/components/ui/button";

const varianTombol = { utama: "default", garis: "outline", bahaya: "destructive" };

export default function Tombol({ href, varian = "utama", className = "", size, children, ...props }) {
  if (href) {
    return (
      <Button asChild size={size} variant={varianTombol[varian]} className={className}>
        <Link href={href} {...props}>{children}</Link>
      </Button>
    );
  }

  return <Button size={size} variant={varianTombol[varian]} className={className} {...props}>{children}</Button>;
}
