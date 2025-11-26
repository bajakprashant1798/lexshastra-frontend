"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AuthGate from "@/components/AuthGate";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <AuthGate>
    <div className="flex min-h-screen">
      {/* Sidebar (collapsible + mobile) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Content area */}
      <div className="flex-1 min-w-0">
        {/* Top bar inside the app (mobile menu + theme) */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 border-b border-border/40 bg-background/70 backdrop-blur">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
        </div>

        {/* Page content */}
        <main className="px-4 py-6">
          {children}
        </main>
      </div>
    </div>
    </AuthGate>
  );
}
