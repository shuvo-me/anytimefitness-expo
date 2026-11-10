export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weightKg: number | null;
}

export interface WorkoutProgram {
  id: string;
  memberId: string;
  title: string;
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
