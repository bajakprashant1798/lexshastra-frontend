// lib/http.server.js
import { auth } from '@clerk/nextjs/server';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function serverFetch(path, options = {}) {
  const { getToken } = auth();
  const token = await getToken();

  const { method = 'GET', headers = {}, body } = options;

  return fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
}