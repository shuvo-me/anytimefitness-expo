import { queryKeys } from '@/hooks/queryKeys';
import * as settingsService from '@/services/settings.service';
import type { AdminProfileSettings, FacilitySettings } from '@/types/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useAdminProfileSettings() {
  return useQuery({
    queryKey: queryKeys.settings.adminProfile,
    queryFn: settingsService.getAdminProfile,
    staleTime: Infinity,
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<AdminProfileSettings>) =>
      settingsService.updateAdminProfile(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.adminProfile,
      });
    },
  });
}

export function useFacilitySettings() {
  return useQuery({
    queryKey: queryKeys.settings.facility,
    queryFn: settingsService.getFacilitySettings,
    staleTime: Infinity,
  });
}

export function useUpdateFacilitySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<FacilitySettings>) =>
      settingsService.updateFacilitySettings(patch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.facility,
      });
    },
  });
}

export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => settingsService.resetToDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.adminProfile,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.facility,
      });
    },
  });
}
