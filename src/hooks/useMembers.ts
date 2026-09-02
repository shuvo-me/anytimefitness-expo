import { queryKeys } from '@/hooks/queryKeys';
import {
  addMember,
  listMembers,
} from '@/services/members.service';
import type { MemberForm } from '@/api/member.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMembers() {
  return useQuery({
    queryKey: queryKeys.members.all,
    queryFn: listMembers,
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: MemberForm) => addMember(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
    },
  });
}
