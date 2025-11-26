// lib/user.js
import { get, patch } from './http';

/**
 * GET /user/v1/me
 * Returns user object or null if not authenticated / error.
 */
export async function getProfile() {
  const res = await get('/user/v1/me');
  if (!res.ok) {
    // return null for UI to handle (e.g. redirect to login)
    return null;
  }
  const json = await res.json();
  return json?.data?.user || null;
}

/**
 * PATCH /user/v1/me
 * Tries to update allowed fields. If server doesn't support update,
 * it will throw and the UI shows a friendly message.
 *
 * payload: { firstName, lastName, phone, enrollmentNumber, barCouncil, profilePictureUrl }
 */
export async function updateProfile(payload) {
  const res = await patch('/user/v1/me', payload);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // handle unsupported method / not implemented gracefully
    if (res.status === 404 || res.status === 405 || res.status === 501) {
      const err = new Error('Profile update is not supported by the backend yet.');
      err.code = 'NOT_IMPLEMENTED';
      throw err;
    }
    // surface message if available
    const msg =
      json?.meta?.message || json?.data?.errors?.[0]?.message || 'Failed to update profile';
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return json?.data || {};
}