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

export const workoutProgramSchema = z.object({
  title: z.string().trim().min(1, 'Workout title is required'),
  exercises: z.array(workoutExerciseSchema),
});

export type WorkoutProgramForm = z.infer<typeof workoutProgramSchema>;

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
