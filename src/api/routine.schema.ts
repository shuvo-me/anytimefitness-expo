import { WEEKDAYS } from '@/types/routine';
import { z } from 'zod';

const numericString = (message: string, min = 0) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => !Number.isNaN(Number(value)), {
      message: 'Must be a number',
    })
    .refine((value) => Number(value) >= min, {
      message: `Must be at least ${min}`,
    });

export const workoutExerciseSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, 'Exercise name is required'),
  sets: numericString('Sets are required', 1).refine(
    (value) => Number.isInteger(Number(value)),
    { message: 'Sets must be a whole number' },
  ),
  reps: z.string().trim().min(1, 'Reps are required'),
  weightKg: z
    .string()
    .trim()
    .refine((value) => value === '' || !Number.isNaN(Number(value)), {
      message: 'Must be a number',
    })
    .refine((value) => value === '' || Number(value) >= 0, {
      message: 'Weight cannot be negative',
    }),
});

const weekdaySchema = z.union([z.enum(WEEKDAYS), z.literal('')]);

export const workoutDaySchema = z.object({
  id: z.string(),
  weekday: weekdaySchema,
  title: z.string().trim().min(1, 'Workout title is required'),
  focus: z.string().trim().min(1, 'Body part is required'),
  exercises: z.array(workoutExerciseSchema),
});

export const workoutWeekSchema = z.object({
  days: z.array(workoutDaySchema).superRefine((days, ctx) => {
    const seen = new Set<string>();

    days.forEach((day, index) => {
      if (!day.weekday) {
        ctx.addIssue({
          code: 'custom',
          message: 'Select a weekday',
          path: [index, 'weekday'],
        });
        return;
      }

      if (seen.has(day.weekday)) {
        ctx.addIssue({
          code: 'custom',
          message: `${day.weekday} is already scheduled`,
          path: [index, 'weekday'],
        });
      }
      seen.add(day.weekday);
    });
  }),
});

export type WorkoutWeekForm = z.infer<typeof workoutWeekSchema>;

export const mealItemSchema = z.object({
  id: z.string(),
  time: z.string().trim().min(1, 'Meal time is required'),
  title: z.string().trim().min(1, 'Meal title is required'),
  description: z.string().trim(),
});

export const dietPlanSchema = z.object({
  title: z.string().trim().min(1, 'Diet plan title is required'),
  waterGoalLiters: numericString('Water goal is required', 0.1).refine(
    (value) => Number(value) <= 20,
    { message: 'Water goal looks too high' },
  ),
  meals: z.array(mealItemSchema),
});

export type DietPlanForm = z.infer<typeof dietPlanSchema>;
