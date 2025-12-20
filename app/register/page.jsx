// app/register/page.jsx  (server component)
import RegisterForm from './RegisterForm';

export const metadata = {
  title: 'Register — LexShastra',
  description: 'Create your LexShastra account.',
};

export default function Page() {
  return (
      <div className="w-full">
        <RegisterForm />
      </div>
    );
}