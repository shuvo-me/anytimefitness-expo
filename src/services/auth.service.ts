import type { Profile } from '@/db/schema';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface RegisterResult {
  session: Session | null;
  user: User;
}

export async function login(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: 'admin' } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registration did not return a user.');

  const { error: insertError } = await supabase
    .from('profiles' as any)
    .upsert(
      { user_id: data.user.id, email, full_name: fullName, role: 'admin' } as any,
      { onConflict: 'user_id', ignoreDuplicates: true },
    );
  if (insertError) throw insertError;

  return { session: data.session, user: data.user };
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
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as Profile;
}
