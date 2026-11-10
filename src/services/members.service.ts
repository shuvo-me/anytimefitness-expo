import type { MemberForm } from '@/api/member.schema';
import { toDateInputValue } from '@/lib/date';
import { supabase } from '@/lib/supabase';
import { getFacilitySettings } from '@/services/settings.service';
import type { MembershipTier, MemberStatus } from '@/types/member';
import type {
  Weekday,
  WorkoutDay,
  WorkoutExercise,
} from '@/types/routine';
import { WEEKDAYS } from '@/types/routine';

const DB_TIER_TO_UI: Record<string, MembershipTier> = {
  basic: 'Monthly',
  standard: 'Yearly',
};

const DB_STATUS_TO_UI: Record<string, MemberStatus> = {
  active: 'active',
  expired: 'expired',
  suspended: 'suspended',
  pending: 'pending',
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
type MembershipStatus = 'pending' | 'active' | 'expired';

function getMembershipStatus(
  status: MembershipStatus | null | undefined,
  expiryDate: string | null
): MembershipStatus {
  if (status !== 'active' || !expiryDate) {
    return status ?? 'pending';
  }

  const today = new Date();
  const expiry = new Date(`${expiryDate}T00:00:00`);

  today.setHours(0, 0, 0, 0);

  if (today > expiry) {
    return 'expired';
  }

  return 'active';
}

export async function listMembers() {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select('id, full_name, phone, members(id, membership_tier, membership_status, expiry_date)')
    .eq('role', 'member')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as MemberProfileRow[];

  return rows.map((row) => {
    const dbStatus = row.members?.membership_status ?? 'pending';
    const expiryDate = row.members?.expiry_date ?? null;

    const status = getMembershipStatus(dbStatus as MembershipStatus, expiryDate);

    return {
      id: row.id,
      displayId: shortId(row.id),
      name: row.full_name ?? 'Unnamed Member',
      phone: row.phone ?? '',
      tier: DB_TIER_TO_UI[row.members?.membership_tier ?? ''] ?? 'Monthly',
      status: DB_STATUS_TO_UI[status] ?? 'pending',
      daysLeft: daysUntil(row.members?.expiry_date ?? null),
    }
  });
}

export type MemberListItem = Awaited<ReturnType<typeof listMembers>>[number];

type DbTier = 'basic' | 'standard' | 'premium';

function toDbTier(tier: MembershipTier): DbTier {
  if (tier === 'Yearly') return 'premium';
  return 'basic';
}

export function plannedExpiry(tier: MembershipTier, from: Date = new Date()): string {
  const days = tier === 'Yearly' ? 365 : 30;
  const d = new Date(from);
  d.setDate(d.getDate() + days);

  //YYYY-MM-DD string from local date components 
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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

  const weightKg = parseOptionalNumber(form.weightKg);
  const heightCm = parseOptionalNumber(form.heightCm);
  const attendanceGoalDays = parseOptionalInt(form.attendanceGoalDays);

  const { error: memberError } = await supabase
    .from('members' as any)
    .insert({
      id: profile.id,
      start_date: form.startDate,
      admission_fee: form.admissionFee,
      membership_tier: toDbTier(form.tier),
      membership_status: form.initialPayment ? 'active' : 'pending',
      expiry_date: plannedExpiry(form.tier, form.startDate),
      emergency_contact: emergencyContact,
      goal: form.goal?.trim() || null,
      weight_kg: weightKg,
      height_cm: heightCm,
      attendance_goal_days: attendanceGoalDays,
    } as any);
  if (memberError) throw memberError;

  if (form.initialPayment) {
    const { pricing } = await getFacilitySettings();
    const amount =
      pricing[form.tier === 'Monthly' ? 'monthly' : 'yearly'];
    const { error: txError } = await supabase
      .from('transactions' as any)
      .insert({
        member_id: profile.id,
        amount,
        status: 'completed',
        method: 'card',
        description: `Initial ${form.tier} membership payment`,
      } as any);
    if (txError) throw txError;
  }

  return profile.id;
}

function parseOptionalNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function parseOptionalInt(value: string | undefined): number | null {
  if (value === undefined || value.trim() === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : Math.round(n);
}

/* ── Member detail ─────────────────────────────────────────────────── */

interface MemberDetailRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  members: {
    membership_tier: string;
    membership_status: string;
    admission_fee: number;
    start_date: string | null;
    expiry_date: string | null;
    goal: string | null;
    weight_kg: number | null;
    height_cm: number | null;
    attendance_goal_days: number | null;
    emergency_contact: {
      name?: string;
      phone?: string;
      relation?: string;
    } | null;
  } | null;
}

export interface MemberDetail {
  id: string;
  displayId: string;
  name: string;
  initials: string;
  phone: string;
  tier: MembershipTier;
  status: MemberStatus;
  daysLeft: number;
  startDate: string | null;
  expiryDate: string | null;
  goal: string | null;
  weightKg: number | null;
  heightCm: number | null;
  attendanceGoalDays: number | null;
  emergencyContact: { name: string; phone: string; relation: string } | null;
  totalSessions: number;
  totalPaid: number;
  admissionFee: number;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export async function getMemberById(id: string): Promise<MemberDetail | null> {
  const { data, error } = await supabase
    .from('profiles' as any)
    .select(
      'id, full_name, phone, members(id, membership_tier, membership_status, start_date, expiry_date, goal, weight_kg, height_cm, attendance_goal_days, emergency_contact, admission_fee)',
    )
    .eq('id', id)
    .single();
  if (error) throw error;

  const row = data as MemberDetailRow | null;
  if (!row) return null;

  const name = row.full_name ?? 'Unnamed Member';

  let totalSessions = 0;
  const { count, error: countError } = await supabase
    .from('attendance_logs' as any)
    .select('id', { count: 'exact', head: true })
    .eq('member_id', id);
  if (countError) throw countError;
  totalSessions = count ?? 0;

  const { data: txRows, error: txError } = await supabase
    .from('transactions' as any)
    .select('amount')
    .eq('member_id', id)
    .eq('status', 'completed');
  if (txError) throw txError;
  const totalPaid = (txRows ?? []).reduce(
    (sum, tx: { amount: number | string }) => sum + Number(tx.amount ?? 0),
    0,
  ) + row.members?.admission_fee! as number;

  const mem = row.members;
  const status = getMembershipStatus(mem?.membership_status as MembershipStatus, mem?.expiry_date ?? null);
  return {
    id: row.id,
    displayId: shortId(row.id),
    name,
    initials: initialsOf(name),
    phone: row.phone ?? '',
    tier: DB_TIER_TO_UI[mem?.membership_tier ?? ''] ?? 'Monthly',
    status: DB_STATUS_TO_UI[status] ?? 'pending',
    daysLeft: daysUntil(mem?.expiry_date ?? null),
    startDate: mem?.start_date ?? null,
    expiryDate: mem?.expiry_date ?? null,
    goal: mem?.goal ?? null,
    weightKg: mem?.weight_kg ?? null,
    heightCm: mem?.height_cm ?? null,
    attendanceGoalDays: mem?.attendance_goal_days ?? null,
    emergencyContact: mem?.emergency_contact
      ? {
        name: mem.emergency_contact.name ?? '',
        phone: mem.emergency_contact.phone ?? '',
        relation: mem.emergency_contact.relation ?? '',
      }
      : null,
    totalSessions,
    totalPaid,
    admissionFee: mem?.admission_fee ?? 0,
  };
}

export interface UpdateMemberInput {
  fullName?: string;
  phone?: string;
  tier?: MembershipTier;
  status?: MemberStatus;
  goal?: string | null;
  admissionFee?: number;
  startDate?: string;
}

export async function updateMember(
  id: string,
  patch: UpdateMemberInput,
): Promise<void> {
  const profilePromise = (supabase.from('profiles' as any) as any).update({
    ...(patch.fullName !== undefined ? { full_name: patch.fullName } : {}),
    ...(patch.phone !== undefined ? { phone: patch.phone || null } : {}),
  } as any).eq('id', id);

  const membersPatch: Record<string, unknown> = {};
  if (patch.tier !== undefined) {
    membersPatch.membership_tier = toDbTier(patch.tier);
    membersPatch.expiry_date = plannedExpiry(patch.tier);
  }
  if (patch.status !== undefined) membersPatch.membership_status = patch.status;
  if (patch.goal !== undefined) membersPatch.goal = patch.goal?.trim() || null;
  if (patch.admissionFee !== undefined) membersPatch.admission_fee = patch.admissionFee;
  if (patch.startDate !== undefined) {
    membersPatch.start_date = patch.startDate;
    if (patch.tier !== undefined) {
      membersPatch.expiry_date = plannedExpiry(
        patch.tier,
        new Date(`${patch.startDate}T00:00:00`),
      );
    }
  }

  const memberPromise =
    Object.keys(membersPatch).length > 0
      ? (supabase.from('members' as any) as any).update(membersPatch as any).eq('id', id)
      : Promise.resolve({ error: null });

  const [profileRes, memberRes] = await Promise.all([
    profilePromise,
    memberPromise,
  ]);
  if (profileRes.error) throw profileRes.error;
  if (memberRes.error) throw memberRes.error;
}

export async function deleteMember(id: string): Promise<void> {
  const { error } = await supabase.from('profiles' as any).delete().eq('id', id);
  if (error) throw error;
}

/* ── Workout days (weekly split) ───────────────────────────────────── */

interface WorkoutDayRow {
  id: string;
  member_id: string;
  title: string;
  split_day: string;
  split_schedule: string | null;
  assigned_date: string;
  exercises: unknown;
}

function normalizeWeekday(value: unknown): Weekday | '' {
  if (typeof value !== 'string') return '';
  const normalized = value.trim().toLowerCase();
  return WEEKDAYS.find((day) => day.toLowerCase() === normalized) ?? '';
}

function normalizeExercises(value: unknown): WorkoutExercise[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return [];
    const raw = item as Record<string, unknown>;

    const name = typeof raw.name === 'string' ? raw.name : '';
    if (!name) return [];

    const sets = Number(raw.sets);
    const rawWeight = raw.weightKg ?? raw.targetWeightKg;
    const weight = rawWeight == null ? NaN : Number(rawWeight);

    return [
      {
        id:
          typeof raw.id === 'string' && raw.id ? raw.id : `ex-${index + 1}`,
        name,
        sets: Number.isFinite(sets) && sets > 0 ? Math.round(sets) : 3,
        reps: typeof raw.reps === 'string' ? raw.reps : '',
        weightKg: Number.isFinite(weight) ? weight : null,
      },
    ];
  });
}

