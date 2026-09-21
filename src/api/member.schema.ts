import { z } from 'zod';

export const memberSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  admissionFee: z.number({ error: 'Admission fee is required' }).nonnegative('Admission fee cannot be negative'),
  startDate: z.date({
    error: "Onboarding date is required",
  }).refine(
    (date) => !Number.isNaN(date.getTime()),
    "Please enter a valid onboarding date"
  )
    .refine(
      (date) => date <= new Date(),
      "Onboarding date cannot be in the future"
    ),
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