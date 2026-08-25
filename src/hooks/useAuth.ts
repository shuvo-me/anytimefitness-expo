import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/db/schema';

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
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data as Profile;
    },
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
