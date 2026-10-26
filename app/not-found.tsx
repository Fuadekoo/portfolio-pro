import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientBackground } from "@/components/sections/hero/ambient-background";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 text-center">
      <AmbientBackground variant="contact" />
      <div className="relative">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="text-silver mt-4 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Page not found</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
      </div>
    </section>
  );
}
