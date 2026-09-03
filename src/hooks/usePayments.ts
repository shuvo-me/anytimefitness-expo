import { queryKeys } from '@/hooks/queryKeys';
import {
  createTransaction,
  getMonthlyRevenue,
  getTransactionById,
  listTransactions,
  type CreateTransactionInput,
} from '@/services/payments.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: listTransactions,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => getTransactionById(id),
    enabled: Boolean(id),
  });
}

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: queryKeys.payments.revenue,
    queryFn: getMonthlyRevenue,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.revenue });
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.detail(variables.memberId),
      });
    },
  });
}
