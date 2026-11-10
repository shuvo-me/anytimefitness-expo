import * as Linking from 'expo-linking';

import { normalizePhone } from './phone';

export function whatsappUrl(phone: string): string | null {
  const digits = normalizePhone(phone);
  if (!digits) return null;

  return `https://wa.me/${digits}`;
}

export async function openWhatsApp(phone: string): Promise<boolean> {
  const url = whatsappUrl(phone);
  if (!url) return false;

  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
