import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("min-h-11 min-w-0 w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-bahaya", className)}
      {...props}
    />
  );
}
