"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-svh place-items-center px-5 text-center">
      <div>
        <p className="font-mono text-sm text-destructive">Error</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Something went wrong</h1>
        <p className="mx-auto mt-5 max-w-md text-muted-foreground">
          An unexpected error occurred while rendering this page. Please try again.
        </p>
        <Button size="lg" className="mt-10" onClick={() => retry()}>
          <RotateCcw />
          Try again
        </Button>
      </div>
    </section>
  );
}
