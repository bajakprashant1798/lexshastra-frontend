'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [step, setStep] = useState('form'); // form | verify
  const [code, setCode] = useState('');

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'individual',
  });

  function set(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  // STEP 1: create signup + send verification email
  async function onSubmit(e) {
    e.preventDefault();
    if (!isLoaded) return;

    setBusy(true);
    setErr('');

    try {
      const result = await signUp.create({
        username: form.username,
        emailAddress: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        publicMetadata: {
          userType: form.userType,
        },
      });

      console.log('SIGNUP RESULT:', result);

      // Ask Clerk to send OTP email
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setStep('verify');
    } catch (e) {
      console.error(e);
      setErr(e?.errors?.[0]?.message || 'Signup failed');
    } finally {
      setBusy(false);
    }
  }

  // STEP 2: verify OTP + complete signup
  async function onVerify(e) {
    e.preventDefault();
    if (!isLoaded) return;

    setBusy(true);
    setErr('');

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status !== 'complete') {
        setErr('Verification failed. Please try again.');
        setBusy(false);
        return;
      }

      // Create organization if Team selected
      if (form.userType === 'team') {
        await signUp.createOrganization({
          name: `${form.firstName}'s Organisation`,
        });
      }

      await setActive({ session: result.createdSessionId });
      router.replace('/app');
    } catch (e) {
      console.error(e);
      setErr(e?.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={step === 'form' ? onSubmit : onVerify}
        className="w-full max-w-sm rounded-2xl border border-border/50 bg-[var(--bg-elev)] p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">
          {step === 'form' ? 'Create account' : 'Verify your email'}
        </h1>

        {err && <div className="text-red-500 text-sm">{err}</div>}

        {step === 'form' && (
          <>
            <input
              placeholder="Username"
              className="w-full rounded-lg border px-3 py-2"
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              required
            />

            <input
              placeholder="First name"
              className="w-full rounded-lg border px-3 py-2"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              required
            />

            <input
              placeholder="Last name"
              className="w-full rounded-lg border px-3 py-2"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border px-3 py-2"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border px-3 py-2"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              required
            />

            <div className="flex gap-4 text-sm">
              <label>
                <input
                  type="radio"
                  checked={form.userType === 'individual'}
                  onChange={() => set('userType', 'individual')}
                />{' '}
                Individual
              </label>
              <label>
                <input
                  type="radio"
                  checked={form.userType === 'team'}
                  onChange={() => set('userType', 'team')}
                />{' '}
                Team / Organisation
              </label>
            </div>

            <div id="clerk-captcha" />
          </>
        )}

        {step === 'verify' && (
          <>
            <p className="text-sm text-muted">
              We’ve sent a 6-digit verification code to <b>{form.email}</b>
            </p>

            <input
              placeholder="Verification code"
              className="w-full rounded-lg border px-3 py-2 text-center tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </>
        )}

        <button
          disabled={busy}
          className="w-full rounded-lg bg-primary py-2 font-medium"
        >
          {busy
            ? 'Please wait…'
            : step === 'form'
            ? 'Create account'
            : 'Verify & Continue'}
        </button>
      </form>
    </main>
  );
}