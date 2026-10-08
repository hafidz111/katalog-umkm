"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="top-center"
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <CircleXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--color-latar)",
        "--normal-text": "var(--color-teks)",
        "--normal-border": "var(--color-garis)",
        "--border-radius": "0.75rem",
      }}
    />
  );
}
