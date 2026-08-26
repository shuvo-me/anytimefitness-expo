import { queryKeys } from '@/hooks/queryKeys';
import { supabase } from '@/lib/supabase';
import * as authService from '@/services/auth.service';
import type { Session } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(queryKeys.auth.session, session);
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const userId = session?.user?.id;

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: queryKeys.auth.profile(userId ?? ''),
    queryFn: () => authService.getProfile(userId!),
    enabled: !!userId,
    retry: 1,
  });

  const isLoading = isLoadingSession || (userId ? isLoadingProfile : false);

  return {
    session,
    user: session?.user ?? null,
    profile,
    isAuthenticated: !!session,
    isLoading,
    isError: isProfileError,
    error: profileError,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: () => {
      const session = queryClient.getQueryData<Session>(queryKeys.auth.session);
      if (session?.user?.id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.profile(session.user.id),
        });
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => authService.register(email, password, fullName),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      authService.resetPassword(email),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
