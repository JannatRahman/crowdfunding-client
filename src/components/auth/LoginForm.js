'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validations';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { FormInput } from '@/components/shared/FormField';
import { ROUTES } from '@/utils/constants';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      if (response.data?.session?.token) {
        localStorage.setItem('access-token', response.data.session.token);
      } else if (response.data?.token) {
        localStorage.setItem('access-token', response.data.token);
      }
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ 
        provider: 'google',
        callbackURL: ROUTES.DASHBOARD
      });
    } catch (err) {
      setError(err.message || 'Google login failed.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm font-medium shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              type="password"
              label="Password"
              placeholder="••••••••"
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
            />
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-semibold py-6 text-md shadow-md hover:shadow-lg transition-all" 
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cf-tan" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-cf-brown font-medium">Or continue with</span>
        </div>
      </div>

      <Button 
        variant="bordered" 
        className="w-full border-2 border-cf-tan text-cf-dark font-medium py-6 hover:border-cf-brown hover:bg-cf-cream/30 transition-all" 
        onPress={handleGoogleLogin}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </Button>

      <p className="text-center text-sm text-cf-brown font-medium">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.REGISTER} className="text-cf-dark hover:text-[#3A2A2A] hover:underline font-bold transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
