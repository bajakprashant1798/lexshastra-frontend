'use client';

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';

export default function AuthGate({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}