"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

// Demo auth/team stores (browser only)
import {
  getCurrentUser,
  changePassword,   // make sure this exists in lib/auth.js (stub shown below)
  hardReset,        // make sure this exists in lib/auth.js (stub shown below)
} from "@/lib/auth";
import {
  getCurrentUserTeamProfile,
  updateTeamMember,
} from "@/lib/team";

// If you already have a ThemeSwitcher component, import it:
// import ThemeSwitcher from "@/components/ThemeSwitcher";

// Minimal inline theme switcher (use this only if you don't have your own)
function ThemeSwitcherInline() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? (localStorage.getItem("ls_theme") || "system")
      : "system"
  );

  useEffect(() => {
    const root = document.documentElement;
    const apply = (t) => {
      if (t === "system") {
        root.classList.remove("dark");
        // simple heuristic: prefer dark if OS is dark
        if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        }
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };
    apply(theme);
    localStorage.setItem("ls_theme", theme);
  }, [theme]);

  const btn =
    "px-3 py-1.5 text-sm rounded-md border border-border/40 bg-[var(--bg-elev)] hover:bg-foreground/5";

  return (
    <div className="flex gap-2">
      {["light", "dark", "system"].map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`${btn} ${theme === t ? "border-primary text-primary" : "text-muted"}`}
        >
          {t[0].toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function SettingsCard({ title, description, children, className = "" }) {
  return (
    <div className={`bg-[var(--bg-elev)] p-6 rounded-xl border border-border/20 ${className}`}>
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      <p className="text-muted mt-1 mb-4 text-sm">{description}</p>
      {children}
    </div>
  );
}

function SecuritySection({ onSignOut }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [fb, setFb] = useState(null); // {type, message}

  const onSubmit = async (e) => {
    e.preventDefault();
    setFb(null);
    if (newPw !== confirm) {
      setFb({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPw.length < 6) {
      setFb({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }
    setBusy(true);
    try {
      await changePassword(oldPw, newPw);
      setFb({ type: "success", message: "Password changed successfully." });
      setOldPw(""); setNewPw(""); setConfirm("");
    } catch (err) {
      setFb({ type: "error", message: err?.message || "Failed to change password." });
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full mt-1 bg-[var(--bg-elev)] text-foreground p-2 rounded-lg border border-border/50 text-sm";

  return (
    <SettingsCard title="Security" description="Manage your password and session security.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Change Password</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="password" placeholder="Old Password" value={oldPw}
              onChange={(e) => setOldPw(e.target.value)} required className={input}
            />
            <input
              type="password" placeholder="New Password" value={newPw}
              onChange={(e) => setNewPw(e.target.value)} required className={input}
            />
            <input
              type="password" placeholder="Confirm New Password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required className={input}
            />
            <Button type="submit" disabled={busy}>
              {busy ? "Changing…" : "Change Password"}
            </Button>
            {fb && (
              <p className={`text-sm ${fb.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {fb.message}
              </p>
            )}
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Session Management</h3>
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-sm rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25"
          >
            Sign Out
          </button>
        </div>
      </div>
    </SettingsCard>
  );
}

export default function SettingsPage() {
  // Profile
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fb, setFb] = useState(null);

  const fetchProfile = useCallback(() => {
    const p = getCurrentUserTeamProfile();
    setProfile(p);
    setForm(p || {});
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const toggleEdit = () => {
    setFb(null);
    if (edit) setForm(profile || {});
    setEdit((v) => !v);
  };

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((s) => ({ ...s, profilePictureUrl: ev.target?.result }));
    reader.readAsDataURL(file);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setFb(null);
    try {
      await updateTeamMember({ ...profile, ...form });
      setFb({ type: "success", message: "Profile updated successfully." });
      setEdit(false);
      fetchProfile();
    } catch (err) {
      setFb({ type: "error", message: err?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  // Sign out (demo)
  const handleLogout = () => {
    // If you have a real auth flow, call its logout then redirect:
    // e.g. await signOut(); router.push("/login");
    localStorage.removeItem("lexshastra_auth_current_user");
    window.location.href = "/login";
  };

  const handleResetWorkspace = () => {
    if (
      window.confirm(
        "Reset workspace? This replaces your demo data with initial samples. You will remain logged in."
      )
    ) {
      const user = getCurrentUser();
      if (user?.email) {
        const keys = [
          `lexshastra_cases_${user.email}`,
          `lexshastra_contacts_${user.email}`,
          `lexshastra_teams_${user.email}`,
          `lexshastra_calendar_${user.email}`,
          `lexshastra_notices_${user.email}`,
          `lexshastra_invoices_${user.email}`,
          `lexshastra_expenses_${user.email}`,
        ];
        keys.forEach((k) => localStorage.removeItem(k));
        alert("Workspace reset. Reloading…");
        window.location.reload();
      }
    }
  };

  const handleHardReset = () => {
    if (
      window.confirm(
        "DANGER: This clears ALL local data (all users, cases, settings) and logs you out. Continue?"
      )
    ) {
      hardReset(); // clears everything incl. auth
      alert("All local data cleared. Reloading…");
      window.location.reload();
    }
  };

  const input = "w-full mt-1 bg-[var(--bg-elev)] text-foreground p-2 rounded-lg border border-border/50 text-sm";
  const label = "text-xs font-semibold text-muted uppercase";

  const avatar =
    form?.profilePictureUrl ||
    (profile?.name
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=F4B400&color=000&bold=true`
      : "");

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

      <div className="space-y-8 max-w-4xl">
        {/* Profile & Account */}
        <SettingsCard
          title="Profile & Account"
          description="Manage your personal and professional information."
        >
          {!profile ? (
            <p className="text-muted text-center py-8">Loading profile…</p>
          ) : (
            <form onSubmit={onSave}>
              <div className="flex justify-end mb-6 -mt-4">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {edit ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 text-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/40 mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-foreground/10 border-4 border-primary/40 mx-auto" />
                  )}
                  {edit && (
                    <div className="mt-4">
                      <label
                        htmlFor="profile-picture-upload"
                        className="cursor-pointer text-sm text-primary hover:underline"
                      >
                        Change Picture
                      </label>
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={onPickPhoto}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <label className={label}>Name</label>
                    {edit ? (
                      <input name="name" value={form.name || ""} onChange={onChange} className={input} />
                    ) : (
                      <p className="mt-1 text-lg">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className={label}>Role</label>
                    <p className="mt-1 text-lg">{profile.role || "—"}</p>
                  </div>

                  <div>
                    <label className={label}>Email</label>
                    <p className="mt-1 text-muted">{profile.email}</p>
                  </div>

                  <div>
                    <label className={label}>Phone</label>
                    {edit ? (
                      <input name="phone" value={form.phone || ""} onChange={onChange} className={input} />
                    ) : (
                      <p className="mt-1 text-muted">{profile.phone || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <label className={label}>Enrollment Number</label>
                    {edit ? (
                      <input
                        name="enrollmentNumber"
                        value={form.enrollmentNumber || ""}
                        onChange={onChange}
                        className={input}
                      />
                    ) : (
                      <p className="mt-1 text-muted">{profile.enrollmentNumber || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <label className={label}>Bar Council</label>
                    {edit ? (
                      <input
                        name="barCouncil"
                        value={form.barCouncil || ""}
                        onChange={onChange}
                        className={input}
                      />
                    ) : (
                      <p className="mt-1 text-muted">{profile.barCouncil || "N/A"}</p>
                    )}
                  </div>
                </div>
              </div>

              {edit && (
                <div className="mt-6 pt-6 border-t border-border/20 flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              )}

              {fb && (
                <p className={`mt-4 text-center text-sm ${fb.type === "success" ? "text-green-400" : "text-red-400"}`}>
                  {fb.message}
                </p>
              )}
            </form>
          )}
        </SettingsCard>

        {/* Security */}
        <SecuritySection onSignOut={handleLogout} />

        {/* Appearance */}
        <SettingsCard title="Appearance" description="Customize the look and feel of the application.">
          <div className="flex items-center justify-between">
            <p>Theme</p>
            {/* Use your app's ThemeSwitcher if you have one; otherwise fallback */}
            {/* <ThemeSwitcher /> */}
            <ThemeSwitcherInline />
          </div>
        </SettingsCard>

        {/* Data Management */}
        <SettingsCard title="Data Management" description="Manage your local demo workspace data.">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-foreground/[0.03]">
              <div>
                <p className="font-semibold">Reset Workspace</p>
                <p className="text-xs text-muted">Clears your demo data and restores sample workspace.</p>
              </div>
              <button
                onClick={handleResetWorkspace}
                className="px-3 py-1.5 text-sm font-semibold rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/30 bg-red-500/10">
              <div>
                <p className="font-semibold text-red-300">Clear All Local Data (Hard Reset)</p>
                <p className="text-xs text-red-400/80">Deletes ALL users, cases, and settings from this browser.</p>
              </div>
              <button
                onClick={handleHardReset}
                className="px-3 py-1.5 text-sm font-semibold rounded-md bg-red-500/80 text-white hover:bg-red-500"
              >
                Hard Reset
              </button>
            </div>
          </div>
        </SettingsCard>

        {/* About */}
        <SettingsCard title="About & Support" description="Information about the application.">
          <p>Lexshastra v1.0.0</p>
          <p className="text-sm text-muted">Demo build</p>
        </SettingsCard>
      </div>
    </div>
  );
}
