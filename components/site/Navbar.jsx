"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const lastY = useRef(0);
  const raf = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY || 0);
        const goingDown = y > lastY.current;
        const delta = Math.abs(y - lastY.current);

        // mark if we’re near the very top (no hide)
        setAtTop(y < 8);

        // only react after a small movement to avoid jitter
        if (delta > 6) {
          // hide when scrolling down past a threshold
          if (goingDown && y > 80) setHidden(true);
          // show when scrolling up
          if (!goingDown) setHidden(false);
          lastY.current = y;
        }
        raf.current = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Fixed header that slides out/in */}
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-40 transition-transform duration-300 will-change-transform",
          hidden ? "-translate-y-full" : "translate-y-0",
          "backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
          atTop ? "border-transparent" : "border-border/40"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block size-6 rounded-full bg-primary" />
            <span className="font-semibold">LexShastra</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="hover:opacity-80">Features</Link>
            <Link href="#pricing"  className="hover:opacity-80">Pricing</Link>
            <Link href="#security" className="hover:opacity-80">Security</Link>
            <Link href="#contact"  className="hover:opacity-80">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login"><Button variant="outline">Login</Button></Link>
            <Link href="/app"><Button>Start Free Trial</Button></Link>
          </div>
        </div>
      </header>

      {/* Spacer to prevent layout jump under fixed header */}
      <div aria-hidden className="h-14" />
    </>
  );
}
