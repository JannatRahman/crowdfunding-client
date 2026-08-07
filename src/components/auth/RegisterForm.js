'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/utils/validations';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { FormInput } from '@/components/shared/FormField';
import { ROUTES } from '@/utils/constants';
import Link from 'next/link';
import ImageUploader from '@/components/shared/ImageUploader';
import { toast } from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'supporter' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image,
        role: data.role,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const token = response.data?.session?.token || response.data?.token;
      if (token) {
        localStorage.setItem('access-token', token);
      }
      
      toast.success('Welcome! Your account has been created successfully.');
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
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
      toast.error(err.message || 'Google registration failed.');
    }
  };


  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Full Name"
              placeholder="John Doe"
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
              classNames={{
                label: "text-gray-700 font-bold text-xs uppercase tracking-wider",
                inputWrapper: "border border-gray-200/80 hover:border-cf-dark focus-within:!border-cf-dark rounded-xl bg-white shadow-sm transition-all duration-200",
              }}
            />
          )}
        />

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
              classNames={{
                label: "text-gray-700 font-bold text-xs uppercase tracking-wider",
                inputWrapper: "border border-gray-200/80 hover:border-cf-dark focus-within:!border-cf-dark rounded-xl bg-white shadow-sm transition-all duration-200",
              }}
            />
          )}
        />

        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={field.value || ''}
              onChange={field.onChange}
              label="Profile Picture (Optional)"
              hint="Upload a photo or paste direct link — PNG, JPG, WebP, max 5 MB"
              isRound
              previewSize="md"
              error={errors.image?.message}
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
              classNames={{
                label: "text-gray-700 font-bold text-xs uppercase tracking-wider",
                inputWrapper: "border border-gray-200/80 hover:border-cf-dark focus-within:!border-cf-dark rounded-xl bg-white shadow-sm transition-all duration-200",
              }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              errorMessage={errors.confirmPassword?.message}
              isInvalid={!!errors.confirmPassword}
              classNames={{
                label: "text-gray-700 font-bold text-xs uppercase tracking-wider",
                inputWrapper: "border border-gray-200/80 hover:border-cf-dark focus-within:!border-cf-dark rounded-xl bg-white shadow-sm transition-all duration-200",
              }}
            />
          )}
        />

        <div className="space-y-2">
          <label className="text-gray-700 font-bold text-xs uppercase tracking-wider block">Join as a:</label>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <>
                  {/* Supporter Option */}
                  <div
                    onClick={() => field.onChange('supporter')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between h-28 relative ${
                      field.value === 'supporter'
                        ? 'border-cf-dark bg-cf-cream/10 shadow-md scale-[1.02]'
                        : 'border-gray-200/80 hover:border-gray-300 bg-white hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm text-gray-800">Supporter</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                        Back campaigns, earn rewards, and make an impact.
                      </p>
                    </div>
                    {field.value === 'supporter' && (
                      <span className="absolute bottom-2.5 right-2.5 flex items-center justify-center w-5 h-5 text-[10px] bg-cf-dark text-white rounded-full font-bold">✓</span>
                    )}
                  </div>

                  {/* Creator Option */}
                  <div
                    onClick={() => field.onChange('creator')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between h-28 relative ${
                      field.value === 'creator'
                        ? 'border-cf-dark bg-cf-cream/10 shadow-md scale-[1.02]'
                        : 'border-gray-200/80 hover:border-gray-300 bg-white hover:shadow-sm'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-sm text-gray-800">Creator</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                        Launch campaigns, raise funds, and build a community.
                      </p>
                    </div>
                    {field.value === 'creator' && (
                      <span className="absolute bottom-2.5 right-2.5 flex items-center justify-center w-5 h-5 text-[10px] bg-cf-dark text-white rounded-full font-bold">✓</span>
                    )}
                  </div>
                </>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-cf-dark hover:bg-black text-cf-cream font-bold py-6 text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer select-none active:scale-[0.99]" 
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/60" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500 font-bold uppercase tracking-widest text-[10px]">Or register with</span>
        </div>
      </div>

      <Button 
        variant="bordered" 
        className="w-full border border-gray-300 text-gray-700 font-bold py-6 hover:border-cf-dark hover:bg-cf-cream/10 rounded-xl transition-all duration-300 cursor-pointer shadow-sm active:scale-[0.99]" 
        onPress={handleGoogleLogin}
      >
        <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google
      </Button>

      <p className="text-center text-xs text-gray-500 font-semibold">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="text-cf-dark hover:text-black hover:underline font-extrabold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
