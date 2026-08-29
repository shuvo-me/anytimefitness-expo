export interface WorkoutExercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  targetWeightKg: number;
  completedSets: boolean[];
  instructions: string;
}

export interface WorkoutProgram {
  id: string;
  memberId: string;
  programTitle: string;
  currentDayTitle: string;
  splitSchedule: string;
  exercises: WorkoutExercise[];
  notes: string;
  assignedBy: string;
  assignedDate: string;
}

export interface MealItem {
  id: string;
  time: string;
  title: string;
  description: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  completed?: boolean;
}

export interface DietPlan {
  id: string;
  memberId: string;
  title: string;
  dailyCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  targetWaterLiters: number;
  meals: MealItem[];
  assignedBy: string;
  assignedDate: string;
}

export const INITIAL_WORKOUT_PROGRAM: WorkoutProgram = {
  id: '',
  memberId: '',
  programTitle: '4-Day Upper/Lower Hypertrophy',
  currentDayTitle: 'Day 1: Push (Chest / Shoulders / Triceps)',
  splitSchedule: 'Mon / Tue / Thu / Fri',
  exercises: [
    {
      id: 'ex-bench',
      name: 'Barbell Bench Press',
      targetMuscle: 'Chest & Triceps',
      sets: 4,
      reps: '8-10',
      targetWeightKg: 70,
      completedSets: [false, false, false, false],
      instructions: 'Retract scapula, lower bar to sternum with control.',
    },
    {
      id: 'ex-ohp',
      name: 'Overhead Press',
      targetMuscle: 'Shoulders',
      sets: 3,
      reps: '6-8',
      targetWeightKg: 40,
      completedSets: [false, false, false],
      instructions: 'Brace core, press directly overhead without arching.',
    },
  ],
  notes: 'Focus on progressive overload. Log every working set in the app.',
  assignedBy: 'Alex Morgan (Admin)',
  assignedDate: new Date().toISOString().split('T')[0],
};

export const INITIAL_DIET_PLAN: DietPlan = {
  id: '',
  memberId: '',
  title: 'Lean Bulk, High Protein',
  dailyCalories: 2800,
  targetProteinGrams: 180,
  targetCarbsGrams: 320,
  targetFatsGrams: 80,
  targetWaterLiters: 3.5,
  meals: [
    {
      id: 'meal-breakfast',
      time: '08:00 AM',
      title: 'Meal 1: Breakfast',
      description: 'Oats, whey isolate, banana, and almond butter.',
      calories: 650,
      proteinGrams: 45,
      carbsGrams: 80,
      fatsGrams: 18,
      completed: false,
    },
    {
      id: 'meal-lunch',
      time: '12:30 PM',
      title: 'Meal 2: Lunch',
      description: 'Chicken breast, white rice, and steamed broccoli.',
      calories: 720,
      proteinGrams: 55,
      carbsGrams: 80,
      fatsGrams: 16,
      completed: false,
    },
  ],
  assignedBy: 'Alex Morgan (Admin)',
  assignedDate: new Date().toISOString().split('T')[0],
};

export function makeWorkoutProgram(memberId: string): WorkoutProgram {
  return {
    ...INITIAL_WORKOUT_PROGRAM,
    id: `prog-${memberId}`,
    memberId,
    exercises: INITIAL_WORKOUT_PROGRAM.exercises.map((ex) => ({
      ...ex,
      completedSets: ex.completedSets.map(() => false),
    })),
  };
}

export function makeDietPlan(memberId: string): DietPlan {
  return {
    ...INITIAL_DIET_PLAN,
    id: `diet-${memberId}`,
    memberId,
    meals: INITIAL_DIET_PLAN.meals.map((m) => ({ ...m, completed: false })),
  };
}
