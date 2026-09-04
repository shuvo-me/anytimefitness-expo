import { supabase } from '@/lib/supabase';

const TABLE = 'attendance_logs';

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export interface MonthlyCheckInPoint {
  key: string;
  month: string;
  count: number;
  isCurrent: boolean;
}

export async function getCurrentOccupancy(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLE as any)
    .select('id', { count: 'exact', head: true })
    .is('check_out_time', null);
  if (error) throw error;
  return count ?? 0;
}

export async function getTodayCheckIns(): Promise<number> {
  const now = new Date();
  const start = startOfLocalDay(now).toISOString();
  const end = startOfLocalDay(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
  ).toISOString();

  const { count, error } = await supabase
    .from(TABLE as any)
    .select('id', { count: 'exact', head: true })
    .gte('check_in_time', start)
    .lt('check_in_time', end);
  if (error) throw error;
  return count ?? 0;
}

export async function getMonthlyCheckInTrend(): Promise<MonthlyCheckInPoint[]> {
  const now = new Date();
  const points: MonthlyCheckInPoint[] = [];

  // Build 6 buckets ending at the current month.
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    points.push({
      key: monthKey(d),
      month: MONTHS[d.getMonth()],
      count: 0,
      isCurrent: i === 0,
    });
  }

  const rangeStart = points[0].key;
  const from = new Date(`${rangeStart}-01T00:00:00`);
  const { data, error } = await supabase
    .from(TABLE as any)
    .select('check_in_time')
    .gte('check_in_time', from.toISOString());
  if (error) throw error;

  for (const row of (data ?? []) as { check_in_time: string }[]) {
    const key = monthKey(new Date(row.check_in_time));
    const point = points.find((p) => p.key === key);
    if (point) point.count += 1;
  }

  return points;
}
