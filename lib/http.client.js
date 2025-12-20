// lib/http.client.js
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function clientFetch(path, token, options = {}) {
  const { method = 'GET', headers = {}, body } = options;

  return fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export const get   = (p, token)        => clientFetch(p, token, { method: 'GET' });
export const post  = (p, token, data)  => clientFetch(p, token, { method: 'POST', body: data });
export const patch = (p, token, data)  => clientFetch(p, token, { method: 'PATCH', body: data });
export const put   = (p, token, data)  => clientFetch(p, token, { method: 'PUT', body: data });
export const del   = (p, token)        => clientFetch(p, token, { method: 'DELETE' });