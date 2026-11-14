export default function Loading() {
  return (
    <div className="wrap py-24" role="status" aria-live="polite">
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-md bg-surface-2" />
      <div className="mt-5 h-5 w-1/2 max-w-sm animate-pulse rounded-md bg-surface-2" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
