// lib/auth.js
// export function getCurrentUser() {
//   return { id: "me", email: "me@example.com", name: "You" };
// }

// lib/auth.js
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("lexshastra_auth_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Demo password change (validates "old" against stored user.password)
export async function changePassword(oldPw, newPw) {
  const u = getCurrentUser();
  if (!u) throw new Error("Not signed in.");
  if ((u.password || "password") !== oldPw) throw new Error("Old password is incorrect.");
  const nu = { ...u, password: newPw };
  localStorage.setItem("lexshastra_auth_current_user", JSON.stringify(nu));
  return true;
}

// Nukes ALL local demo data
export function hardReset() {
  localStorage.clear();
}

