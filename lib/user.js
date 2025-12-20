// lib/user.js
import { get, patch } from './http.client';

/**
 * GET /user/v1/me
 * Backend verifies Clerk JWT
 */
export async function getProfile(token) {
  const res = await get('/user/v1/me', token);

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Failed to load profile');
  }

  const json = await res.json();
  return json?.data?.user || null;
}

/**
 * PATCH /user/v1/me
 */
export async function updateProfile(token, payload) {
  const res = await patch('/user/v1/me', token, payload);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      json?.meta?.message ||
      json?.data?.errors?.[0]?.message ||
      'Failed to update profile';
    throw new Error(msg);
  }

  return json?.data || {};
}