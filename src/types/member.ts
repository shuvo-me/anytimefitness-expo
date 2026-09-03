export type MemberStatus = 'active' | 'expired' | 'suspended' | 'pending';

export type MembershipTier = 'Monthly' | 'Yearly';

export const TIER_OPTIONS: { value: MembershipTier; label: string }[] = [
  { value: 'Monthly', label: 'Monthly (৳600/mo)' },
  { value: 'Yearly', label: 'Yearly (৳7000/yr)' },
];