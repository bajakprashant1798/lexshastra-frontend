'use client';

import { useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await signOut();
      router.replace('/login');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="rounded-md border px-3 py-1 hover:bg-muted"
    >
      {busy ? 'Logging out…' : 'Logout'}
    </button>
  );
}