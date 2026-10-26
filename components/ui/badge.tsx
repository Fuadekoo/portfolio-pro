import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors [&_svg]:size-3 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-border bg-ink/4 text-muted-foreground",
        brand: "border-brand/30 bg-brand/10 text-brand-soft",
        outline: "border-border-strong text-foreground",
        sample: "border-dashed border-warn/40 bg-warn/8 text-warn",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-px text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

/** Marks placeholder content that should be replaced with real data. */
function SampleBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="sample"
      size="sm"
      className={className}
      title="Placeholder content. Replace it in the content/ folder."
    >
      Sample
    </Badge>
  );
}

export { Badge, SampleBadge, badgeVariants };
