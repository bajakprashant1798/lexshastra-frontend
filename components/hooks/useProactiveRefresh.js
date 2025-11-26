'use client';

import { useEffect, useRef } from 'react';
import { refreshAccess } from '@/lib/http'; // we'll export this helper

export default function useProactiveRefresh() {
  const last = useRef(0);
  const MIN_GAP_MS = 5 * 60 * 1000; // 5 minutes
  const INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes

  async function maybeRefresh() {
    const now = Date.now();
    if (now - last.current < MIN_GAP_MS) return; // avoid too frequent calls
    try {
      await refreshAccess();
      last.current = now;
    } catch {
      // ignore silently, reactive 401 flow will handle
    }
  }

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') maybeRefresh();
    };
    document.addEventListener('visibilitychange', onVis);
    const id = setInterval(maybeRefresh, INTERVAL_MS);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      clearInterval(id);
    };
  }, []);
}