// Dashboard skeleton: header + stat cards + a table block, so the layout doesn't jump when data arrives
export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Loading dashboard" className="animate-pulse">
      <div className="h-9 w-56 rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-muted" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass h-32 rounded-2xl" />
        ))}
      </div>
      <div className="glass mt-8 h-72 rounded-2xl" />
    </div>
  );
}