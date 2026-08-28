import { View, Text, ScrollView, TextInput, TouchableOpacity } from '@/tw';
import { StatusBar } from 'expo-status-bar';
import {
  Search,
  UserPlus,
  ChevronRight,
  X,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MemberStatus = 'active' | 'expired' | 'pending';

interface Member {
  id: string;
  name: string;
  initials: string;
  tier: string;
  status: MemberStatus;
  daysLeft: number;
}

const MOCK_MEMBERS: Member[] = [
  { id: 'M-1001', name: 'Sarah Johnson', initials: 'SJ', tier: 'Premium', status: 'active', daysLeft: 214 },
  { id: 'M-1002', name: 'Mike Chen', initials: 'MC', tier: 'Standard', status: 'active', daysLeft: 89 },
  { id: 'M-1003', name: 'Emma Davis', initials: 'ED', tier: 'Basic', status: 'expired', daysLeft: 0 },
  { id: 'M-1004', name: 'David Kim', initials: 'DK', tier: 'VIP Elite', status: 'active', daysLeft: 300 },
  { id: 'M-1005', name: 'Olivia Brown', initials: 'OB', tier: 'Premium', status: 'pending', daysLeft: 28 },
  { id: 'M-1006', name: 'Liam Wilson', initials: 'LW', tier: 'Standard', status: 'expired', daysLeft: 0 },
  { id: 'M-1007', name: 'Sophia Garcia', initials: 'SG', tier: 'Basic', status: 'active', daysLeft: 120 },
];

const STATUS_FILTERS = ['All', 'Active', 'Expired', 'Pending'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export default function MembersList() {
  const inset = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selected, setSelected] = useState<Member | null>(null);

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
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => setSelected(member)}
                    activeOpacity={0.8}
                    className="bg-card border border-border-subtle p-3.5 rounded-2xl flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-3.5 flex-1">
                      <View
                        className={`w-11 h-11 rounded-full items-center justify-center border ${
                          isExpired
                            ? 'bg-[#2A1515] border-alert-red/30'
                            : isPending
                            ? 'bg-[#282210] border-[#E5B537]/30'
                            : 'bg-[#1B2412] border-lime-accent/30'
                        }`}
                      >
                        <Text
                          className={`font-display font-black text-sm tracking-tight ${
                            isExpired
                              ? 'text-alert-red'
                              : isPending
                              ? 'text-[#E5B537]'
                              : 'text-lime-accent'
                          }`}
                        >
                          {member.initials}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-white text-sm leading-tight">
                          {member.name}
                        </Text>
                        <Text className="text-xs font-mono text-text-muted mt-0.5">
                          {member.tier} <Text className="text-[#555566]">•</Text>{' '}
                          {member.id}
                        </Text>
                      </View>
                    </View>

                    <View className="items-end ml-2">
                      <Text
                        className={`text-xs font-mono font-bold capitalize ${
                          isExpired
                            ? 'text-alert-red'
                            : isPending
                            ? 'text-[#E5B537]'
                            : 'text-lime-accent'
                        }`}
                      >
                        {member.status}
                      </Text>
                      <Text className="text-[11px] font-mono text-text-muted">
                        {isExpired ? '0d' : `${member.daysLeft}d left`}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#555566" />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {selected && (
        <MemberDetailModal member={selected} onClose={() => setSelected(null)} />
      )}
      <StatusBar style="light" />
    </>
  );
}

/* ── Member Detail Bottom-Sheet Modal ─────────────────────────────── */

function MemberDetailModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const isExpired = member.status === 'expired';
  const isPending = member.status === 'pending';

  const statusColor = isExpired
    ? 'text-alert-red'
    : isPending
    ? 'text-[#E5B537]'
    : 'text-lime-accent';
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

  return (
    <View className="absolute inset-0">
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={1}
        className="absolute inset-0 bg-black/60"
      />
      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-card border-t border-border-subtle p-5 pb-8">
        <View className="w-10 h-1 rounded-full bg-border-subtle self-center mb-4" />
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3.5 flex-1">
            <View
              className={`w-14 h-14 rounded-full items-center justify-center border ${avatarBg}`}
            >
              <Text
                className={`font-display font-black text-base tracking-tight ${avatarText}`}
              >
                {member.initials}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-display font-black text-lg uppercase tracking-tight text-white leading-none">
                {member.name}
              </Text>
              <Text className="text-xs font-mono text-text-muted mt-1">
                {member.tier} • {member.id}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} className="p-1">
            <X size={18} color="#8A8A9A" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-2 mt-4">
          <View
            className={`px-3 py-1 rounded-full border ${
              isExpired
                ? 'bg-alert-red/15 border-alert-red/30'
                : isPending
                ? 'bg-[#E5B537]/15 border-[#E5B537]/30'
                : 'bg-lime-accent/15 border-lime-accent/30'
            }`}
          >
            <Text className={`text-xs font-mono font-bold capitalize ${statusColor}`}>
              {member.status}
            </Text>
          </View>
          <Text className="text-xs font-mono text-text-muted">
            {isExpired ? '0 days left' : `${member.daysLeft} days left`}
          </Text>
        </View>

        <View className="mt-5 gap-3">
          <View className="flex-row items-center gap-3 bg-background border border-border-subtle p-3 rounded-xl">
            <Calendar size={16} color="#C8F135" />
            <View className="flex-1">
              <Text className="text-[10px] font-mono text-text-muted uppercase">
                Membership
              </Text>
              <Text className="text-xs font-bold text-white mt-0.5">
                {member.tier} Plan
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3 bg-background border border-border-subtle p-3 rounded-xl">
            <CreditCard size={16} color="#C8F135" />
            <View className="flex-1">
              <Text className="text-[10px] font-mono text-text-muted uppercase">
                Billing
              </Text>
              <Text className="text-xs font-bold text-white mt-0.5">
                Auto-renew on file
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3 bg-background border border-border-subtle p-3 rounded-xl">
            <ShieldCheck size={16} color="#C8F135" />
            <View className="flex-1">
              <Text className="text-[10px] font-mono text-text-muted uppercase">
                QR Pass
              </Text>
              <Text className="text-xs font-bold text-white mt-0.5">
                Active check-in token
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
