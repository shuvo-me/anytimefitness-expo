import { z } from 'zod';

export const paymentSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, {
      message: 'Enter a valid amount greater than 0',
    }),
  category: z.enum(["Monthly Fee", "Yearly Fee", "Admission Fee"]),
  method: z.enum(['Cash', 'bKash']),
});

export type PaymentForm = z.infer<typeof paymentSchema>;
