import { useSyncExternalStore } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { queryKeys } from '@/hooks/queryKeys';
import * as authService from '@/services/auth.service';

let _session: Session | null = null;
let _sessionResolved = false;
let _listeners: (() => void)[] = [];
let _initialized = false;

function initSessionListener() {
  if (_initialized) return;
  _initialized = true;

  supabase.auth.getSession().then(({ data: { session: s } }) => {
    _session = s;
    _sessionResolved = true;
    _listeners.forEach((l) => l());
  });

  supabase.auth.onAuthStateChange((_event, s) => {
    _session = s;
    _sessionResolved = true;
    _listeners.forEach((l) => l());
  });
}

function subscribe(callback: () => void) {
  _listeners.push(callback);
  return () => {
    _listeners = _listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  return _session;
}

function getServerSnapshot() {
  return null;
}

export function useAuth() {
  initSessionListener();

  const session = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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

  const isLoading = !_sessionResolved || (userId ? isLoadingProfile : false);

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
    onSuccess: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
