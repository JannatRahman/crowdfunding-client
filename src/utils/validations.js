import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['supporter', 'creator']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const campaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(150, 'Short description must be under 150 characters').optional(),
  category: z.string().min(1, 'Category is required'),
  goalAmount: z.number().min(1, 'Goal must be at least $1'),
  endDate: z.string().min(1, 'End date is required'),
  images: z.array(z.string()).optional(),
  video: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const contributionSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least $1'),
  message: z.string().optional(),
  anonymous: z.boolean().optional(),
});

export const withdrawalSchema = z.object({
  campaignId: z.string().min(1, 'Campaign is required'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  bankDetails: z.object({
    accountHolder: z.string().min(1, 'Account holder is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    bankName: z.string().min(1, 'Bank name is required'),
  }),
});

export const reportSchema = z.object({
  targetType: z.enum(['campaign', 'user']),
  targetId: z.string().min(1),
  reason: z.string().min(1, 'Reason is required'),
  description: z.string().optional(),
});
