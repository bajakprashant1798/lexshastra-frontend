import "./globals.css";
import Navbar from "@/components/site/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ClientProviders from "./client-providers";

export const metadata = {
  title: "LexShastra — AI Legal Co-Pilot",
  description: "From Chaos to Clarity. Your AI-powered legal command center.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen">
          <ClientProviders>
            {/* If you want navbar only on marketing, move this into (public)/layout.jsx instead */}
            {/* <Navbar /> */}
            {children}
          </ClientProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
