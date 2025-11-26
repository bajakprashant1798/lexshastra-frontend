'use client';

import { useEffect, useState } from 'react';
import { me } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import useProactiveRefresh from '@/components/hooks/useProactiveRefresh';

export default function AuthGate({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  // start the background refresh timer
  useProactiveRefresh();
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await me();
      if (!mounted) return;
      if (!user) router.replace('/login');
      else setOk(true);
    })();
    return () => { mounted = false; };
  }, [router]);

  if (!ok) return <div className="p-8 text-muted">Loading…</div>;
  return children;
}