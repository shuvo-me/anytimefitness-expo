import { queryKeys } from '@/hooks/queryKeys';
import {
  addMember,
  deleteMember,
  getMemberById,
  getWorkoutDays,
  listMembers,
  saveWorkoutWeek,
  updateMember,
} from '@/services/members.service';
import type {
  UpdateMemberInput,
} from '@/services/members.service';
import type { MemberForm } from '@/api/member.schema';
import type { WorkoutDay } from '@/types/routine';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMembers() {
  return useQuery({
    queryKey: queryKeys.members.all,
    queryFn: listMembers,
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: queryKeys.members.detail(id),
    queryFn: () => getMemberById(id),
    enabled: Boolean(id),
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

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { id: string; patch: UpdateMemberInput }) =>
      updateMember(args.id, args.patch),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.detail(variables.id),
      });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all });
    },
  });
}

export function useWorkoutDays(memberId: string) {
  return useQuery({
    queryKey: queryKeys.workoutPrograms.byMember(memberId),
    queryFn: () => getWorkoutDays(memberId),
    enabled: Boolean(memberId),
  });
}

export function useSaveWorkoutWeek(memberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (days: WorkoutDay[]) => saveWorkoutWeek(memberId, days),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workoutPrograms.byMember(memberId),
      });
    },
  });
}