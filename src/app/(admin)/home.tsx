import { ScrollView, Text, TouchableOpacity, View } from '@/tw';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ChevronRight,
} from 'lucide-react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdminProfileSettings, useFacilitySettings } from '@/hooks/useSettings';

type MemberStatus = 'active' | 'pending';

const MOCK_MEMBERS: {
  id: string;
  name: string;
  initials: string;
  tier: string;
  status: MemberStatus;
}[] = [
  { id: 'M-1001', name: 'Sarah Johnson', initials: 'SJ', tier: 'Premium', status: 'active' },
  { id: 'M-1002', name: 'Mike Chen', initials: 'MC', tier: 'Standard', status: 'active' },
  { id: 'M-1003', name: 'Emma Davis', initials: 'ED', tier: 'Basic', status: 'pending' },
  { id: 'M-1004', name: 'David Kim', initials: 'DK', tier: 'VIP Elite', status: 'active' },
];

const MOCK_TRANSACTIONS: {
  id: number;
  invoiceNumber: string;
  memberName: string;
  tier: string;
  amount: number;
  category: string;
  date: string;
}[] = [
  { id: 1, invoiceNumber: 'INV-2041', memberName: 'Sarah Johnson', tier: 'Premium', amount: 99, category: 'Membership', date: 'Mar 14' },
  { id: 2, invoiceNumber: 'INV-2040', memberName: 'Mike Chen', tier: 'Standard', amount: 59, category: 'Membership', date: 'Mar 13' },
  { id: 3, invoiceNumber: 'INV-2039', memberName: 'Emma Davis', tier: 'Basic', amount: 45, category: 'Personal Training', date: 'Mar 12' },
  { id: 4, invoiceNumber: 'INV-2038', memberName: 'David Kim', tier: 'VIP Elite', amount: 149, category: 'Membership', date: 'Mar 11' },
];

const MONTHLY_TREND: {
  month: string;
  count: number;
  heightPercent: number;
  isCurrent?: boolean;
}[] = [
  { month: 'Oct', count: 4210, heightPercent: 68 },
  { month: 'Nov', count: 4450, heightPercent: 72 },
  { month: 'Dec', count: 4120, heightPercent: 65 },
  { month: 'Jan', count: 5340, heightPercent: 92 },
  { month: 'Feb', count: 4980, heightPercent: 82 },
  { month: 'Mar', count: 5620, heightPercent: 98, isCurrent: true },
];

