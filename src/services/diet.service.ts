import { toDateInputValue } from '@/lib/date';
import { supabase } from '@/lib/supabase';
import type { DietPlan, MealItem } from '@/types/routine';

interface DietPlanRow {
  id: string;
  member_id: string;
  title: string;
  assigned_date: string;
  meals: unknown;
  water_goal_ml: number;
}

function normalizeMeals(value: unknown): MealItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return [];
    const raw = item as Record<string, unknown>;

    const title = typeof raw.title === 'string' ? raw.title : '';
    if (!title) return [];

    return [
      {
        id:
          typeof raw.id === 'string' && raw.id ? raw.id : `meal-${index + 1}`,
        time: typeof raw.time === 'string' ? raw.time : '',
        title,
        description:
          typeof raw.description === 'string' ? raw.description : '',
      },
    ];
  });
}

function rowToPlan(row: DietPlanRow, memberId: string): DietPlan {
  return {
    id: row.id,
    memberId,
    title: row.title,
    waterGoalMl: row.water_goal_ml,
    meals: normalizeMeals(row.meals),
    assignedDate: row.assigned_date,
  };
}

export function emptyDietPlan(memberId: string): DietPlan {
  return {
    id: '',
    memberId,
    title: '',
    waterGoalMl: 3000,
    meals: [],
    assignedDate: toDateInputValue(),
  };
}

export async function getDietPlan(memberId: string): Promise<DietPlan | null> {
  const { data, error } = await supabase
    .from('diet_plans' as any)
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  const row = data as DietPlanRow | null;
  if (!row) return null;
  return rowToPlan(row, memberId);
}

export async function saveDietPlan(plan: DietPlan): Promise<void> {
  let targetId = plan.id;

  if (!targetId) {
    const existing = await getDietPlan(plan.memberId);
    targetId = existing?.id ?? '';
  }

  const payload = {
    member_id: plan.memberId,
    title: plan.title,
    meals: plan.meals,
    water_goal_ml: plan.waterGoalMl,
    notes: null,
    assigned_date: plan.assignedDate,
  };

  if (targetId) {
    const { error } = await (supabase.from('diet_plans' as any) as any)
      .update(payload as any)
      .eq('id', targetId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('diet_plans' as any)
    .insert(payload as any);
  if (error) throw error;
}
