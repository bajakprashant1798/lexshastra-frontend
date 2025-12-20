export default function AuthLayout({ children }) {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4">
      {children}
    </main>
  );
}