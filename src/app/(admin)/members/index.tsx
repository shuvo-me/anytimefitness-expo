import { View, Text, ScrollView, TextInput, TouchableOpacity } from '@/tw';
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
        <View className="gap-5">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-display font-black text-3xl uppercase tracking-tight text-white leading-none">
                Members
              </Text>
              <Text className="text-xs font-mono text-text-muted mt-1">
                Total Enrolled:{' '}
                <Text className="text-lime-accent font-bold">
                  {MOCK_MEMBERS.length} Athletes
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {}}
              activeOpacity={0.7}
              className="bg-lime-accent px-3.5 py-2 rounded-xl flex-row items-center gap-1.5"
            >
              <UserPlus size={16} color="#000000" />
              <Text className="font-display font-bold text-xs uppercase tracking-wider text-black">
                + Add Member
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="relative">
            <View className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
              <Search size={16} color="#8A8A9A" />
            </View>
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search members..."
              placeholderTextColor="#555566"
              className="w-full bg-card border border-border-subtle rounded-2xl pl-10 pr-4 py-3 text-sm text-white font-mono"
            />
          </View>

          {/* Filter Tabs */}
          <View className="flex-row items-center gap-2">
            {STATUS_FILTERS.map((filter) => {
              const isActive = statusFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setStatusFilter(filter)}
                  activeOpacity={0.7}
                  className={`px-4 py-1.5 rounded-full ${
                    isActive
                      ? 'bg-lime-accent'
                      : 'bg-card border border-border-subtle'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold font-sans uppercase tracking-wider ${
                      isActive ? 'text-black' : 'text-text-muted'
                    }`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Members List */}
          <View className="gap-2.5">
            {filteredMembers.length === 0 ? (
              <View className="p-8 items-center bg-card border border-border-subtle rounded-2xl">
                <Text className="text-sm text-text-muted font-mono text-center">
                  {searchTerm.trim()
                    ? `No members found matching "${searchTerm}"`
                    : 'No members in this status'}
                </Text>
              </View>
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
          </View>
        </View>
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
    ? 'bg-[#2A1515] border-alert-red/30'
    : isPending
    ? 'bg-[#282210] border-[#E5B537]/30'
    : 'bg-[#1B2412] border-lime-accent/30';
  const avatarText = isExpired
    ? 'text-alert-red'
    : isPending
    ? 'text-[#E5B537]'
    : 'text-lime-accent';
  const statusText = isExpired
    ? 'text-alert-red'
    : isPending
    ? 'text-[#E5B537]'
    : 'text-lime-accent';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-card border border-border-subtle p-3.5 rounded-2xl flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3.5 flex-1">
        <View
          className={`w-11 h-11 rounded-full items-center justify-center border ${avatarBg}`}
        >
          <Text className={`font-display font-black text-sm tracking-tight ${avatarText}`}>
            {member.initials}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-white text-sm leading-tight">
            {member.name}
          </Text>
          <Text className="text-xs font-mono text-text-muted mt-0.5">
            {member.tier} <Text className="text-[#555566]">•</Text> {member.id}
          </Text>
        </View>
      </View>

      <View className="items-end ml-2">
        <Text className={`text-xs font-mono font-bold capitalize ${statusText}`}>
          {member.status}
        </Text>
        <Text className="text-[11px] font-mono text-text-muted">
          {isExpired ? '0d' : `${member.daysLeft}d left`}
        </Text>
      </View>
      <ChevronRight size={16} color="#555566" />
    </TouchableOpacity>
  );
}
