"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />;
}
export function TabsList({ className, ...props }) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn("inline-flex h-10 w-fit items-center rounded-lg bg-permukaan p-1 text-teks-lembut", className)} {...props} />;
}
export function TabsTrigger({ className, ...props }) {
  return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn("inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-utama disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-latar data-[state=active]:text-utama data-[state=active]:shadow-sm", className)} {...props} />;
}
export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}
