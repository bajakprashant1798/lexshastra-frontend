// app/register/[[...sign-up]]/page.jsx
import { SignUp } from '@clerk/nextjs';

export const metadata = {
  title: 'Register — LexShastra',
  description: 'Create your LexShastra account',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <SignUp
        appearance={{
          elements: {
            card: 'rounded-2xl shadow-lg border border-border',
          },
        }}
        routing="path"
        path="/register"
        signInUrl="/login"
        redirectUrl="/app"
        afterSignUpUrl="/app"
      />
    </main>
  );
}