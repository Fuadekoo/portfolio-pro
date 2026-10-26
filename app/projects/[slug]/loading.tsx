function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-white/6 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-28 sm:px-8 sm:pt-32" aria-busy="true" aria-label="Loading project">
      <Bar className="h-4 w-28" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="space-y-4">
          <Bar className="h-6 w-24" />
          <Bar className="h-14 w-4/5" />
        </div>
        <div className="space-y-2.5">
          <Bar className="h-4 w-full" />
          <Bar className="h-4 w-5/6" />
        </div>
      </div>
      <div className="mt-12 aspect-16/10 animate-pulse rounded-3xl border border-border bg-white/3" />
    </div>
  );
}
