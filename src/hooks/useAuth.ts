import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/db/schema';
import { queryKeys } from '@/hooks/queryKeys';
import * as authService from '@/services/auth.service';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setIsLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: queryKeys.auth.profile(userId ?? ''),
    queryFn: () => authService.getProfile(userId!),
    enabled: !!userId,
  });

  return {
    session,
    user: session?.user ?? null,
    profile,
    role: (profile as Profile | null)?.role ?? null,
    isAuthenticated: !!session,
    isLoading: isLoadingSession || (userId ? isLoadingProfile : false),
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.profile(user.id),
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
      queryClient.clear();
    },
  });
}