export default function AdminHome() {
  const router = useRouter();
  const { data: profileData } = useAdminProfileSettings();
  const { data: facilityData } = useFacilitySettings();
  const inset = useSafeAreaInsets();

  const adminName = profileData?.name ?? 'Alex Morgan';
  const maxCapacity = facilityData?.maxFloorCapacity ?? 120;

  const adminInitials =
    adminName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AM';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const [currentCount] = useState(47);
  const totalMembers = MOCK_MEMBERS.length + 242;
  const todayCheckIns = MOCK_MEMBERS.length + 13;
  const occupancyPercent = Math.round((currentCount / maxCapacity) * 100);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          backgroundColor: '#0C0C0F',
          paddingTop: inset.top + 16,
          paddingBottom: inset.bottom + 24,
          flexGrow: 1,
        }}
      >
        <View className="gap-5">
          {/* Executive Greeting */}
          <View className="pb-3 border-b border-border-subtle">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
                  {greeting}
                </Text>
                <Text className="font-display font-black text-2xl uppercase tracking-tight text-white mt-0.5 leading-none">
                  {adminName}
                </Text>
              </View>
              <View className="w-10 h-10 rounded-2xl bg-lime-accent items-center justify-center">
                <Text className="font-display font-extrabold text-sm text-black">
                  {adminInitials}
                </Text>
              </View>
            </View>
          </View>

          {/* Primary Metrics */}
          <View className="flex-row gap-3">
            {/* Total Attendance of Today */}
            <View className="flex-1 bg-card border border-border-subtle p-4 rounded-3xl">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
                    Today Attendance
                  </Text>
                </View>
                <View className="w-8 h-8 rounded-xl bg-lime-accent/15 border border-lime-accent/30 items-center justify-center">
                  <CheckCircle2 size={16} color="#C8F135" />
                </View>
              </View>
              <View className="flex-row items-baseline gap-2 mt-2">
                <Text className="font-display font-black text-3xl text-white tracking-tight leading-none">
                  {todayCheckIns}
                </Text>
                <Text className="text-[10px] font-mono text-text-muted">
                  checked-in
                </Text>
              </View>
              <View className="mt-3 pt-3 border-t border-border-subtle flex-row items-center justify-between">
                <Text className="text-[10px] font-mono text-lime-accent font-bold">
                  ● Active Floor
                </Text>
                <Text className="text-[10px] font-mono text-text-muted">
                  {occupancyPercent}% Capacity
                </Text>
              </View>
            </View>

            {/* Monthly Active Subscription Amount */}
            <View className="flex-1 bg-card border border-border-subtle p-4 rounded-3xl">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-[10px] font-mono text-text-muted uppercase tracking-wider font-semibold">
                    Monthly Revenue
                  </Text>
                </View>
                <View className="w-8 h-8 rounded-xl bg-lime-accent/15 border border-lime-accent/30 items-center justify-center">
                  <DollarSign size={16} color="#C8F135" />
                </View>
              </View>
              <View className="flex-row items-baseline gap-1 mt-2">
                <Text className="font-display font-black text-3xl text-lime-accent tracking-tight leading-none">
                  $284,500
                </Text>
                <Text className="text-[10px] font-mono text-text-muted">/ mo</Text>
              </View>
              <View className="mt-3 pt-3 border-t border-border-subtle flex-row items-center justify-between">
                <Text className="text-[10px] font-mono text-lime-accent font-bold">
                  +12% MoM
                </Text>
                <Text className="text-[10px] font-mono text-text-muted">
                  {totalMembers} Subs
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly Attendance Trend */}
          <View className="bg-card border border-border-subtle p-5 rounded-3xl gap-4">
            <View className="flex-row items-center justify-between gap-2">
              <View className="flex-row items-center gap-2.5 flex-1">
                <View className="w-8 h-8 rounded-xl bg-lime-accent/15 border border-lime-accent/30 items-center justify-center">
                  <TrendingUp size={16} color="#C8F135" />
                </View>
                <Text className="font-display font-black text-lg uppercase tracking-tight text-white">
                  Attendance Trend
                </Text>
              </View>
              <View className="bg-lime-accent/10 border border-lime-accent/20 px-3 py-1 rounded-xl">
                <Text className="text-xs font-mono text-lime-accent font-bold">
                  Avg 4,820 / Mo
                </Text>
              </View>
            </View>
            <Text className="text-xs font-mono text-text-muted -mt-2">
              Total check-in volume and athlete engagement
            </Text>

            {/* Monthly Check-in Bars */}
            <View className="flex-row items-end justify-between h-36 pt-4 px-2">
              {MONTHLY_TREND.map((item) => (
                <View
                  key={item.month}
                  className="flex-1 items-center gap-2 h-full justify-end"
                >
                  <Text className="text-[11px] font-mono text-text-muted">
                    {(item.count / 1000).toFixed(1)}k
                  </Text>
                  <View
                    className={`w-full max-w-[48px] rounded-t-lg ${
                      item.isCurrent ? 'bg-lime-accent' : 'bg-border-subtle'
                    }`}
                    style={{ height: `${item.heightPercent}%` }}
                  />
                  <Text
                    className={`text-xs font-mono ${
                      item.isCurrent ? 'text-lime-accent font-bold' : 'text-text-muted'
                    }`}
                  >
                    {item.month}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Audit Transactions + Quick Digest */}
          <View className="flex-col gap-4">
            {/* Recent Audit Invoices */}
            <View className="bg-card border border-border-subtle p-5 rounded-3xl gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-display font-bold text-sm uppercase tracking-wider text-white">
                  Audit Invoices
                </Text>
                <TouchableOpacity onPress={() => router.push('/(admin)/schedule')} activeOpacity={0.7}>
                  <Text className="text-[10px] font-mono text-lime-accent">
                    View All ({MOCK_TRANSACTIONS.length})
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="gap-1">
                {MOCK_TRANSACTIONS.map((t) => (
                  <View
                    key={t.id}
                    className="py-2.5 flex-row items-center justify-between"
                  >
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-lime-accent font-bold font-mono text-xs">
                          {t.invoiceNumber}
                        </Text>
                        <Text className="text-white font-medium text-xs">
                          {t.memberName}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-text-muted font-mono">
                        {t.tier} • {t.category}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-white font-bold text-xs">
                        ${t.amount}.00
                      </Text>
                      <Text className="text-[10px] text-text-muted font-mono">
                        {t.date}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Athletes Onboarded */}
            <View className="bg-card border border-border-subtle p-5 rounded-3xl gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-display font-bold text-sm uppercase tracking-wider text-white">
                  Athlete Onboarding
                </Text>
                <TouchableOpacity onPress={() => router.push('/(admin)/members')} activeOpacity={0.7}>
                  <Text className="text-[10px] font-mono text-lime-accent">
                    Directory ({MOCK_MEMBERS.length})
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="gap-2">
                {MOCK_MEMBERS.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => router.push('/(admin)/members')}
                    activeOpacity={0.7}
                    className="bg-background border border-border-subtle p-2.5 rounded-xl flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-8 h-8 rounded-lg bg-border-subtle items-center justify-center border border-[#2A2A38]">
                        <Text className="font-mono font-bold text-xs text-white">
                          {member.initials}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs font-bold text-white leading-tight">
                          {member.name}
                        </Text>
                        <Text className="text-[10px] text-text-muted font-mono">
                          {member.tier} • {member.id}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <View
                        className={`px-2 py-0.5 rounded ${
                          member.status === 'active'
                            ? 'bg-lime-accent/15 border border-lime-accent/30'
                            : 'bg-alert-red/15 border border-alert-red/30'
                        }`}
                      >
                        <Text
                          className={`text-[10px] font-mono ${
                            member.status === 'active'
                              ? 'text-lime-accent'
                              : 'text-alert-red'
                          }`}
                        >
                          {member.status === 'active' ? 'Active' : 'Pending'}
                        </Text>
                      </View>
                      <ChevronRight size={14} color="#666675" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
