import { supabase } from '@/lib/supabase';
import { plannedExpiry } from '@/services/members.service';
import type { MembershipTier, Tx, TxCategory, TxMethod } from '@/types/transaction';

const DB_TIER_TO_UI: Record<string, MembershipTier> = {
  basic: 'Monthly',
  standard: 'Monthly',
  premium: 'Yearly',
};

export type DbPaymentMethod = 'card' | 'cash' | 'online' | 'apple_pay' | 'google_pay';

const UI_METHOD_TO_DB: Record<TxMethod, DbPaymentMethod> = {
  Cash: 'cash',
  bKash: 'online',
};

const DB_METHOD_TO_UI: Record<string, TxMethod> = {
  card: 'Cash',
  cash: 'Cash',
  online: 'bKash',
  apple_pay: 'bKash',
  google_pay: 'bKash',
};

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

interface TransactionRow {
  id: string;
  amount: number | string;
  currency: string;
  status: string;
  method: string;
  description: string | null;
  paid_at: string | null;
  created_at: string | null;
  profiles: {
    full_name: string | null;
    members: {
      membership_tier: string;
    } | null;
  } | null;
}

function mapTx(row: TransactionRow): Tx {
  const name = row.profiles?.full_name ?? 'Unnamed Member';
  const rawCategory = (row.description ?? 'Monthly Fee') as TxCategory;
  const category: TxCategory = ['Monthly Fee', 'Personal Training', 'Registration', 'Locker'].includes(rawCategory)
    ? rawCategory
    : 'Monthly Fee';

  return {
    id: row.id,
    memberId: '',
    invoiceNumber: `INV-${row.id.slice(0, 4).toUpperCase()}`,
    memberName: name,
    initials: initialsOf(name),
    tier: DB_TIER_TO_UI[row.profiles?.members?.membership_tier ?? ''] ?? 'Monthly',
    amount: Number(row.amount ?? 0),
    category,
    method: DB_METHOD_TO_UI[row.method] ?? 'Cash',
    date: formatDate(row.paid_at ?? row.created_at),
  };
}

export async function listTransactions(): Promise<Tx[]> {
  const { data, error } = await supabase
    .from('transactions' as any)
    .select(
      'id, amount, currency, status, method, description, paid_at, created_at, profiles(id, full_name, members(membership_tier))',
    )
    .order('created_at', { ascending: false });
  if (error) throw error;

  return ((data ?? []) as TransactionRow[]).map(mapTx);
}

export async function getTransactionById(id: string): Promise<Tx | null> {
  const { data, error } = await supabase
    .from('transactions' as any)
    .select(
      'id, amount, currency, status, method, description, paid_at, created_at, profiles(id, full_name, members(membership_tier))',
    )
    .eq('id', id)
    .single();
  if (error) throw error;

  const row = data as TransactionRow | null;
  if (!row) return null;
  return mapTx(row);
}

export async function getMonthlyRevenue(): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  const { data, error } = await supabase
    .from('transactions' as any)
    .select('amount')
    .eq('status', 'completed')
    .gte('created_at', startOfMonth)
    .lt('created_at', endOfMonth);
  if (error) throw error;

  return ((data ?? []) as { amount: number | string }[]).reduce(
    (sum, tx) => sum + Number(tx.amount ?? 0),
    0,
  );
}

export interface CreateTransactionInput {
  memberId: string;
  amount: number;
  method: TxMethod;
  category: TxCategory;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<string> {
  const { data, error } = await supabase
    .from('transactions' as any)
    .insert({
      member_id: input.memberId,
      amount: input.amount,
      currency: 'BDT',
      status: 'completed',
      method: UI_METHOD_TO_DB[input.method],
      description: input.category,
      paid_at: new Date().toISOString(),
    } as any)
    .select('id')
    .single();
  if (error) throw error;

  const txId = (data as { id: string } | null)?.id ?? '';

  const { data: memberRow, error: memberError } = await supabase
    .from('members' as any)
    .select('membership_tier')
    .eq('id', input.memberId)
    .single();
  if (!memberError && memberRow) {
    const tier =
      (memberRow as { membership_tier: string }).membership_tier === 'premium'
        ? 'Yearly'
        : 'Monthly';
    await ((supabase.from('members' as any) as any)
      .update({
        membership_status: 'active',
        expiry_date: plannedExpiry(tier),
      } as any)
      .eq('id', input.memberId));
  }

  return txId;
}
