import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full name is required'),
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterForm = z.infer<typeof registerSchema>;
