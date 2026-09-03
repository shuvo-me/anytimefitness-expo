import type { AppSettingsValue } from '@/db/schema';
import { supabase } from '@/lib/supabase';
import type {
  AdminProfileSettings,
  FacilitySettings,
} from '@/types/admin';
import {
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_FACILITY_SETTINGS,
} from '@/types/admin';
import * as SecureStore from 'expo-secure-store';

const PROFILE_KEY = 'admin_profile_settings';
const FACILITY_KEY = 'facility_settings';
const SETTINGS_TABLE = 'app_settings';

// database.types.ts is a stub (empty Tables), so the query builder resolves to
// `never`. Cast the whole builder to `any` — same pattern used across services.
const settingsTable = supabase.from(SETTINGS_TABLE) as any;

type SettingsRow = { value: AppSettingsValue };
type SettingsIdRow = { id: string };

interface SettingsBag {
  admin: AdminProfileSettings;
  facility: FacilitySettings;
}

interface SettingsPatch {
  admin?: Partial<AdminProfileSettings>;
  facility?: Partial<FacilitySettings>;
}

/* ── SecureStore (offline fallback) ─────────────────────────────── */

async function readLocal(): Promise<SettingsBag> {
  const [adminRaw, facilityRaw] = await Promise.all([
    SecureStore.getItemAsync(PROFILE_KEY),
    SecureStore.getItemAsync(FACILITY_KEY),
  ]);

  let admin = DEFAULT_ADMIN_PROFILE;
  let facility = DEFAULT_FACILITY_SETTINGS;

  if (adminRaw) {
    try {
      admin = { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(adminRaw) };
    } catch {
      // ignore malformed local copy
    }
  }
  if (facilityRaw) {
    try {
      facility = { ...DEFAULT_FACILITY_SETTINGS, ...JSON.parse(facilityRaw) };
    } catch {
      // ignore malformed local copy
    }
  }

  return { admin, facility };
}

async function writeLocal(bag: SettingsBag): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(PROFILE_KEY, JSON.stringify(bag.admin)),
    SecureStore.setItemAsync(FACILITY_KEY, JSON.stringify(bag.facility)),
  ]);
}

/* ── Database (source of truth) with SecureStore fallback ───────── */

async function readSettings(): Promise<SettingsBag> {
  try {
    const result = (await settingsTable
      .select('value')
      .limit(1)
      .maybeSingle()) as {
        data: SettingsRow | null;
        error: { message: string } | null;
      };

    if (!result.error && result.data?.value) {
      const value = result.data.value as AppSettingsValue;
      return {
        admin: { ...DEFAULT_ADMIN_PROFILE, ...value.admin },
        facility: { ...DEFAULT_FACILITY_SETTINGS, ...value.facility },
      };
    }
  } catch {
    // DB unavailable — fall through to local copy
  }

  return readLocal();
}

async function saveSettings(patch: SettingsPatch): Promise<void> {
  const current = await readSettings();
  console.log({ current, patch });
  const merged: SettingsBag = {
    admin: patch.admin
      ? { ...current.admin, ...patch.admin }
      : current.admin,
    facility: patch.facility
      ? { ...current.facility, ...patch.facility }
      : current.facility,
  };

  const value: AppSettingsValue = {
    admin: merged.admin,
    facility: merged.facility,
  };

  try {
    const existingResult = (await settingsTable
      .select('id')
      .limit(1)
      .maybeSingle()) as {
        data: SettingsIdRow | null;
        error: { message: string } | null;
      };

    let error: { message: string } | null = null;
    if (existingResult.data?.id) {
      const res = (await settingsTable
        .update({ value })
        .eq('id', existingResult.data.id)) as {
          error: { message: string } | null;
        };
      error = res.error;
    } else {
      const res = (await settingsTable.insert({ value })) as {
        error: { message: string } | null;
      };
      error = res.error;
    }
    if (error) throw error;
  } catch {
    // DB unavailable — still persist locally so the app remains functional
  }

  await writeLocal(merged);
}

/* ── Public API (unchanged signatures) ──────────────────────────── */

export async function getAdminProfile(): Promise<AdminProfileSettings> {
  return (await readSettings()).admin;
}

export async function updateAdminProfile(
  patch: Partial<AdminProfileSettings>,
): Promise<void> {
  await saveSettings({ admin: patch });
}

export async function getFacilitySettings(): Promise<FacilitySettings> {
  return (await readSettings()).facility;
}

export async function updateFacilitySettings(
  patch: Partial<FacilitySettings>,
): Promise<void> {
  await saveSettings({ facility: patch });
}

export async function resetToDefaults(): Promise<void> {
  try {
    await settingsTable.delete();
  } catch {
    // ignore DB errors on reset
  }
  await SecureStore.deleteItemAsync(PROFILE_KEY);
  await SecureStore.deleteItemAsync(FACILITY_KEY);
}
