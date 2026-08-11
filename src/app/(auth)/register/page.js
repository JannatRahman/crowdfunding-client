import RegisterForm from '@/components/auth/RegisterForm';
import AuthShell from '@/components/auth/AuthShell';
import { ROUTES } from '@/utils/constants';
import Link from 'next/link';

export const metadata = {
  title: 'Create Account',
  description: 'Join CrowdFund as a creator or supporter, launch your first campaign, and start making an impact.',
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join CrowdFund as a creator or supporter in under a minute."
      footer={
        <>
          <p className="text-sm text-gray-500 font-semibold">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-cf-dark hover:text-black hover:underline font-extrabold transition-colors">
              Sign in
            </Link>
          </p>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
