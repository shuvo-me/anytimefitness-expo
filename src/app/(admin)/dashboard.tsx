import { ScrollView, Text, TouchableOpacity, View } from "@/tw";
import { useRouter } from "expo-router";
import { Activity, ArrowUpRight, Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    tier: "Premium",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Mike Chen",
    initials: "MC",
    tier: "Standard",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Emma Davis",
    initials: "ED",
    tier: "Basic",
    status: "expired" as const,
  },
];

const WEEKLY_ACTIVITY = [
  { day: "Mon", percentage: 65, isToday: false },
  { day: "Tue", percentage: 78, isToday: false },
  { day: "Wed", percentage: 92, isToday: true },
  { day: "Thu", percentage: 71, isToday: false },
  { day: "Fri", percentage: 88, isToday: false },
  { day: "Sat", percentage: 45, isToday: false },
  { day: "Sun", percentage: 30, isToday: false },
];

const MAX_CAPACITY = 120;

export default function AdminDashboard() {
  const router = useRouter();
  const [currentCount, setCurrentCount] = useState(47);
  const [totalRevenue] = useState(284500);
  const [revenueGrowth] = useState(12);
  const totalMembers = MOCK_MEMBERS.length + 242;
  const todayCheckIns = 18;
  const occupancyPercent = Math.round((currentCount / MAX_CAPACITY) * 100);
  const inset = useSafeAreaInsets();

  return (
    <>
      {/* <StatusBar /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          backgroundColor: "#0C0C0F",
          paddingTop: inset.top + 16,
          paddingBottom: inset.bottom + 16,
          flexGrow: 1,
        }}
      >
        <View className="gap-6 flex-1 ">
          {/* Top Greeting Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-mono text-text-muted uppercase tracking-wider">
                Good morning,
              </Text>
              <Text className="font-display text-2xl font-extrabold uppercase tracking-tight text-white mt-0.5 leading-none">
                ALEX MORGAN
              </Text>
            </View>
            <View className="w-10 h-10 rounded-2xl bg-lime-accent items-center justify-center">
              <Text className="font-display text-sm font-extrabold text-black">
                AM
              </Text>
            </View>
          </View>

          {/* 3 Metric Cards */}
          <View className="flex-row gap-2.5">
            <View className="flex-1 bg-card border border-border-subtle p-3.5 rounded-2xl">
              <Text className="font-display text-2xl font-extrabold text-white leading-none">
                {totalMembers}
              </Text>
              <Text className="text-[10px] font-mono text-text-muted mt-1.5 uppercase">
                Members
              </Text>
            </View>

            <View className="flex-1 bg-card border border-border-subtle p-3.5 rounded-2xl">
              <Text className="font-display text-2xl font-extrabold text-white leading-none">
                {todayCheckIns}
              </Text>
              <Text className="text-[10px] font-mono text-text-muted mt-1.5 uppercase">
                Today
              </Text>
            </View>

            <View className="flex-1 bg-card border border-border-subtle p-3.5 rounded-2xl">
              <Text className="font-display text-2xl font-extrabold text-lime-accent leading-none">
                94%
              </Text>
              <Text className="text-[10px] font-mono text-text-muted mt-1.5 uppercase">
                Attend.
              </Text>
            </View>
          </View>

          {/* Live Gym Occupancy */}
          <View className="bg-card border border-border-subtle p-4 rounded-2xl">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-1.5">
                <Activity size={14} color="#C8F135" />
                <Text className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                  Gym Occupancy Rate
                </Text>
              </View>
              <Text className="text-xs font-mono text-lime-accent font-bold">
                {currentCount}/{MAX_CAPACITY} CAPACITY
              </Text>
            </View>

            <View className="flex-row items-baseline gap-2">
              <Text className="font-display text-4xl font-extrabold text-lime-accent leading-none">
                {occupancyPercent}%
              </Text>
              <Text className="text-xs text-text-muted font-mono">
                ({currentCount} Athletes On-Floor)
              </Text>
            </View>

            {/* Progress bar */}
            <View className="w-full bg-background h-2 rounded-full mt-3 overflow-hidden border border-border-subtle">
              <View
                className="h-full bg-lime-accent rounded-full"
                style={{ width: `${occupancyPercent}%` }}
              />
            </View>

            {/* Manual Gate Override */}
            <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-border-subtle">
              <Text className="text-[11px] text-text-muted font-mono">
                Manual Gate Override:
              </Text>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => setCurrentCount((c) => Math.max(0, c - 1))}
                  activeOpacity={0.7}
                  className="w-7 h-7 rounded-lg bg-border-subtle items-center justify-center"
                >
                  <Minus size={14} color="#FFFFFF" />
                </TouchableOpacity>

                <Text className="font-mono font-bold text-white px-1">
                  {currentCount}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setCurrentCount((c) => Math.min(MAX_CAPACITY, c + 1))
                  }
                  activeOpacity={0.7}
                  className="w-7 h-7 rounded-lg bg-lime-accent items-center justify-center"
                >
                  <Plus size={14} color="#000000" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Monthly Revenue */}
          <View className="bg-card border border-border-subtle p-4 rounded-2xl">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                Total Monthly Revenue
              </Text>
              <View className="bg-lime-accent/15 border border-lime-accent/30 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-mono text-lime-accent font-bold">
                  +{revenueGrowth}% vs last mo
                </Text>
              </View>
            </View>

            <View>
              <Text className="font-display text-3xl font-extrabold text-lime-accent leading-none">
                ${totalRevenue.toLocaleString()}.00
              </Text>
              <Text className="text-[11px] text-text-muted font-mono mt-1">
                Active subscriptions & personal training billings
              </Text>
            </View>

            <View className="mt-4 pt-3 border-t border-border-subtle flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.push("/(admin)/payments")}
                activeOpacity={0.7}
                className="flex-row items-center gap-1"
              >
                <Text className="text-xs font-mono text-lime-accent underline">
                  View Full Payment Hub
                </Text>
                <ArrowUpRight size={14} color="#C8F135" />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-[11px] font-mono text-text-muted">
                  Export Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekly Activity Bar Chart */}
          <View className="bg-card border border-border-subtle p-4 rounded-2xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[10px] font-mono text-text-muted uppercase tracking-widest font-bold">
                Weekly Activity
              </Text>
              <Text className="text-[10px] font-mono text-lime-accent">
                PEAK: WED & FRI
              </Text>
            </View>

            <View className="flex-row items-end justify-between h-28 pt-2 px-1">
              {WEEKLY_ACTIVITY.map((item, index) => (
                <View
                  key={index}
                  className="flex-1 items-center gap-2 h-full justify-end"
                >
                  <View
                    className={`w-full max-w-[24px] rounded-t-md ${
                      item.isToday ? "bg-lime-accent" : "bg-border-subtle"
                    }`}
                    style={{ height: `${item.percentage}%` }}
                  />
                  <Text
                    className={`text-[11px] font-mono ${
                      item.isToday
                        ? "text-lime-accent font-bold"
                        : "text-text-muted"
                    }`}
                  >
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Onboarding */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-mono text-text-muted uppercase tracking-widest font-bold">
                Recent Onboarding
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(admin)/members")}
                activeOpacity={0.7}
              >
                <Text className="text-[10px] font-mono text-lime-accent underline">
                  View All ({MOCK_MEMBERS.length})
                </Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {MOCK_MEMBERS.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => router.push("/(admin)/members")}
                  activeOpacity={0.8}
                  className="bg-card border border-border-subtle p-3 rounded-xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-xl bg-border-subtle items-center justify-center">
                      <Text className="font-mono font-bold text-xs text-white">
                        {member.initials}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-white leading-tight">
                        {member.name}
                      </Text>
                      <Text className="text-[11px] text-text-muted font-mono">
                        {member.tier} •{" "}
                        {member.status === "active" ? "Paid" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <Text
                    className={`text-[10px] font-mono font-bold ${
                      member.status === "active"
                        ? "text-lime-accent"
                        : "text-alert-red"
                    }`}
                  >
                    {member.status === "active" ? "08:42 AM" : "07:15 AM"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
