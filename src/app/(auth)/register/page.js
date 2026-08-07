'use client';

import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cf-dark tracking-tight">Create Account</h1>
          <p className="text-cf-brown font-medium mt-2">Join our crowdfunding community</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-cf-tan p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
