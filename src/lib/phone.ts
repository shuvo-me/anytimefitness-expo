const BD_COUNTRY_CODE = '880';

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith(BD_COUNTRY_CODE)) return digits;
  if (digits.startsWith('0')) return `${BD_COUNTRY_CODE}${digits.slice(1)}`;
  return digits;
}

export function phoneVariants(input: string): string[] {
  const normalized = normalizePhone(input);
  if (!normalized) return [];

  const variants = new Set<string>([normalized, `+${normalized}`]);

  if (normalized.startsWith(BD_COUNTRY_CODE)) {
    variants.add(`0${normalized.slice(BD_COUNTRY_CODE.length)}`);
  }

  return [...variants];
}

export function formatPhone(input: string): string {
  const normalized = normalizePhone(input);

  if (normalized.startsWith(BD_COUNTRY_CODE) && normalized.length === 13) {
    const local = normalized.slice(BD_COUNTRY_CODE.length);
    return `+${BD_COUNTRY_CODE} ${local.slice(0, 4)}-${local.slice(4)}`;
  }

  return input.trim();
}
