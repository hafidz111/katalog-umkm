import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-utama text-white hover:bg-utama-gelap",
        outline: "border border-garis bg-latar text-teks hover:border-utama hover:text-utama",
        destructive: "border border-garis bg-latar text-bahaya hover:border-bahaya",
        secondary: "bg-permukaan text-teks hover:bg-permukaan/80",
        ghost: "hover:bg-permukaan hover:text-teks",
        link: "text-utama underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-4 py-2.5",
        sm: "px-3 py-2",
        lg: "px-6 py-3",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
