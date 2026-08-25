import { type Database } from '@/types/database.types';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '';

const isValidUrl = url.startsWith('http://') || url.startsWith('https://');

function getStorage(): SupportedStorage | undefined {
  if (Platform.OS === 'web') return undefined;

  // Lazy import to avoid SSR crashes
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SecureStore = require('expo-secure-store');
  return {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
  };
}

export const supabase = createClient<Database>(
  isValidUrl ? url : 'http://localhost:54321',
  isValidUrl ? supabaseKey : 'placeholder-key',
  {
    auth: {
      storage: getStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
