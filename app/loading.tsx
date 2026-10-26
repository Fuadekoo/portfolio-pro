export default function Loading() {
  return (
    <div className="grid min-h-svh place-items-center" aria-busy="true" aria-label="Loading">
      <div className="relative size-10">
        <span className="absolute inset-0 rounded-full border border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-brand" />
      </div>
    </div>
  );
}
