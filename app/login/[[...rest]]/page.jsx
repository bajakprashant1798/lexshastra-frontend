import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'Login — LexShastra',
  description: 'Access your LexShastra dashboard.',
};

export default function Page() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <SignIn
        redirectUrl="/app"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-black',
          },
        }}
      />
    </div>
  );
}