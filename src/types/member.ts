export type MemberStatus = 'active' | 'expired' | 'pending';

export type MembershipTier = 'Basic' | 'Premium' | 'VIP' | 'Annual';

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
  email: string;
  phone: string;
  location: string;
  weightKg: number;
  heightCm: number;
  emergencyContact: EmergencyContact;
  duesAmount: number;
  assignedTrainer: string;
}

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'M-1001',
    name: 'Sarah Johnson',
    initials: 'SJ',
    tier: 'Premium',
    status: 'active',
    daysLeft: 214,
    totalSessions: 82,
    rating: 5,
    goal: 'Strength & Muscle Gain',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 204-1188',
    location: 'Downtown Flagship',
    weightKg: 68,
    heightCm: 170,
    emergencyContact: { name: 'James Johnson', relation: 'Husband', phone: '+1 (555) 204-2200' },
    duesAmount: 0,
    assignedTrainer: 'Alex Morgan',
  },
  {
    id: 'M-1002',
    name: 'Mike Chen',
    initials: 'MC',
    tier: 'Basic',
    status: 'active',
    daysLeft: 89,
    totalSessions: 41,
    rating: 4,
    goal: 'General Fitness',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 773-5511',
    location: 'Downtown Flagship',
    weightKg: 80,
    heightCm: 178,
    emergencyContact: { name: 'Linda Chen', relation: 'Mother', phone: '+1 (555) 773-8812' },
    duesAmount: 40,
    assignedTrainer: 'Jake R.',
  },
  {
    id: 'M-1003',
    name: 'Emma Davis',
    initials: 'ED',
    tier: 'Premium',
    status: 'expired',
    daysLeft: 0,
    totalSessions: 120,
    rating: 5,
    goal: 'Marathon Training',
    email: 'emma.davis@email.com',
    phone: '+1 (555) 902-3344',
    location: 'Riverside Annex',
    weightKg: 61,
    heightCm: 168,
    emergencyContact: { name: 'Tom Davis', relation: 'Brother', phone: '+1 (555) 902-5566' },
    duesAmount: 80,
    assignedTrainer: 'Maya S.',
  },
  {
    id: 'M-1004',
    name: 'David Kim',
    initials: 'DK',
    tier: 'VIP',
    status: 'active',
    daysLeft: 300,
    totalSessions: 64,
    rating: 5,
    goal: 'Body Recomposition',
    email: 'david.kim@email.com',
    phone: '+1 (555) 331-7788',
    location: 'Downtown Flagship',
    weightKg: 92,
    heightCm: 185,
    emergencyContact: { name: 'Grace Kim', relation: 'Wife', phone: '+1 (555) 331-9900' },
    duesAmount: 0,
    assignedTrainer: 'Alex Morgan',
  },
  {
    id: 'M-1005',
    name: 'Olivia Brown',
    initials: 'OB',
    tier: 'Premium',
    status: 'pending',
    daysLeft: 28,
    totalSessions: 0,
    rating: 0,
    goal: 'Weight Loss',
    email: 'olivia.brown@email.com',
    phone: '+1 (555) 664-2299',
    location: 'Riverside Annex',
    weightKg: 74,
    heightCm: 172,
    emergencyContact: { name: 'Noah Brown', relation: 'Father', phone: '+1 (555) 664-3300' },
    duesAmount: 55,
    assignedTrainer: 'Leo M.',
  },
  {
    id: 'M-1006',
    name: 'Liam Wilson',
    initials: 'LW',
    tier: 'Basic',
    status: 'expired',
    daysLeft: 0,
    totalSessions: 27,
    rating: 3,
    goal: 'Endurance',
    email: 'liam.wilson@email.com',
    phone: '+1 (555) 118-6644',
    location: 'Downtown Flagship',
    weightKg: 70,
    heightCm: 175,
    emergencyContact: { name: 'Ethan Wilson', relation: 'Brother', phone: '+1 (555) 118-7755' },
    duesAmount: 40,
    assignedTrainer: 'Dana K.',
  },
  {
    id: 'M-1007',
    name: 'Sophia Garcia',
    initials: 'SG',
    tier: 'Premium',
    status: 'active',
    daysLeft: 120,
    totalSessions: 58,
    rating: 4,
    goal: 'Hybrid Athletic Performance',
    email: 'sophia.garcia@email.com',
    phone: '+1 (555) 447-9911',
    location: 'Uptown Performance',
    weightKg: 65,
    heightCm: 169,
    emergencyContact: { name: 'Maria Garcia', relation: 'Mother', phone: '+1 (555) 447-8822' },
    duesAmount: 0,
    assignedTrainer: 'Maya S.',
  },
];

export function getMemberById(id: string): Member | undefined {
  return MOCK_MEMBERS.find((m) => m.id === id);
}

export const TRAINERS = ['Alex Morgan', 'Jake R.', 'Maya S.', 'Leo M.', 'Dana K.'];

export const TIER_OPTIONS: { value: MembershipTier; label: string }[] = [
  { value: 'Basic', label: 'Basic ($40/mo)' },
  { value: 'Premium', label: 'Premium ($80/mo)' },
  { value: 'VIP', label: 'VIP ($150/mo)' },
  { value: 'Annual', label: 'Annual ($600/yr)' },
];
