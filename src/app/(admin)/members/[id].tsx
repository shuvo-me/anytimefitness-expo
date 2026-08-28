import { View, Text, ScrollView, TextInput, TouchableOpacity } from '@/tw';
import { Host, Picker } from '@expo/ui';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Trash2,
  Dumbbell,
  Utensils,
} from 'lucide-react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getMemberById,
  TIER_OPTIONS,
  TRAINERS,
} from '@/types/member';
import type { Member, MembershipTier, MemberStatus } from '@/types/member';

type DetailTab = 'profile' | 'routine' | 'edit';

export default function MemberDetail() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = getMemberById(String(id));
  const [activeTab, setActiveTab] = useState<DetailTab>('profile');

  if (!member) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-sm font-mono text-text-muted text-center">
          Member not found.
        </Text>
        <StatusBar style="light" />
      </View>
    );
  }

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
    : 'bg-lime-accent';
  const avatarText = isExpired
    ? 'text-alert-red'
    : isPending
    ? 'text-[#E5B537]'
    : 'text-black';

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
        <Host>
          <View className="gap-5">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="w-10 h-10 rounded-xl bg-card border border-border-subtle items-center justify-center"
              >
                <ArrowLeft size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="font-display font-black text-lg uppercase tracking-tight text-white">
                Member Profile
              </Text>
              <View className="w-10 h-10" />
            </View>

            {/* Title block */}
            <View className="bg-card border border-border-subtle p-4 rounded-2xl">
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center border ${avatarBg}`}
                >
                  <Text
                    className={`font-display font-black text-base tracking-tight ${avatarText}`}
                  >
                    {member.initials}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-display font-black text-xl uppercase tracking-tight text-white leading-none">
                      {member.name}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-full border ${
                        isExpired
                          ? 'bg-alert-red/15 border-alert-red/30'
                          : isPending
                          ? 'bg-[#E5B537]/15 border-[#E5B537]/30'
                          : 'bg-lime-accent/15 border-lime-accent/30'
                      }`}
                    >
                      <Text className={`text-[10px] font-mono font-bold ${statusColor}`}>
                        {member.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-mono text-text-muted mt-1">
                    {member.id} • {member.tier} Plan • {member.assignedTrainer}
                  </Text>
                </View>
              </View>
            </View>

            {/* Tab bar */}
            <View className="flex-row items-center border-b border-border-subtle">
              {(
                [
                  { key: 'profile', label: 'Overview' },
                  { key: 'routine', label: 'Routine' },
                  { key: 'edit', label: 'Edit' },
                ] as { key: DetailTab; label: string }[]
              ).map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.7}
                    className={`flex-1 pb-2.5 ${isActive ? 'border-b-2 border-lime-accent' : ''}`}
                  >
                    <Text
                      className={`text-xs font-mono font-bold uppercase tracking-wider text-center ${
                        isActive ? 'text-lime-accent' : 'text-text-muted'
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {activeTab === 'profile' && (
              <OverviewTab member={member} />
            )}
            {activeTab === 'routine' && <RoutineTab />}
            {activeTab === 'edit' && <EditTab member={member} />}
          </View>
        </Host>
      </ScrollView>
      <StatusBar style="light" />
    </>
  );
}

/* ── Overview & Stats Tab ─────────────────────────────────────────── */

function OverviewTab({ member }: { member: Member }) {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const flash = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <View className="gap-4">
      {feedbackMsg && (
        <View className="p-3 bg-lime-accent/15 border border-lime-accent/40 rounded-xl flex-row items-center gap-2">
          <CheckCircle2 size={16} color="#C8F135" />
          <Text className="text-xs font-mono text-white flex-1">{feedbackMsg}</Text>
        </View>
      )}

      {/* 3 Metric Cards */}
      <View className="flex-row gap-3">
        <View className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-[10px] font-mono text-text-muted uppercase">
            Total Sessions
          </Text>
          <Text className="font-display font-black text-2xl text-white mt-1">
            {member.totalSessions}
          </Text>
        </View>
        <View className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-[10px] font-mono text-text-muted uppercase">
            Days Left
          </Text>
          <Text className="font-display font-black text-2xl text-lime-accent mt-1">
            {member.daysLeft}d
          </Text>
        </View>
        <View className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-[10px] font-mono text-text-muted uppercase">
            Rating
          </Text>
          <Text className="font-display font-black text-2xl text-white mt-1">
            {member.rating} ★
          </Text>
        </View>
      </View>

      {/* Goal & Details */}
      <View className="bg-background border border-border-subtle p-4 rounded-2xl gap-2">
        <DetailRow label="Primary Goal" value={member.goal} bold />
        <DetailRow label="Email" value={member.email} />
        <DetailRow label="Phone" value={member.phone} />
        <DetailRow label="Gym Location" value={member.location} />
        <DetailRow label="Weight & Height" value={`${member.weightKg} kg / ${member.heightCm} cm`} />
        <DetailRow
          label="Emergency"
          value={`${member.emergencyContact.name} (${member.emergencyContact.relation}) - ${member.emergencyContact.phone}`}
          last
        />
      </View>

      {/* Financial & Dues */}
      <View className="bg-background border border-border-subtle p-4 rounded-2xl flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-mono text-text-muted uppercase">
            Outstanding Balance
          </Text>
          <Text
            className={`font-display font-black text-2xl mt-0.5 ${
              member.duesAmount > 0 ? 'text-alert-red' : 'text-lime-accent'
            }`}
          >
            ${member.duesAmount}.00
          </Text>
        </View>
        {member.duesAmount > 0 ? (
          <TouchableOpacity
            onPress={() => flash(`Collected $${member.duesAmount} fee successfully!`)}
            activeOpacity={0.7}
            className="bg-lime-accent px-4 py-2 rounded-xl"
          >
            <Text className="font-display font-bold text-xs uppercase text-black">
              Collect Payment (${member.duesAmount})
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-lime-accent/15 px-3 py-1 rounded-lg border border-lime-accent/30">
            <Text className="text-xs font-mono text-lime-accent">
              All Fees Settled
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View className="flex-row gap-3 pt-1">
        <TouchableOpacity
          onPress={() => flash(`${member.name} checked in to gym`)}
          activeOpacity={0.7}
          className="flex-1 bg-border-subtle py-2.5 rounded-xl flex-row items-center justify-center gap-2"
        >
          <CheckCircle2 size={16} color="#C8F135" />
          <Text className="text-xs font-mono font-bold text-white">
            Check In to Gym
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => flash('Member deck view (coming soon)')}
          activeOpacity={0.7}
          className="flex-1 bg-border-subtle py-2.5 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Sparkles size={16} color="#C8F135" />
          <Text className="text-xs font-mono font-bold text-lime-accent">
            View Deck
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  bold,
  last,
}: {
  label: string;
  value: string;
  bold?: boolean;
  last?: boolean;
}) {
  return (
    <View className={`flex-row justify-between py-1 ${last ? '' : 'border-b border-border-subtle'}`}>
      <Text className="text-text-muted font-mono text-xs">{label}:</Text>
      <Text className={`text-white text-xs text-right flex-1 ml-3 ${bold ? 'font-bold' : ''}`}>
        {value}
      </Text>
    </View>
  );
}

/* ── Assigned Routine & Diet Tab ──────────────────────────────────── */

function RoutineTab() {
  return (
    <View className="bg-background border border-border-subtle p-6 rounded-2xl items-center gap-3">
      <View className="w-12 h-12 rounded-2xl bg-lime-accent/15 border border-lime-accent/30 items-center justify-center">
        <Dumbbell size={20} color="#C8F135" />
      </View>
      <Text className="font-display font-black text-lg uppercase tracking-tight text-white text-center">
        Assigned Routine & Diet
      </Text>
      <View className="flex-row items-center gap-2 mt-1">
        <Utensils size={14} color="#8A8A9A" />
        <Text className="text-xs font-mono text-text-muted text-center">
          Routine & nutrition management coming soon.
        </Text>
      </View>
    </View>
  );
}

/* ── Edit Membership Tab ──────────────────────────────────────────── */

function EditTab({ member }: { member: Member }) {
  const router = useRouter();
  const [editName, setEditName] = useState(member.name);
  const [editTier, setEditTier] = useState<MembershipTier>(member.tier);
  const [editStatus, setEditStatus] = useState<MemberStatus>(member.status);
  const [editTrainer, setEditTrainer] = useState(member.assignedTrainer);
  const [editGoal, setEditGoal] = useState(member.goal);
  const [editDues, setEditDues] = useState(String(member.duesAmount));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const flash = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  const handleSave = () => {
    flash('Member updated successfully!');
  };

  const handleDelete = () => {
    flash(`${member.name} removed`);
    setTimeout(() => router.back(), 1200);
  };

  return (
    <View className="gap-3">
      {feedbackMsg && (
        <View className="p-3 bg-lime-accent/15 border border-lime-accent/40 rounded-xl flex-row items-center gap-2">
          <CheckCircle2 size={16} color="#C8F135" />
          <Text className="text-xs font-mono text-white flex-1">{feedbackMsg}</Text>
        </View>
      )}

      <FieldLabel>Member Name</FieldLabel>
      <TextInput
        value={editName}
        onChangeText={setEditName}
        className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-xs text-white font-mono"
        placeholderTextColor="#555566"
      />

      <View className="flex-row gap-3 pt-1">
        <View className="flex-1">
          <FieldLabel>Tier</FieldLabel>
          <Picker
            selectedValue={editTier}
            onValueChange={(v) => setEditTier(v as MembershipTier)}
            appearance="menu"
          >
            {TIER_OPTIONS.map((o) => (
              <Picker.Item key={o.value} label={o.label} value={o.value} />
            ))}
          </Picker>
        </View>
        <View className="flex-1">
          <FieldLabel>Status</FieldLabel>
          <Picker
            selectedValue={editStatus}
            onValueChange={(v) => setEditStatus(v as MemberStatus)}
            appearance="menu"
          >
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Expired" value="expired" />
            <Picker.Item label="Pending" value="pending" />
          </Picker>
        </View>
      </View>

      <View className="flex-row gap-3 pt-1">
        <View className="flex-1">
          <FieldLabel>Assigned Trainer</FieldLabel>
          <Picker
            selectedValue={editTrainer}
            onValueChange={setEditTrainer}
            appearance="menu"
          >
            {TRAINERS.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>
        <View className="flex-1">
          <FieldLabel>Pending Dues ($)</FieldLabel>
          <TextInput
            value={editDues}
            onChangeText={setEditDues}
            keyboardType="numeric"
            className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-xs text-white font-mono"
            placeholderTextColor="#555566"
          />
        </View>
      </View>

      <View className="pt-1">
        <FieldLabel>Goal Description</FieldLabel>
        <TextInput
          value={editGoal}
          onChangeText={setEditGoal}
          className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2 text-xs text-white font-mono"
          placeholderTextColor="#555566"
        />
      </View>

      {showDeleteConfirm && (
        <View className="p-4 bg-[#2A1515] border border-alert-red/40 rounded-2xl gap-3">
          <View className="flex-row items-center gap-2">
            <AlertTriangle size={18} color="#FF4B1F" />
            <Text className="text-xs font-mono font-bold text-alert-red">
              Confirm Member Expulsion / Removal
            </Text>
          </View>
          <Text className="text-xs text-[#D0D0DC]">
            Are you sure you want to permanently remove {editName} from the gym
            roster? This action cannot be undone.
          </Text>
          <View className="flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={() => setShowDeleteConfirm(false)}
              activeOpacity={0.7}
              className="px-3 py-1.5 bg-border-subtle rounded-lg"
            >
              <Text className="text-xs font-mono text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.7}
              className="px-4 py-1.5 bg-alert-red rounded-lg"
            >
              <Text className="text-xs font-mono font-bold text-white">
                Confirm Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="pt-3 flex-row items-center justify-between border-t border-border-subtle">
        <TouchableOpacity
          onPress={() => setShowDeleteConfirm(true)}
          activeOpacity={0.7}
          className="px-3 py-2 rounded-xl flex-row items-center gap-1.5"
        >
          <Trash2 size={16} color="#FF4B1F" />
          <Text className="text-xs font-mono text-alert-red">Remove Member</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.7}
          className="bg-lime-accent px-5 py-2.5 rounded-xl"
        >
          <Text className="font-display font-bold text-xs uppercase text-black">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-text-muted font-mono text-[10px] uppercase mb-1">
      {children}
    </Text>
  );
}
