import { queryKeys } from '@/hooks/queryKeys';
import {
  getCurrentOccupancy,
  getMonthlyCheckInTrend,
  getTodayCheckIns,
} from '@/services/attendance.service';
import { useQuery } from '@tanstack/react-query';

const ATTENDANCE_REFRESH_MS = 30_000;

export function useCurrentOccupancy() {
  return useQuery({
    queryKey: queryKeys.attendance.occupancy,
    queryFn: getCurrentOccupancy,
    refetchInterval: ATTENDANCE_REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}

export function useTodayCheckIns() {
  return useQuery({
    queryKey: queryKeys.attendance.today,
    queryFn: getTodayCheckIns,
    refetchInterval: ATTENDANCE_REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}

export function useMonthlyCheckInTrend() {
  return useQuery({
    queryKey: queryKeys.attendance.trend,
    queryFn: getMonthlyCheckInTrend,
    refetchInterval: ATTENDANCE_REFRESH_MS,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });
}
