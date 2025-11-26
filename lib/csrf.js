const KEY = 'lex_csrf_token';

export function saveCsrf(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, token);
}

export function getCsrf() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY);
}

export function clearCsrf() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}