import { getCsrf, clearCsrf } from './csrf';
import { getDeviceId } from './device';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function refreshAccess() {
  const res = await fetch(`${BASE}/auth/v1/refresh`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('refresh-failed');
  return true;
}

export async function apiFetch(path, { method = 'GET', headers = {}, body } = {}, retry = true) {
  const upper = (method || 'GET').toUpperCase();
  const hdrs = {
    'Content-Type': 'application/json',
    'X-Device-ID': getDeviceId() || '',
    ...headers,
  };

  if (upper !== 'GET') {
    const csrf = getCsrf();
    if (csrf) hdrs['X-CSRF-Token'] = csrf;
  }

  const res = await fetch(`${BASE}${path}`, {
    method: upper,
    headers: hdrs,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    try {
      await refreshAccess();
      return apiFetch(path, { method, headers, body }, false);
    } catch {
      clearCsrf();
    }
  }
  return res;
}

export const get  = (p)      => apiFetch(p, { method: 'GET' });
export const post = (p, d)   => apiFetch(p, { method: 'POST', body: d });
export const del  = (p, d)   => apiFetch(p, { method: 'DELETE', body: d });
export const put  = (p, d)   => apiFetch(p, { method: 'PUT', body: d });
export const patch= (p, d)   => apiFetch(p, { method: 'PATCH', body: d });