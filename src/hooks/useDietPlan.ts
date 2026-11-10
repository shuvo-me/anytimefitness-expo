import { queryKeys } from '@/hooks/queryKeys';
import { getDietPlan, saveDietPlan } from '@/services/diet.service';
import type { DietPlan } from '@/types/routine';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useDietPlan(memberId: string) {
  return useQuery({
    queryKey: queryKeys.diet.all(memberId),
    queryFn: () => getDietPlan(memberId),
    enabled: Boolean(memberId),
  });
}

export function useSaveDietPlan(memberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: DietPlan) => saveDietPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.diet.all(memberId),
      });
    },
  });
}
