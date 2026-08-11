import LoginForm from '@/components/auth/LoginForm';
import AuthShell from '@/components/auth/AuthShell';
import { ROUTES } from '@/utils/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to CrowdFund to back campaigns, track your pledges, and manage your wallet.',
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue supporting the projects you love."
      footer={
        <>
          <p className="text-xs text-gray-500 font-semibold">
            Protected by secure, encrypted authentication.
          </p>
          <p className="text-sm text-gray-500 font-semibold mt-2">
            New to the community?{' '}
            <Link href={ROUTES.REGISTER} className="text-cf-dark hover:text-black hover:underline font-extrabold transition-colors">
              Create an account
            </Link>
          </p>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
