'use client';

import { useState, useEffect } from 'react';
import { login, me } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // If already logged in, send to dashboard
  useEffect(() => {
    (async () => {
      const user = await me();     // calls /user/v1/me with cookies
      if (user) router.replace('/app');  // dashboard index
    })();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace('/app');
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        {err ? <div className="text-red-500 text-sm">{err}</div> : null}
        <label className="text-sm block">
          <div className="mb-1">Email</div>
          <input className="w-full rounded-lg border border-border/60 bg-background px-3 py-2"
                 placeholder="you@firm.com" autoComplete="email"
                 value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </label>
        <label className="text-sm block">
          <div className="mb-1">Password</div>
          <input type="password" className="w-full rounded-lg border border-border/60 bg-background px-3 py-2"
                 placeholder="••••••••" autoComplete="current-password"
                 value={password} onChange={(e)=>setPassword(e.target.value)} minLength={8} required />
        </label>
        <button disabled={busy} className="w-full rounded-lg bg-primary text-black py-2 font-medium hover:opacity-90 disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
        <div className="text-xs text-muted text-center">
          No account? <a href="/register" className="underline">Create one</a>
        </div>
      </form>
    </main>
  );
}