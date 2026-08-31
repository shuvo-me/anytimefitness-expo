import { Box } from '@/components/ui/box';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Search, UserPlus, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_MEMBERS } from '@/types/member';
import type { Member } from '@/types/member';

const STATUS_FILTERS = ['All', 'Active', 'Expired', 'Pending'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function MembersList() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const filteredMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return MOCK_MEMBERS.filter((member) => {
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.id.toLowerCase().includes(q) ||
        member.tier.toLowerCase().includes(q);

      if (statusFilter === 'All') return matchesSearch;
      return matchesSearch && member.status === statusFilter.toLowerCase();
    });
  }, [searchTerm, statusFilter]);

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
        <Box className="gap-5">
          {/* Header */}
          <Box className="flex-row items-center justify-between">
            <Box className="flex-1 pr-3">
              <Text className="font-display font-black text-3xl uppercase tracking-tight text-foreground leading-none">
                Members
              </Text>
              <Text className="text-xs font-mono text-muted-foreground mt-1">
                Total Enrolled:{' '}
                <Text className="text-primary font-bold">
                  {MOCK_MEMBERS.length} Athletes
                </Text>
              </Text>
            </Box>
            <Button
              onPress={() => router.push('/(admin)/members/onboard')}

              className="bg-primary px-3.5 py-2 rounded-xl flex-row items-center gap-1.5"
            >
              <ButtonIcon as={UserPlus} />
              <ButtonText className="font-display font-bold text-xs uppercase tracking-wider text-primary-foreground">
                + Add Member
              </ButtonText>
            </Button>
          </Box>

          {/* Search */}
          <Input className="w-full bg-card border-border rounded-xl pr-3 py-1.5">
            <InputSlot>
              <InputIcon as={Search} className="text-muted-foreground w-3.5 h-3.5" />
            </InputSlot>
            <InputField
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search members..."
              placeholderTextColor="#555566"
              className="w-full text-xs text-foreground font-mono"
            />
          </Input>

          {/* Filter Tabs */}
          <Box className="flex-row items-center gap-2">
            {STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter;
              return (
                <Button
                  key={filter}
                  onPress={() => setStatusFilter(filter)}

                  className={`px-4 py-1.5 rounded-full ${
                    isActive
                      ? 'bg-primary'
                      : 'bg-card border border-border-subtle'
                  }`}
                >
                  <ButtonText
                    className={`text-xs font-bold font-sans uppercase tracking-wider ${
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {filter}
                  </ButtonText>
                </Button>
              );
            })}
          </Box>

          {/* Members List */}
          <Box className="gap-2.5">
            {filteredMembers.length === 0 ? (
              <Box className="p-8 items-center bg-card border border-border-subtle rounded-2xl">
                <Text className="text-sm text-muted-foreground font-mono text-center">
                  {searchTerm.trim()
                    ? `No members found matching "${searchTerm}"`
                    : 'No members in this status'}
                </Text>
              </Box>
            ) : (
              filteredMembers.map((member) => {
                const isExpired = member.status === 'expired';
                const isPending = member.status === 'pending';
                return (
                  <Row
                    key={member.id}
                    member={member}
                    isExpired={isExpired}
                    isPending={isPending}
                    onPress={() => router.push(`/(admin)/members/${member.id}`)}
                  />
                );
              })
            )}
          </Box>
        </Box>
      </ScrollView>
      <StatusBar style="light" />
    </>
  );
}

function Row({
  member,
  isExpired,
  isPending,
  onPress,
}: {
  member: Member;
  isExpired: boolean;
  isPending: boolean;
  onPress: () => void;
}) {
  const avatarBg = isExpired
    ? 'bg-destructive/15 border-destructive/30'
    : isPending
    ? 'bg-warning/15 border-warning/30'
    : 'bg-primary/15 border-primary/30';
  const avatarText = isExpired
    ? 'text-destructive'
    : isPending
    ? 'text-warning'
    : 'text-primary';
  const statusText = isExpired
    ? 'text-destructive'
    : isPending
    ? 'text-warning'
    : 'text-primary';

  return (
    <Button
      onPress={onPress}

      className="bg-card border border-border-subtle p-3.5 rounded-2xl flex-row items-center justify-between"
    >
      <Box className="flex-row items-center gap-3.5 flex-1">
        <Box
          className={`w-11 h-11 rounded-full items-center justify-center border ${avatarBg}`}
        >
          <Text className={`font-display font-black text-sm tracking-tight ${avatarText}`}>
            {member.initials}
          </Text>
        </Box>
        <Box className="flex-1">
          <Text className="font-bold text-foreground text-sm leading-tight">
            {member.name}
          </Text>
          <Text className="text-xs font-mono text-muted-foreground mt-0.5">
            {member.tier} <Text className="text-muted-foreground">•</Text> {member.id}
          </Text>
        </Box>
      </Box>

      <Box className="items-end ml-2">
        <Text className={`text-xs font-mono font-bold capitalize ${statusText}`}>
          {member.status}
        </Text>
        <Text className="text-[11px] font-mono text-muted-foreground">
          {isExpired ? '0d' : `${member.daysLeft}d left`}
        </Text>
      </Box>
      <ChevronRight size={16} color="#555566" />
    </Button>
  );
}
