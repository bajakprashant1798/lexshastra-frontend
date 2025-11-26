'use client';

import { useState, useEffect } from 'react';
import { register as doRegister, me } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  // If already logged in, send to dashboard
  useEffect(() => {
    (async () => {
      const user = await me();
      if (user) router.replace('/app'); // dashboard entry
    })();
  }, [router]);

  function set(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setOk(false); setBusy(true);
    try {
      await doRegister(form.firstName.trim(), form.lastName.trim(), form.email.trim(), form.password);
      setOk(true);
      // keep your current flow → go to login after successful registration
      setTimeout(() => router.replace('/login'), 800);
      // If you want to auto-login instead, call login() here and router.replace('/app')
    } catch (error) {
      setErr(error.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 space-y-4">
        <h1 className="text-xl font-semibold">Create account</h1>
        {err ? <div className="text-red-500 text-sm">{err}</div> : null}
        {ok  ? <div className="text-green-600 text-sm">Registered! Redirecting…</div> : null}

        <label className="text-sm block">
          <div className="mb-1">First name</div>
          <input className="w-full rounded-lg border border-border/60 bg-background px-3 py-2"
                 value={form.firstName} onChange={(e)=>set('firstName', e.target.value)} required />
        </label>

        <label className="text-sm block">
          <div className="mb-1">Last name</div>
          <input className="w-full rounded-lg border border-border/60 bg-background px-3 py-2"
                 value={form.lastName} onChange={(e)=>set('lastName', e.target.value)} required />
        </label>

        <label className="text-sm block">
          <div className="mb-1">Email</div>
          <input className="w-full rounded-lg border border-border/60 bg-background px-3 py-2" type="email"
                 value={form.email} onChange={(e)=>set('email', e.target.value)} required />
        </label>

        <label className="text-sm block">
          <div className="mb-1">Password</div>
          <input className="w-full rounded-lg border border-border/60 bg-background px-3 py-2" type="password" minLength={8}
                 value={form.password} onChange={(e)=>set('password', e.target.value)} required />
        </label>

        <button disabled={busy} className="w-full rounded-lg bg-primary text-black py-2 font-medium hover:opacity-90 disabled:opacity-60">
          {busy ? 'Creating…' : 'Create account'}
        </button>

        <div className="text-xs text-muted text-center">
          Have an account? <a href="/login" className="underline">Sign in</a>
        </div>
      </form>
    </main>
  );
}