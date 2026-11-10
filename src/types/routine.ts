export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weightKg: number | null;
}

export interface WorkoutDay {
  id: string;
  memberId: string;
  weekday: Weekday | "";
  title: string;
  focus: string;
  exercises: WorkoutExercise[];
  assignedDate: string;
}

export interface MealItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface DietPlan {
  id: string;
  memberId: string;
  title: string;
  waterGoalMl: number;
  meals: MealItem[];
  assignedDate: string;
}
