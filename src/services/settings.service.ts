import * as SecureStore from 'expo-secure-store';
import type {
  AdminProfileSettings,
  FacilitySettings,
} from '@/types/admin';
import {
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_FACILITY_SETTINGS,
} from '@/types/admin';

const PROFILE_KEY = 'admin_profile_settings';
const FACILITY_KEY = 'facility_settings';

export async function getAdminProfile(): Promise<AdminProfileSettings> {
  const raw = await SecureStore.getItemAsync(PROFILE_KEY);
  if (!raw) return DEFAULT_ADMIN_PROFILE;
  try {
    return { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
}

export async function updateAdminProfile(
  patch: Partial<AdminProfileSettings>,
): Promise<void> {
  const current = await getAdminProfile();
  const merged = { ...current, ...patch };
  await SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(merged));
}

export async function getFacilitySettings(): Promise<FacilitySettings> {
  const raw = await SecureStore.getItemAsync(FACILITY_KEY);
  if (!raw) return DEFAULT_FACILITY_SETTINGS;
  try {
    return { ...DEFAULT_FACILITY_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_FACILITY_SETTINGS;
  }
}

export async function updateFacilitySettings(
  patch: Partial<FacilitySettings>,
): Promise<void> {
  const current = await getFacilitySettings();
  const merged = { ...current, ...patch };
  await SecureStore.setItemAsync(FACILITY_KEY, JSON.stringify(merged));
}

export async function resetToDefaults(): Promise<void> {
  await SecureStore.deleteItemAsync(PROFILE_KEY);
  await SecureStore.deleteItemAsync(FACILITY_KEY);
}
