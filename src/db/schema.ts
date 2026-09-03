import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import type {
  AdminProfileSettings,
  FacilitySettings,
} from '@/types/admin';

/* ── Enums ─────────────────────────────────────────────────────────── */

export const userRole = pgEnum('user_role', ['member', 'trainer', 'admin']);

export const membershipTier = pgEnum('membership_tier', [
  'basic',
  'standard',
  'premium',
]);

export const membershipStatus = pgEnum('membership_status', [
  'active',
  'expired',
  'suspended',
  'pending',
]);

export const paymentStatus = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const paymentMethod = pgEnum('payment_method', [
  'card',
  'cash',
  'online',
  'apple_pay',
  'google_pay',
]);

export const checkInMethod = pgEnum('check_in_method', [
  'qr',
  'manual',
  'pin',
]);

const authSchema = pgSchema('auth');

/* ── Tables ────────────────────────────────────────────────────────── */

// 1. profiles

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').unique().references(() => authSchema.table('users', {
    id: uuid('id').primaryKey(),
  }).id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  phone: text('phone'),
  role: userRole('role').notNull().default('admin'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 2. admin_profiles
export const adminProfiles = pgTable('admin_profiles', {
  id: uuid('id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  pinCodeHash: text('pin_code_hash'),
  permissions: jsonb('permissions').$type<string[]>().default([]),
});

// 3. members
export const members = pgTable('members', {
  id: uuid('id').primaryKey().references(() => profiles.id, { onDelete: 'cascade' }),
  membershipTier: membershipTier('membership_tier').notNull().default('basic'),
  membershipStatus: membershipStatus('membership_status').notNull().default('pending'),
  startDate: date('start_date').notNull().defaultNow(),
  expiryDate: date('expiry_date'),
  qrPassToken: uuid('qr_pass_token').notNull().defaultRandom().unique(),
  emergencyContact: jsonb('emergency_contact').$type<{
    name: string;
    phone: string;
    relation: string;
  }>(),
  goal: text('goal'),
  weightKg: doublePrecision('weight_kg'),
  heightCm: doublePrecision('height_cm'),
  attendanceGoalDays: integer('attendance_goal_days'),
  notes: text('notes'),
}, (table) => [
  index('idx_members_status').on(table.membershipStatus),
]);

// 4. attendance_logs
export const attendanceLogs = pgTable('attendance_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  checkInTime: timestamp('check_in_time', { withTimezone: true }).notNull().defaultNow(),
  checkOutTime: timestamp('check_out_time', { withTimezone: true }),
  method: checkInMethod('method').notNull().default('qr'),
  scannedBy: uuid('scanned_by').references(() => profiles.id),
}, (table) => [
  index('idx_attendance_member_time').on(table.memberId, table.checkInTime),
]);

// 5. transactions
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('BDT'),
  status: paymentStatus('status').notNull().default('pending'),
  method: paymentMethod('method').notNull().default('card'),
  description: text('description'),
  invoiceUrl: text('invoice_url'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_transactions_member').on(table.memberId),
]);

// 6. gym_classes
export const gymClasses = pgTable('gym_classes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  trainerId: uuid('trainer_id').references(() => profiles.id),
  date: date('date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  maxCapacity: integer('max_capacity').notNull().default(20),
  enrolledCount: integer('enrolled_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_classes_date').on(table.date),
]);

// 7. class_bookings
export const classBookings = pgTable('class_bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  classId: uuid('class_id').notNull().references(() => gymClasses.id, { onDelete: 'cascade' }),
  memberId: uuid('member_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  bookedAt: timestamp('booked_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('idx_booking_unique').on(table.classId, table.memberId),
]);

// 8. workout_programs
export const workoutPrograms = pgTable('workout_programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  splitDay: text('split_day').notNull(),
  splitSchedule: text('split_schedule'),
  notes: text('notes'),
  assignedBy: text('assigned_by'),
  assignedDate: date('assigned_date').notNull().defaultNow(),
  exercises: jsonb('exercises').$type<ExerciseEntry[]>().notNull().default([]),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_workouts_member').on(table.memberId),
]);

// 9. diet_plans
export const dietPlans = pgTable('diet_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  memberId: uuid('member_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  assignedDate: date('assigned_date').notNull().defaultNow(),
  meals: jsonb('meals').$type<MealEntry[]>().notNull().default([]),
  waterGoalMl: integer('water_goal_ml').notNull().default(3000),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('idx_diet_member').on(table.memberId),
]);

// 10. admin_settings
export const appSettings = pgTable('admin_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  value: jsonb('value').$type<AppSettingsValue>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/* ── JSON payload types ─────────────────────────────────────────────── */

export interface ExerciseEntry {
  id?: string;
  name: string;
  targetMuscle?: string;
  sets: number;
  reps: string;
  targetWeightKg?: number;
  completedSets?: boolean[];
  instructions?: string;
  weight?: string;
  restSec?: number;
  completed?: boolean;
}

export interface MealEntry {
  label: string;
  time: string;
  items: string[];
  calories?: number;
  proteinG?: number;
  carbG?: number;
  fatG?: number;
}

export interface AppSettingsValue {
  facility: FacilitySettings;
  admin: AdminProfileSettings;
}

/* ── Inferred types ────────────────────────────────────────────────── */

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type AttendanceLog = typeof attendanceLogs.$inferSelect;
export type NewAttendanceLog = typeof attendanceLogs.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type GymClass = typeof gymClasses.$inferSelect;
export type NewGymClass = typeof gymClasses.$inferInsert;

export type ClassBooking = typeof classBookings.$inferSelect;
export type NewClassBooking = typeof classBookings.$inferInsert;

export type WorkoutProgram = typeof workoutPrograms.$inferSelect;
export type NewWorkoutProgram = typeof workoutPrograms.$inferInsert;

export type DietPlan = typeof dietPlans.$inferSelect;
export type NewDietPlan = typeof dietPlans.$inferInsert;

export type AppSettings = typeof appSettings.$inferSelect;
export type NewAppSettings = typeof appSettings.$inferInsert;
