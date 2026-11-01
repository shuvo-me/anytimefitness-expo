import { Platform } from 'react-native';

const SESSION_KEY = 'anytimefitenss_member_session';

export interface MemberSession {
  memberId: string;
  phone: string;
  fullName: string;
}

interface SessionStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

async function getStorage(): Promise<SessionStorage> {
  if (Platform.OS === 'web') {
    const store = typeof window !== 'undefined' ? window.localStorage : null;
    return {
      getItem: async (key) => store?.getItem(key) ?? null,
      setItem: async (key, value) => {
        store?.setItem(key, value);
      },
      removeItem: async (key) => {
        store?.removeItem(key);
      },
    };
  }

  const SecureStore = await import('expo-secure-store');
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

function parseSession(raw: string | null): MemberSession | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const { memberId, phone, fullName } = parsed as Record<string, unknown>;
    if (typeof memberId !== 'string' || !memberId) return null;

    return {
      memberId,
      phone: typeof phone === 'string' ? phone : '',
      fullName: typeof fullName === 'string' ? fullName : '',
    };
  } catch {
    return null;
  }
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const storage = await getStorage();
  const raw = await storage.getItem(SESSION_KEY);
  return parseSession(raw);
}

export async function setMemberSession(session: MemberSession): Promise<void> {
  const storage = await getStorage();
  await storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearMemberSession(): Promise<void> {
  const storage = await getStorage();
  await storage.removeItem(SESSION_KEY);
}
