export const metadata = {
  title: "Login — LexShastra",
  description: "Access your Lexshastra dashboard.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <form className="w-full max-w-sm rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        <label className="text-sm">
          <div className="mb-1">Email</div>
          <input className="w-full rounded-lg border border-border/60 bg-background px-3 py-2" placeholder="you@firm.com" />
        </label>
        <label className="text-sm">
          <div className="mb-1">Password</div>
          <input type="password" className="w-full rounded-lg border border-border/60 bg-background px-3 py-2" placeholder="••••••••" />
        </label>
        <button className="w-full rounded-lg bg-primary text-black py-2 font-medium hover:opacity-90">Sign In</button>
        <div className="text-xs text-muted text-center">No account? <a href="/register" className="underline">Create one</a></div>
      </form>
    </main>
  );
}
