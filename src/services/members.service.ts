import type { MemberForm } from '@/api/member.schema';
import { supabase } from '@/lib/supabase';
import type { MembershipTier } from '@/types/member';

const DB_TIER_TO_UI: Record<string, MembershipTier> = {
  basic: 'Monthly',
  standard: 'Monthly',
  premium: 'Yearly',
};

const TIER_PRICE: Record<MembershipTier, number> = {
  Monthly: 600,
  Yearly: 7000,
};

interface MemberProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  members: {
    id: string;
    membership_tier: string;
    membership_status: string;
    expiry_date: string | null;
  } | null;
}

function shortId(uuid: string): string {
  return `M-${uuid.slice(0, 4).toUpperCase()}`;
}

function daysUntil(dateString: string | null): number {
  if (!dateString) return 0;
  const diffMs = new Date(dateString).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export async function listMembers() {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select('id, full_name, phone, members(id, membership_tier, membership_status, expiry_date)')
    .eq('role', 'member')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as MemberProfileRow[];

  return rows.map((row) => ({
    id: row.id,
    displayId: shortId(row.id),
    name: row.full_name ?? 'Unnamed Member',
    phone: row.phone ?? '',
    tier: DB_TIER_TO_UI[row.members?.membership_tier ?? ''] ?? 'Monthly',
    status: row.members?.membership_status ?? 'pending',
    daysLeft: daysUntil(row.members?.expiry_date ?? null),
  }));
}

export type MemberListItem = Awaited<ReturnType<typeof listMembers>>[number];

type DbTier = 'basic' | 'standard' | 'premium';

function toDbTier(tier: MembershipTier): DbTier {
  if (tier === 'Yearly') return 'premium';
  return 'basic';
}

export async function addMember(form: MemberForm): Promise<string> {
  const { data: profile, error: profileError } = (await (supabase
    .from('profiles' as any)
    .insert({
      user_id: null,
      full_name: form.fullName,
      phone: form.phone || null,
      role: 'member',
    } as any)
    .select('id')
    .single())) as { data: { id: string } | null; error: Error | null };
  if (profileError || !profile) {
    throw profileError ?? new Error('Failed to create member profile.');
  }

  const hasEmergency = Boolean(form.emergencyName || form.emergencyPhone);
  const emergencyContact = hasEmergency
    ? {
        name: form.emergencyName ?? '',
        phone: form.emergencyPhone ?? '',
        relation: form.emergencyRelation ?? '',
      }
    : null;

  const { error: memberError } = await supabase
    .from('members' as any)
    .insert({
      id: profile.id,
      membership_tier: toDbTier(form.tier),
      membership_status: form.initialPayment ? 'active' : 'pending',
      emergency_contact: emergencyContact,
    } as any);
  if (memberError) throw memberError;

  if (form.initialPayment) {
    const { error: txError } = await supabase
      .from('transactions' as any)
      .insert({
        member_id: profile.id,
        amount: TIER_PRICE[form.tier],
        status: 'completed',
        method: 'card',
        description: `Initial ${form.tier} membership payment`,
      } as any);
    if (txError) throw txError;
  }

  return profile.id;
}
