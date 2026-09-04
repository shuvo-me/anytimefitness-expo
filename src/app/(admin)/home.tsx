import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'expo-router';
import {
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ChevronRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAdminProfileSettings, useFacilitySettings } from '@/hooks/useSettings';
import { useMembers } from '@/hooks/useMembers';
import { useTransactions, useMonthlyRevenue } from '@/hooks/usePayments';
import {
  useCurrentOccupancy,
  useTodayCheckIns,
  useMonthlyCheckInTrend,
} from '@/hooks/useAttendance';

export default function AdminHome() {
  const router = useRouter();
  const { data: profileData } = useAdminProfileSettings();
  const { data: facilityData } = useFacilitySettings();
  const { data: members = [] } = useMembers();
  const { data: transactions = [] } = useTransactions();
  const { data: monthlyRevenue = 0 } = useMonthlyRevenue();
  const { data: occupancy = 0 } = useCurrentOccupancy();
  const { data: todayCheckIns = 0 } = useTodayCheckIns();
  const { data: trend = [] } = useMonthlyCheckInTrend();
  const inset = useSafeAreaInsets();

  const adminName = profileData?.name ?? 'Alex Morgan';
  const maxCapacity = facilityData?.maxFloorCapacity ?? 120;
  const symbol = facilityData?.currencySymbol ?? '৳';

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

  const totalSubs = members.length;
  const activeSubs = members.filter((m) => m.status === 'active').length;
  const occupancyPercent = maxCapacity > 0 ? Math.round((occupancy / maxCapacity) * 100) : 0;

  const recentTransactions = transactions.slice(0, 4);
  const recentMembers = members.slice(0, 4);

  const initialsOf = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() ?? '')
      .join('');

  const avgPerMonth =
    trend.length > 0
      ? Math.round(trend.reduce((sum, p) => sum + p.count, 0) / trend.length)
      : 0;
  const maxTrendCount = trend.reduce((max, p) => Math.max(max, p.count), 0) || 1;

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
            <Button
              onPress={() => router.push('/(admin)/settings')}
              className="w-10 h-10 rounded-2xl bg-primary items-center justify-center"
            >
              <Text className="font-display font-extrabold text-sm text-primary-foreground">
                {adminInitials}
              </Text>
            </Button>
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
                ● Active Floor · {occupancy}
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
                {symbol}{monthlyRevenue.toLocaleString()}
              </Text>
              <Text size="xs" className="font-mono text-muted-foreground">/ mo</Text>
            </Box>
            <Box className="mt-3 pt-3 border-t border-border flex-row items-center justify-between">
              <Text size="xs" className="font-mono font-bold text-primary">
                {activeSubs} Active
              </Text>
              <Text size="xs" className="font-mono text-muted-foreground">
                {totalSubs} Subs
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
                Avg {avgPerMonth.toLocaleString()} / Mo
              </Text>
            </Box>
          </Box>
          <Text size="xs" className="font-mono text-muted-foreground -mt-2">
            Total check-in volume and athlete engagement
          </Text>

          {/* Monthly Check-in Bars */}
          {trend.length > 0 ? (
            <Box className="flex-row items-end justify-between h-36 pt-4 px-2">
              {trend.map((item) => {
                const heightPercent = Math.max(
                  4,
                  Math.round((item.count / maxTrendCount) * 100),
                );
                return (
                  <Box
                    key={item.key}
                    className="flex-1 items-center gap-2 h-full justify-end"
                  >
                    <Text size="xs" className="font-mono text-muted-foreground">
                      {item.count.toLocaleString()}
                    </Text>
                    <Box
                      className={`w-full max-w-[48px] rounded-t-lg ${
                        item.isCurrent ? 'bg-primary' : 'bg-border'
                      }`}
                      style={{ height: `${heightPercent}%` }}
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
                );
              })}
            </Box>
          ) : (
            <Box className="h-36 items-center justify-center">
              <Spinner size="small" color="#C8F135" />
            </Box>
          )}
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
                  View All ({transactions.length})
                </ButtonText>
              </Button>
            </Box>

            <Box className="gap-1">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((t) => (
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
                        {symbol}{t.amount.toLocaleString()}
                      </Text>
                      <Text size="xs" className="text-muted-foreground font-mono">
                        {t.date}
                      </Text>
                    </Box>
                  </Box>
                ))
              ) : (
                <Text size="xs" className="font-mono text-muted-foreground py-3">
                  No transactions yet.
                </Text>
              )}
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
                  Directory ({members.length})
                </ButtonText>
              </Button>
            </Box>

            <Box className="gap-2">
              {recentMembers.length > 0 ? (
                recentMembers.map((member) => {
                  const isActive = member.status === 'active';
                  return (
                    <Button
                      key={member.id}
                      variant="outline"
                      onPress={() => router.push('/(admin)/members')}
                      className="bg-background border-border p-2.5 rounded-xl flex-row items-center justify-between"
                    >
                      <Box className="flex-row items-center gap-2.5">
                        <Box className="w-8 h-8 rounded-lg bg-border items-center justify-center">
                          <Text className="font-mono font-bold text-xs">
                            {initialsOf(member.name)}
                          </Text>
                        </Box>
                        <Box>
                          <Text className="text-xs font-bold leading-tight">
                            {member.name}
                          </Text>
                          <Text size="xs" className="text-muted-foreground font-mono">
                            {member.tier} • {member.displayId}
                          </Text>
                        </Box>
                      </Box>

                      <Box className="flex-row items-center gap-2">
                        <Box
                          className={`px-2 py-0.5 rounded ${
                            isActive
                              ? 'bg-primary/15 border border-primary/30'
                              : 'bg-destructive/15 border border-destructive/30'
                          }`}
                        >
                          <Text
                            size="xs"
                            className={`font-mono ${
                              isActive ? 'text-primary' : 'text-destructive'
                            }`}
                          >
                            {isActive ? 'Active' : member.status}
                          </Text>
                        </Box>
                        <ChevronRight size={14} color="#666675" />
                      </Box>
                    </Button>
                  );
                })
              ) : (
                <Text size="xs" className="font-mono text-muted-foreground py-3">
                  No members onboarded yet.
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
}
