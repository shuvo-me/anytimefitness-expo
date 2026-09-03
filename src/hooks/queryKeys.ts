export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
    profile: (userId: string) => ['auth', 'profile', userId] as const,
  },
  members: {
    all: ['members'] as const,
    detail: (id: string) => ['members', id] as const,
    filtered: (filters: Record<string, unknown>) => ['members', filters] as const,
  },
  attendance: {
    occupancy: ['attendance', 'occupancy'] as const,
    recent: ['attendance', 'recent'] as const,
  },
  classes: {
    all: (date: string) => ['classes', date] as const,
    bookings: (classId: string) => ['classes', 'bookings', classId] as const,
  },
  workouts: {
    all: (memberId: string) => ['workouts', memberId] as const,
  },
  workoutPrograms: {
    byMember: (memberId: string) => ['workout-programs', memberId] as const,
  },
  diet: {
    all: (memberId: string) => ['diet', memberId] as const,
  },
  payments: {
    all: (memberId: string) => ['payments', memberId] as const,
  },
  settings: {
    adminProfile: ['settings', 'adminProfile'] as const,
    facility: ['settings', 'facility'] as const,
  },
} as const;
