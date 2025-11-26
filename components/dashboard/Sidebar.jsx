"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  FolderOpen,
  PlusSquare,
  Calendar,
  ListTodo,
  Users,
  Wallet,
  Bell,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// add this import
import { logout } from '@/lib/auth';

/**
 * Collapsible, responsive sidebar.
 * - Desktop: fixed on left, collapse to icons (w-64 → w-20)
 * - Mobile: slides in from left (drawer)
 * - State persisted in localStorage: 'ls-sidebar'
 */
export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter(); 
  const [collapsed, setCollapsed] = useState(false);
  // add state for logging out
  const [loggingOut, setLoggingOut] = useState(false);

  // load/save collapsed preference
  useEffect(() => {
    const saved = localStorage.getItem("ls-sidebar");
    if (saved) setCollapsed(saved === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("ls-sidebar", collapsed ? "1" : "0");
  }, [collapsed]);

  const items = useMemo(
    () => [
      { href: "/app", label: "Dashboard", Icon: LayoutDashboard },
      { href: "/cases", label: "My Cases", Icon: FolderOpen },
      // { href: "/app/cases/new", label: "Add a Case", Icon: PlusSquare },
      { href: "/calendar", label: "Calendar", Icon: Calendar },
      { href: "/tasks", label: "Tasks", Icon: ListTodo },
      { href: "/contacts", label: "Contacts", Icon: Users },
      { href: "/finance", label: "Finance", Icon: Wallet },
      { href: "/notices", label: "Notices", Icon: Bell },
      { href: "/cause-list", label: "Cause Lists", Icon: BookOpen },
      { href: "/team", label: "Team", Icon: Users },
    ],
    []
  );

  const bottom = useMemo(
    () => [
      { href: "/profile", label: "My Profile", Icon: User },
      { href: "/settings", label: "Settings", Icon: Settings },
      { label: "Logout", Icon: LogOut, isLogout: true },
    ],
    []
  );

  const handleLogout = async () => {
    const ok = window.confirm('Do you want to log out?');
    if (!ok) return;

    setLoggingOut(true);
    try {
      await logout(); // calls POST /auth/v1/logout, clears CSRF local storage
      // optional: clear any client caches (react-query etc.)
      router.replace('/login'); // or '/' to go marketing home
    } catch (err) {
      console.error('Logout failed', err);
      window.alert('Logout failed. Please try again.');
    } finally {
      setLoggingOut(false);
      setMobileOpen(false);
    }
  };



  return (
    <>
      {/* backdrop for mobile drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        className={clsx(
          "fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden
      />

      <aside
        className={clsx(
          "fixed left-0 top-0 z-50 h-screen border-r border-border/40 bg-[var(--bg-elev)] transition-all",
          "md:translate-x-0", // desktop always mounted
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-20" : "w-64"
        )}
        aria-label="Sidebar"
      >
        {/* Brand + collapse control */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-border/40">
          <Link href="/app" className="flex items-center gap-2 px-1">
            <span className="inline-block size-6 rounded-full bg-primary" />
            {!collapsed && <span className="font-semibold">Lexshastra</span>}
          </Link>

          {/* Collapse button (desktop only) */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:inline-flex items-center justify-center h-8 w-8 rounded-md border border-border/40 hover:bg-background"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="py-3 px-2 overflow-y-auto h-[calc(100vh-56px)] flex flex-col">
          <ul className="space-y-1">
            {items.map(({ href, label, Icon }) => {
              const active = pathname === href || (href !== "/app" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={clsx(
                      "group flex items-center gap-3 rounded-lg px-2 py-2 text-sm",
                      "hover:bg-foreground/10 transition-colors",
                      active
                        ? "bg-foreground/10 text-foreground"
                        : "text-foreground/80"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-2">
            <ul className="space-y-1">
              {bottom.map(({ href, label, Icon, isLogout }) => {
                if (isLogout) {
                  // ✅ red destructive button for Logout
                  return (
                    <li key="logout">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={clsx(
                          "group w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm",
                          "text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        )}
                        title="Log out"
                        aria-label="Log out"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-red-400 group-hover:text-red-300" />
                        {!collapsed && <span className="truncate">Logout</span>}
                      </button>
                    </li>
                  );
                }

                const active = href && pathname === href;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className={clsx(
                        "group flex items-center gap-3 rounded-lg px-2 py-2 text-sm",
                        "hover:bg-foreground/10 transition-colors",
                        active ? "bg-foreground/10 text-foreground" : "text-foreground/80"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>

      <div
        className={clsx(
          "hidden md:block transition-[width] duration-200",
          collapsed ? "w-20" : "w-64"
        )}
        aria-hidden
      />
    </>
  );
}
