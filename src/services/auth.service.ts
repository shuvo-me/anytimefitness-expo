import { supabase } from '@/lib/supabase';
import type { Profile } from '@/db/schema';

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function register(
  email: string,
  password: string,
  fullName: string,
) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: 'admin' } },
  });
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'anytimefitenss://reset-password',
  });
  if (error) throw error;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data as Profile;
}
