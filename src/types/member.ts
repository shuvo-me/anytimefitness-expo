export type MemberStatus = 'active' | 'expired' | 'pending';

export type MembershipTier = 'Monthly' | 'Yearly';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  tier: MembershipTier;
  status: MemberStatus;
  daysLeft: number;
  totalSessions: number;
  rating: number;
  goal: string;
  phone: string;
  weightKg: number;
  heightCm: number;
  emergencyContact: EmergencyContact;
  duesAmount: number;
}



export function getMemberById(id: string): Member | undefined {
  return MOCK_MEMBERS.find((m) => m.id === id);
}

export const TIER_OPTIONS: { value: MembershipTier; label: string }[] = [
  { value: 'Monthly', label: 'Monthly (৳600/mo)' },
  { value: 'Yearly', label: 'Yearly (৳7000/yr)' },
];
