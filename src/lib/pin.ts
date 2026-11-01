import { normalizePhone } from '@/lib/phone';
import * as Crypto from 'expo-crypto';

const PIN_SALT = 'anytimefitenss';

export function isValidPin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

export async function hashPin(phone: string, pin: string): Promise<string> {
  const normalized = normalizePhone(phone);
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${normalized}:${pin}:${PIN_SALT}`,
  );
}

export async function verifyPin(
  phone: string,
  pin: string,
  storedHash: string | null | undefined,
): Promise<boolean> {
  if (!storedHash) return false;
  const candidate = await hashPin(phone, pin);
  return candidate.toLowerCase() === storedHash.toLowerCase();
}
