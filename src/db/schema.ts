import { sql } from "drizzle-orm"
import { boolean, date, doublePrecision, index, integer, jsonb, numeric, pgEnum, pgSchema, pgTable, text, timestamp, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core"

export const checkInMethod = pgEnum("check_in_method", ["qr", "manual", "pin"])
export const membershipStatus = pgEnum("membership_status", ["active", "expired", "suspended", "pending"])
export const membershipTier = pgEnum("membership_tier", ["basic", "standard", "premium"])
export const paymentMethod = pgEnum("payment_method", ["card", "cash", "online", "apple_pay", "google_pay"])
export const paymentStatus = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"])
export const userRole = pgEnum("user_role", ["member", "trainer", "admin"])
export const txCategory = pgEnum("tx_category", ["Monthly Fee", "Yearly Fee", "Admission Fee"]);

export const authSchema = pgSchema('auth');
export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});


export const adminProfiles = pgTable("admin_profiles", {
  id: uuid().primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
  pinCodeHash: text("pin_code_hash"),
  permissions: jsonb().default([]),
});

export const appSettings = pgTable("app_settings", {
  id: uuid().defaultRandom().primaryKey(),
  value: jsonb().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const attendanceLogs = pgTable("attendance_logs", {
  id: uuid().defaultRandom().primaryKey(),
  memberId: uuid("member_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  checkInTime: timestamp("check_in_time", { withTimezone: true }).default(sql`now()`).notNull(),
  checkOutTime: timestamp("check_out_time", { withTimezone: true }),
  method: checkInMethod().default("qr").notNull(),
  scannedBy: uuid("scanned_by").references(() => profiles.id),
}, (table) => [
  index("idx_attendance_member_time").using("btree", table.memberId.asc().nullsLast(), table.checkInTime.asc().nullsLast()),
]);

export const classBookings = pgTable("class_bookings", {
  id: uuid().defaultRandom().primaryKey(),
  classId: uuid("class_id").notNull().references(() => gymClasses.id, { onDelete: "cascade" }),
  memberId: uuid("member_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  bookedAt: timestamp("booked_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
  uniqueIndex("idx_booking_unique").using("btree", table.classId.asc().nullsLast(), table.memberId.asc().nullsLast()),
]);

export const dietPlans = pgTable("diet_plans", {
  id: uuid().defaultRandom().primaryKey(),
  memberId: uuid("member_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text().notNull(),
  assignedDate: date("assigned_date").default(sql`now()`).notNull(),
  meals: jsonb().default([]).notNull(),
  waterGoalMl: integer("water_goal_ml").default(3000).notNull(),
  notes: text(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
  index("idx_diet_member").using("btree", table.memberId.asc().nullsLast()),
]);

export const gymClasses = pgTable("gym_classes", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  description: text(),
  trainerId: uuid("trainer_id").references(() => profiles.id),
  date: date().notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  maxCapacity: integer("max_capacity").default(20).notNull(),
  enrolledCount: integer("enrolled_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
  index("idx_classes_date").using("btree", table.date.asc().nullsLast()),
]);

export const members = pgTable("members", {
  id: uuid().primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
  membershipTier: membershipTier("membership_tier").default("basic").notNull(),
  membershipStatus: membershipStatus("membership_status").default("pending").notNull(),
  startDate: date("start_date").default(sql`now()`).notNull(),
  expiryDate: date("expiry_date"),
  qrPassToken: uuid("qr_pass_token").defaultRandom().notNull(),
  pinCodeHash: text("pin_code_hash"),
  emergencyContact: jsonb("emergency_contact"),
  notes: text(),
  goal: text(),
  weightKg: doublePrecision("weight_kg"),
  heightCm: doublePrecision("height_cm"),
  attendanceGoalDays: integer("attendance_goal_days"),
  admissionFee: numeric("admission_fee", { precision: 10, scale: 2 }).default("0.00").notNull(),
}, (table) => [
  index("idx_members_status").using("btree", table.membershipStatus.asc().nullsLast()),
  unique("members_qr_pass_token_unique").on(table.qrPassToken),]);

export const profiles = pgTable("profiles", {
  id: uuid().defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text(),
  role: userRole().default("admin").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
}, (table) => [
  unique("profiles_user_id_unique").on(table.userId),
  uniqueIndex("idx_profiles_phone_member")
    .using("btree", table.phone.asc().nullsLast())
    .where(sql`role = 'member'`),
]);

export const transactions = pgTable("transactions", {
  id: uuid().defaultRandom().primaryKey(),
  memberId: uuid("member_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  category: txCategory().default("Monthly Fee").notNull(),
  currency: text().default("BDT").notNull(),
  status: paymentStatus().default("pending").notNull(),
  method: paymentMethod().default("card").notNull(),
  description: text(),
  invoiceUrl: text("invoice_url"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
  index("idx_transactions_member").using("btree", table.memberId.asc().nullsLast()),
]);

export const workoutPrograms = pgTable("workout_programs", {
  id: uuid().defaultRandom().primaryKey(),
  memberId: uuid("member_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text().notNull(),
  splitDay: text("split_day").notNull(),
  assignedDate: date("assigned_date").default(sql`now()`).notNull(),
  exercises: jsonb().default([]).notNull(),
  completed: boolean().default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
  splitSchedule: text("split_schedule"),
  notes: text(),
  assignedBy: text("assigned_by"),
}, (table) => [
  index("idx_workouts_member").using("btree", table.memberId.asc().nullsLast()),
]);
