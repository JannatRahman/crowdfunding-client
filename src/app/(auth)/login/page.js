'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cf-dark tracking-tight">Welcome Back</h1>
          <p className="text-cf-brown font-medium mt-2">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-cf-tan p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
