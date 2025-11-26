// app/login/page.jsx  (server)
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login — LexShastra',
  description: 'Access your LexShastra dashboard.',
};

export default function Page() {
  return <LoginForm />;
}