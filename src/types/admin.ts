export type AdminTab = 'home' | 'members' | 'payments' | 'settings';

export type SettingCategory =
  | 'all'
  | 'profile'
  | 'facility'
  | 'billing'
  | 'security'
  | 'notifications'
  | 'maintenance';

export interface AdminProfileSettings {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  gymBranch?: string;
  bio?: string;
  certifications?: string[];
  shiftHours?: string;
  securityPin?: string;
  twoFactorEnabled?: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface FacilitySettings {
  facilityName: string;
  facilityAddress: string;
  facilityPhone: string;
  facilityEmail: string;
  operatingHours: string;
  maxFloorCapacity: number;
  peakOccupancyAlertThreshold: number;
  currencySymbol: string;
  taxRatePercent: number;
  pricing: { monthly: number; yearly: number };
  amenities: {
    lockers: boolean;
    sauna: boolean;
    coldPlunge: boolean;
    juiceBar: boolean;
    towelService: boolean;
    personalTraining: boolean;
  };
  notifications: {
    overduePaymentReminders: boolean;
    peakCapacityAlerts: boolean;
    dailyExecutiveDigest: boolean;
    instantOnboardingAlerts: boolean;
  };
  gateAccess: {
    qrScannerSensitivity: 'normal' | 'high' | 'instant';
    autoCheckoutHours: number;
    guestPassAllowed: boolean;
  };
  stripeMode: 'live' | 'test';
}

export const DEFAULT_ADMIN_PROFILE: AdminProfileSettings = {
  name: 'Alex Morgan',
  email: 'alex.morgan@ironcladgym.com',
  phone: '+1 (555) 789-0142',
  title: 'Director of Operations & Head Coach',
  gymBranch: 'Ironclad Athletic Lab - Downtown Flagship',
  bio: '',
  certifications: ['CSCS', 'NASM-CPT'],
  shiftHours: '06:00 AM - 02:00 PM',
  securityPin: '4829',
  twoFactorEnabled: true,
  emergencyContact: {
    name: '',
    phone: '',
    relation: '',
  },
};

export const DEFAULT_FACILITY_SETTINGS: FacilitySettings = {
  facilityName: 'Ironclad Athletic Lab - Downtown Flagship',
  facilityAddress: '400 Grand Ave, Suite 100, Austin, TX 78701',
  facilityPhone: '+1 (555) 800-4766',
  facilityEmail: 'operations@ironcladgym.com',
  operatingHours: '05:00 AM - 11:00 PM (Mon - Sun)',
  maxFloorCapacity: 50,
  peakOccupancyAlertThreshold: 85,
  currencySymbol: '৳',
  taxRatePercent: 8.25,
  pricing: { monthly: 700, yearly: 8000 },
  amenities: {
    lockers: true,
    sauna: true,
    coldPlunge: true,
    juiceBar: true,
    towelService: true,
    personalTraining: true,
  },
  notifications: {
    overduePaymentReminders: true,
    peakCapacityAlerts: true,
    dailyExecutiveDigest: true,
    instantOnboardingAlerts: true,
  },
  gateAccess: {
    qrScannerSensitivity: 'instant',
    autoCheckoutHours: 4,
    guestPassAllowed: true,
  },
  stripeMode: 'live',
};
