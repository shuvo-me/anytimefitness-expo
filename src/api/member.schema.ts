import { z } from 'zod';

export const memberSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  tier: z.enum(['Monthly', 'Yearly']),
  initialPayment: z.boolean(),
  goal: z.string().trim().optional(),
  weightKg: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || !Number.isNaN(Number(v)), {
      message: 'Must be a number',
    }),
  heightCm: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || !Number.isNaN(Number(v)), {
      message: 'Must be a number',
    }),
  attendanceGoalDays: z
    .string()
    .optional()
    .refine((v) => v === undefined || v === '' || !Number.isNaN(Number(v)), {
      message: 'Must be a number',
    }),
  emergencyName: z.string().trim().min(1, 'Contact person name is required'),
  emergencyPhone: z.string().trim().min(1, 'Contact phone is required'),
  emergencyRelation: z.string().trim().optional(),
});

export type MemberForm = z.infer<typeof memberSchema>;