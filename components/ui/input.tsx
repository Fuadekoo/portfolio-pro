import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full min-w-0 rounded-xl border border-input bg-white/3 px-4 text-[15px] text-foreground placeholder:text-subtle transition-[border-color,background-color,box-shadow] duration-300 outline-none hover:border-white/20 focus-visible:border-brand/70 focus-visible:bg-white/5 focus-visible:ring-4 focus-visible:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive/70 aria-invalid:focus-visible:ring-destructive/15";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldBase, "h-12", className)}
      {...props}
    />
  );
}

export { Input, fieldBase };
