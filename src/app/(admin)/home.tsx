import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
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
      <Box className="gap-5">
        {/* Executive Greeting */}
        <Box className="pb-3 border-b border-border">
          <Box className="flex-row items-center justify-between">
            <Box className="flex-1 pr-3">
              <Text className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                {greeting}
              </Text>
              <Text size="2xl" className="font-display font-black uppercase tracking-tight mt-0.5 leading-none">
                {adminName}
              </Text>
            </Box>
            <Box className="w-10 h-10 rounded-2xl bg-primary items-center justify-center">
              <Text className="font-display font-extrabold text-sm text-primary-foreground">
                {adminInitials}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Primary Metrics */}
        <Box className="flex-row gap-3">
          {/* Total Attendance of Today */}
          <Box className="flex-1 bg-card border border-border p-4 rounded-3xl">
            <Box className="flex-row items-center justify-between">
              <Box className="flex-1 pr-2">
                <Text size="xs" className="font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                  Today Attendance
                </Text>
              </Box>
              <Box className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center">
                <CheckCircle2 size={16} color="#C8F135" />
              </Box>
            </Box>
            <Box className="flex-row items-baseline gap-2 mt-2">
              <Text size="3xl" className="font-display font-black tracking-tight leading-none">
                {todayCheckIns}
              </Text>
              <Text size="xs" className="font-mono text-muted-foreground">
                checked-in
              </Text>
            </Box>
            <Box className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
              <Text size="xs" className="font-mono font-bold text-primary">
                ● Active Floor
              </Text>
              <Text size="xs" className="font-mono text-muted-foreground">
                {occupancyPercent}% Capacity
              </Text>
            </Box>
          </Box>

          {/* Monthly Active Subscription Amount */}
          <Box className="flex-1 bg-card border border-border p-4 rounded-3xl">
            <Box className="flex-row items-center justify-between">
              <Box className="flex-1 pr-2">
                <Text size="xs" className="font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                  Monthly Revenue
                </Text>
              </Box>
              <Box className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center">
                <DollarSign size={16} color="#C8F135" />
              </Box>
            </Box>
            <Box className="flex-row items-baseline gap-1 mt-2">
              <Text size="3xl" className="font-display font-black text-primary tracking-tight leading-none">
                $284,500
              </Text>
              <Text size="xs" className="font-mono text-muted-foreground">/ mo</Text>
            </Box>
            <Box className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
              <Text size="xs" className="font-mono font-bold text-primary">
                +12% MoM
              </Text>
              <Text size="xs" className="font-mono text-muted-foreground">
                {totalMembers} Subs
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Monthly Attendance Trend */}
        <Box className="bg-card border border-border p-5 rounded-3xl gap-4">
          <Box className="flex-row items-center justify-between gap-2">
            <Box className="flex-row items-center gap-2.5 flex-1">
              <Box className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 items-center justify-center">
                <TrendingUp size={16} color="#C8F135" />
              </Box>
              <Text size="lg" className="font-display font-black uppercase tracking-tight">
                Attendance Trend
              </Text>
            </Box>
            <Box className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl">
              <Text size="xs" className="font-mono font-bold text-primary">
                Avg 4,820 / Mo
              </Text>
            </Box>
          </Box>
          <Text size="xs" className="font-mono text-muted-foreground -mt-2">
            Total check-in volume and athlete engagement
          </Text>

          {/* Monthly Check-in Bars */}
          <Box className="flex-row items-end justify-between h-36 pt-4 px-2">
            {MONTHLY_TREND.map((item) => (
              <Box
                key={item.month}
                className="flex-1 items-center gap-2 h-full justify-end"
              >
                <Text size="xs" className="font-mono text-muted-foreground">
                  {(item.count / 1000).toFixed(1)}k
                </Text>
                <Box
                  className={`w-full max-w-[48px] rounded-t-lg ${
                    item.isCurrent ? 'bg-primary' : 'bg-border'
                  }`}
                  style={{ height: `${item.heightPercent}%` }}
                />
                <Text
                  size="xs"
                  className={`font-mono ${
                    item.isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {item.month}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Recent Audit Transactions + Quick Digest */}
        <Box className="flex-col gap-4">
          {/* Recent Audit Invoices */}
          <Box className="bg-card border border-border p-5 rounded-3xl gap-3">
            <Box className="flex-row items-center justify-between">
              <Text className="font-display font-bold text-sm uppercase tracking-wider">
                Audit Invoices
              </Text>
              <Button
                variant="link"
                size="sm"
                onPress={() => router.push('/(admin)/payments')}
              >
                <ButtonText className="text-[10px] font-mono text-primary">
                  View All ({MOCK_TRANSACTIONS.length})
                </ButtonText>
              </Button>
            </Box>

            <Box className="gap-1">
              {MOCK_TRANSACTIONS.map((t) => (
                <Box
                  key={t.id}
                  className="py-2.5 flex-row items-center justify-between"
                >
                  <Box>
                    <Box className="flex-row items-center gap-2">
                      <Text className="text-primary font-bold font-mono text-xs">
                        {t.invoiceNumber}
                      </Text>
                      <Text className="font-medium text-xs">
                        {t.memberName}
                      </Text>
                    </Box>
                    <Text size="xs" className="text-muted-foreground font-mono">
                      {t.tier} • {t.category}
                    </Text>
                  </Box>
                  <Box className="items-end">
                    <Text className="font-bold text-xs">
                      ${t.amount}.00
                    </Text>
                    <Text size="xs" className="text-muted-foreground font-mono">
                      {t.date}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Recent Athletes Onboarded */}
          <Box className="bg-card border border-border p-5 rounded-3xl gap-3">
            <Box className="flex-row items-center justify-between">
              <Text className="font-display font-bold text-sm uppercase tracking-wider">
                Athlete Onboarding
              </Text>
              <Button
                variant="link"
                size="sm"
                onPress={() => router.push('/(admin)/members')}
              >
                <ButtonText className="text-[10px] font-mono text-primary">
                  Directory ({MOCK_MEMBERS.length})
                </ButtonText>
              </Button>
            </Box>

            <Box className="gap-2">
              {MOCK_MEMBERS.map((member) => (
                <Button
                  key={member.id}
                  variant="outline"
                  onPress={() => router.push('/(admin)/members')}
                  className="bg-background border-border p-2.5 rounded-xl flex-row items-center justify-between"
                >
                  <Box className="flex-row items-center gap-2.5">
                    <Box className="w-8 h-8 rounded-lg bg-border items-center justify-center">
                      <Text className="font-mono font-bold text-xs">
                        {member.initials}
                      </Text>
                    </Box>
                    <Box>
                      <Text className="text-xs font-bold leading-tight">
                        {member.name}
                      </Text>
                      <Text size="xs" className="text-muted-foreground font-mono">
                        {member.tier} • {member.id}
                      </Text>
                    </Box>
                  </Box>

                  <Box className="flex-row items-center gap-2">
                    <Box
                      className={`px-2 py-0.5 rounded ${
                        member.status === 'active'
                          ? 'bg-primary/15 border border-primary/30'
                          : 'bg-destructive/15 border border-destructive/30'
                      }`}
                    >
                      <Text
                        size="xs"
                        className={`font-mono ${
                          member.status === 'active' ? 'text-primary' : 'text-destructive'
                        }`}
                      >
                        {member.status === 'active' ? 'Active' : 'Pending'}
                      </Text>
                    </Box>
                    <ChevronRight size={14} color="#666675" />
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}
