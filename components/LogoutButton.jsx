'use client';

import { useState } from 'react';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await logout();
      router.replace('/login');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={onClick} disabled={busy} className="rounded-md border px-3 py-1 hover:bg-muted">
      {busy ? 'Logging out…' : 'Logout'}
    </button>
  );
}