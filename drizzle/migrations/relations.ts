import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	adminProfiles: {
		profile: r.one.profiles({
			from: r.adminProfiles.id,
			to: r.profiles.id
		}),
	},
	profiles: {
		adminProfiles: r.many.adminProfiles(),
		gymClassesViaClassBookings: r.many.gymClasses({
			alias: "gymClasses_id_profiles_id_via_classBookings"
		}),
		dietPlans: r.many.dietPlans(),
		gymClassesTrainerId: r.many.gymClasses({
			alias: "gymClasses_trainerId_profiles_id"
		}),
		members: r.many.members(),
		usersInAuth: r.one.usersInAuth({
			from: r.profiles.userId,
			to: r.usersInAuth.id
		}),
		transactions: r.many.transactions(),
		workoutPrograms: r.many.workoutPrograms(),
	},
	gymClasses: {
		profiles: r.many.profiles({
			from: r.gymClasses.id.through(r.classBookings.classId),
			to: r.profiles.id.through(r.classBookings.memberId),
			alias: "gymClasses_id_profiles_id_via_classBookings"
		}),
		profile: r.one.profiles({
			from: r.gymClasses.trainerId,
			to: r.profiles.id,
			alias: "gymClasses_trainerId_profiles_id"
		}),
	},
	dietPlans: {
		profile: r.one.profiles({
			from: r.dietPlans.memberId,
			to: r.profiles.id
		}),
	},
	members: {
		profile: r.one.profiles({
			from: r.members.id,
			to: r.profiles.id
		}),
	},
	usersInAuth: {
		profiles: r.many.profiles(),
	},
	transactions: {
		profile: r.one.profiles({
			from: r.transactions.memberId,
			to: r.profiles.id
		}),
	},
	workoutPrograms: {
		profile: r.one.profiles({
			from: r.workoutPrograms.memberId,
			to: r.profiles.id
		}),
	},
}))