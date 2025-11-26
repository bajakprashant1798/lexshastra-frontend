// // lib/auth.js
// // export function getCurrentUser() {
// //   return { id: "me", email: "me@example.com", name: "You" };
// // }

// // lib/auth.js
// export function getCurrentUser() {
//   try {
//     const raw = localStorage.getItem("lexshastra_auth_current_user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// // Demo password change (validates "old" against stored user.password)
// export async function changePassword(oldPw, newPw) {
//   const u = getCurrentUser();
//   if (!u) throw new Error("Not signed in.");
//   if ((u.password || "password") !== oldPw) throw new Error("Old password is incorrect.");
//   const nu = { ...u, password: newPw };
//   localStorage.setItem("lexshastra_auth_current_user", JSON.stringify(nu));
//   return true;
// }

// // Nukes ALL local demo data
// export function hardReset() {
//   localStorage.clear();
// }


import { post, get } from './http';
import { saveCsrf, clearCsrf } from './csrf';

export async function login(email, password) {
  const res = await post('/auth/v1/login', { email, password });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.data?.errors?.[0]?.message || json?.meta?.message || 'Login failed');

  const csrf = json?.data?.csrfToken;
  if (csrf) saveCsrf(csrf);
  return json?.data?.user;
}

export async function register(firstName, lastName, email, password) {
  const res = await post('/auth/v1/register', { firstName, lastName, email, password });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.data?.errors?.[0]?.message || json?.meta?.message || 'Register failed');
  return true;
}

export async function logout() {
  const res = await post('/auth/v1/logout', {});
  clearCsrf();
  return res.ok;
}

export async function me() {
  const res = await get('/user/v1/me'); // GET -> no CSRF required
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data?.user || null;
}