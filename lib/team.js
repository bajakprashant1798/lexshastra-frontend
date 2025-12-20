// import { getCurrentUser } from "@/lib/auth"; // you said this exists now

// lib/team.js
// Demo team service (localStorage). Replace with API when backend is ready.

const TEAMS_KEY_PREFIX = "lexshastra_teams_";

function userTeamsKey() {
  const user = getCurrentUser();
  if (!user?.email) return null;
  return `${TEAMS_KEY_PREFIX}${user.email}`;
}

function saveTeam(members) {
  const key = userTeamsKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(members));
}

export function getTeamMembers() {
  const key = userTeamsKey();
  const me = getCurrentUser();
  if (!key || !me) return [];

  let team = [];
  try {
    team = JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    team = [];
  }

  // Ensure current user appears as Admin at least once
  if (!team.some((m) => m.email?.toLowerCase() === me.email?.toLowerCase())) {
    const admin = {
      id: me.id || `tm_${Math.random().toString(36).slice(2, 8)}`,
      name: me.name || "Admin",
      role: "Admin",
      email: me.email,
      status: "Active",
      phone: "",
      enrollmentNumber: "",
      barCouncil: "",
      profilePictureUrl: "",
    };
    team.push(admin);
    saveTeam(team);
  }

  return team;
}

export async function addTeamMember(data) {
  const team = getTeamMembers();
  if (team.some((m) => m.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error("A team member with this email already exists.");
  }
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `tm_${Math.random().toString(36).slice(2, 10)}`;

  const newMember = { ...data, id, status: "Active" };
  team.push(newMember);
  saveTeam(team);
  return newMember;
}

export async function updateTeamMember(updated) {
  let team = getTeamMembers();
  const idx = team.findIndex((m) => m.id === updated.id);
  if (idx === -1) throw new Error("Team member not found.");
  team[idx] = { ...team[idx], ...updated };
  saveTeam(team);
  return team[idx];
}

export function getCurrentUserTeamProfile() {
  const me = getCurrentUser();
  if (!me) return null;
  const team = getTeamMembers();
  return team.find((m) => m.email?.toLowerCase() === me.email?.toLowerCase()) || null;
}
