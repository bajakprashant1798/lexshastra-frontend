import dynamic from "next/dynamic";

// Defer heavy map to client only (no SSR), safe placeholder until wired.
// const IndiaMapWidget = dynamic(() => import("@/components/IndiaMapWidget"), {
//   ssr: false,
//   loading: () => (
//     <div className="rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6">
//       <div className="h-[260px] w-full grid place-items-center text-muted text-sm">
//         Loading map…
//       </div>
//     </div>
//   ),
// });

function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
}

// TODO: Replace with real API calls once backend is ready.
async function fetchDashboardSnapshot() {
  // example shape you can mirror on the backend
  return {
    upcoming: [],
    teamWorkload: [{ name: "bajak prashant", count: 2 }],
    topClients: [{ name: "Innovate Corp", count: 1 }, { name: "Arjun Singh", count: 1 }],
    topOpponents: [{ name: "Adv. Mehra", count: 1 }, { name: "Public Prosecutor", count: 1 }],
  };
}

export default async function DashboardPage() {
  // server component — you can later fetch with cookies/headers if needed
  const data = await fetchDashboardSnapshot();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
      <p className="text-muted mb-6">Welcome to your Lexshastra dashboard. Here is a quick overview of your activities.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming (lg spans 2) */}
        <Card title="Upcoming Hearings & Tasks" className="lg:col-span-2">
          {data.upcoming?.length ? (
            <div className="space-y-2">
              {data.upcoming.map((u, i) => (
                <div key={i} className="rounded-md border border-border/40 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{u.title}</div>
                    <div className="text-muted">{u.date}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted">No upcoming hearings or pending tasks.</div>
          )}
        </Card>

        {/* Map */}
        {/* <Card title="Geographic Case Distribution">
          <p className="text-sm text-muted mb-3">
            State-wise distribution of all matters. Click a state to filter.
          </p>
          <IndiaMapWidget />
        </Card> */}

        {/* Analytics */}
        <Card title="Team Workload (Active Cases)">
          <div className="space-y-2">
            {data.teamWorkload?.length ? (
              data.teamWorkload.map((t) => (
                <div key={t.name} className="flex items-center justify-between text-sm rounded-md border border-border/40 px-3 py-2">
                  <span>{t.name}</span>
                  <span className="font-semibold bg-primary/10 text-foreground px-2 py-0.5 rounded">{t.count}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">Not enough data to display.</div>
            )}
          </div>
        </Card>

        <Card title="Top Clients by Case Volume">
          <div className="space-y-2">
            {data.topClients?.length ? (
              data.topClients.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm rounded-md border border-border/40 px-3 py-2">
                  <span>{c.name}</span>
                  <span className="font-semibold bg-primary/10 text-foreground px-2 py-0.5 rounded">{c.count}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">Not enough data to display.</div>
            )}
          </div>
        </Card>

        <Card title="Most Frequent Opposing Counsel">
          <div className="space-y-2">
            {data.topOpponents?.length ? (
              data.topOpponents.map((o) => (
                <div key={o.name} className="flex items-center justify-between text-sm rounded-md border border-border/40 px-3 py-2">
                  <span>{o.name}</span>
                  <span className="font-semibold bg-primary/10 text-foreground px-2 py-0.5 rounded">{o.count}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">Not enough data to display.</div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