function rowToWorkoutDay(row: WorkoutDayRow, memberId: string): WorkoutDay {
  return {
    id: row.id,
    memberId,
    weekday: normalizeWeekday(row.split_schedule),
    title: row.title,
    focus: row.split_day,
    exercises: normalizeExercises(row.exercises),
    assignedDate: row.assigned_date,
  };
}

export function emptyWorkoutDay(
  memberId: string,
  weekday: Weekday = 'Monday',
): WorkoutDay {
  return {
    id: '',
    memberId,
    weekday,
    title: '',
    focus: '',
    exercises: [],
    assignedDate: toDateInputValue(),
  };
}

export async function getWorkoutDays(memberId: string): Promise<WorkoutDay[]> {
  const { data, error } = await supabase
    .from('workout_programs' as any)
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as WorkoutDayRow[];

  return rows
    .map((row) => rowToWorkoutDay(row, memberId))
    .sort((a, b) => {
      const aIndex = a.weekday ? WEEKDAYS.indexOf(a.weekday) : WEEKDAYS.length;
      const bIndex = b.weekday ? WEEKDAYS.indexOf(b.weekday) : WEEKDAYS.length;
      return aIndex - bIndex;
    });
}

export async function saveWorkoutWeek(
  memberId: string,
  days: WorkoutDay[],
): Promise<void> {
  const { data, error } = await supabase
    .from('workout_programs' as any)
    .select('id')
    .eq('member_id', memberId);
  if (error) throw error;

  const existingRows = (data ?? []) as { id: string }[];
  const existingIds = new Set(existingRows.map((row) => row.id));
  const keptIds = new Set(
    days.map((day) => day.id).filter((id) => existingIds.has(id)),
  );
  const removedIds = [...existingIds].filter((id) => !keptIds.has(id));

  if (removedIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('workout_programs' as any)
      .delete()
      .in('id', removedIds);
    if (deleteError) throw deleteError;
  }

  for (const day of days) {
    const payload = {
      member_id: memberId,
      title: day.title,
      split_day: day.focus,
      split_schedule: day.weekday || null,
      notes: null,
      assigned_by: null,
      assigned_date: day.assignedDate,
      exercises: day.exercises,
      completed: false,
    };

    if (existingIds.has(day.id)) {
      const { error: updateError } = await (supabase
        .from('workout_programs' as any) as any)
        .update(payload as any)
        .eq('id', day.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('workout_programs' as any)
        .insert(payload as any);
      if (insertError) throw insertError;
    }
  }
}

