import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, TouchableOpacity } from '@/tw';
import { InputField } from '@/components/common/InputField';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from '@/components/ui/select';
import {
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  User,
  UserPlus,
  X,
} from 'lucide-react-native';
import {
  MembershipTier,
  TIER_OPTIONS,
  TRAINERS,
} from '@/types/member';

const LOCATIONS = [
  'Downtown Hub - Zone A',
  'Westside Annex - Barbell Club',
  'Northside Arena - Studio 1',
  'Uptown Performance',
  'Riverside Annex',
];

const GOALS = [
  'Hypertrophy & Strength',
  'Fat Loss & Conditioning',
  'Powerlifting & Heavy Compound',
  'Endurance & Mobility',
  'Hybrid Athletic Performance',
];

function FormSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <Select selectedValue={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        variant="outline"
        size="md"
        className="bg-background border-[#252532] rounded-xl px-3.5 h-11"
      >
        <View className="flex-1 flex-row items-center justify-between">
          {selected ? (
            <Text className="text-sm font-mono text-white flex-1 pr-2">
              {selected.label}
            </Text>
          ) : (
            <Text className="text-sm font-mono text-text-muted flex-1 pr-2">
              Select...
            </Text>
          )}
          <ChevronDown size={14} color="#8A8A9A" />
        </View>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="bg-card border-border-subtle">
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectScrollView>
            {options.map((o) => (
              <SelectItem key={o.value} label={o.label} value={o.value} />
            ))}
          </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

export default function MemberOnboard() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [tier, setTier] = useState<MembershipTier>('Premium');
  const [initialPayment, setInitialPayment] = useState(true);
  const [goal, setGoal] = useState(GOALS[0]);
  const [trainer, setTrainer] = useState(TRAINERS[0]);
  const [weightKg, setWeightKg] = useState('75');
  const [heightCm, setHeightCm] = useState('178');
  const [attendanceGoalDays, setAttendanceGoalDays] = useState('16');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [createdSuccess, setCreatedSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!createdSuccess) return;
    const t = setTimeout(() => {
      router.back();
    }, 1800);
    return () => clearTimeout(t);
  }, [createdSuccess, router]);

  const getTierPrice = (t: MembershipTier) => {
    switch (t) {
      case 'Basic':
        return '$40 / mo';
      case 'Premium':
        return '$80 / mo';
      case 'VIP':
        return '$150 / mo';
      case 'Annual':
        return '$600 / yr';
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Full Name is required.');
      return;
    }
    const generatedId = `M-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedSuccess(generatedId);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />
      {createdSuccess ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 rounded-full bg-lime-accent/20 items-center justify-center mb-4 border border-lime-accent">
            <CheckCircle2 size={32} color="#C8F135" />
          </View>
          <Text className="font-display font-black text-2xl uppercase text-white text-center">
            Member Enrolled Successfully!
          </Text>
          <Text className="text-xs font-mono text-text-muted mt-3">
            Assigned ID:{' '}
            <Text className="text-lime-accent font-bold">{createdSuccess}</Text>
          </Text>
          <Text className="text-xs text-[#D0D0DC] mt-1">
            Workout split and nutrition routine automatically initialized.
          </Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View className="px-5 pt-5 pb-3 border-b border-border-subtle flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <View className="w-8 h-8 rounded-xl bg-lime-accent items-center justify-center">
                <UserPlus size={16} color="#000000" />
              </View>
              <View>
                <Text className="font-display font-black text-lg uppercase tracking-tight text-white leading-none">
                  Member Onboarding
                </Text>
                <Text className="text-[10px] font-mono text-text-muted mt-0.5">
                  ANYTIMEFITNESS ENROLLMENT
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="w-8 h-8 rounded-full bg-border-subtle items-center justify-center"
            >
              <X size={16} color="#8A8A9A" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-5 py-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <View className="gap-8">
              {error && (
                <View className="p-3 bg-alert-red/15 border border-alert-red/40 rounded-xl">
                  <Text className="text-xs font-mono text-alert-red">
                    {error}
                  </Text>
                </View>
              )}

              {/* 1. Athlete Identity */}
              <View className="gap-4">
                <Text className="text-[10px] font-mono uppercase text-text-muted tracking-wider font-bold">
                  1. Athlete Identity
                </Text>
                <View className="gap-4">
                  <InputField
                    label="Full Name *"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Marcus Vance"
                    icon={<User size={16} color="#666675" />}
                  />
                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <InputField
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="marcus@email.com"
                        icon={<Mail size={16} color="#666675" />}
                      />
                    </View>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <InputField
                        label="Phone Number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="+1 (555) 000-0000"
                        icon={<Phone size={16} color="#666675" />}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[11px] font-mono text-text-muted uppercase mb-1.5">
                        Gym Branch / Zone
                      </Text>
                      <FormSelect
                        value={location}
                        options={LOCATIONS.map((l) => ({ label: l, value: l }))}
                        onChange={setLocation}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* 2. Membership Tier & Billing */}
              <View className="gap-4 pt-6 border-t border-border-subtle">
                <Text className="text-[10px] font-mono uppercase text-text-muted tracking-wider font-bold">
                  2. Membership Tier & Billing
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {TIER_OPTIONS.map((t) => {
                    const isSelected = tier === t.value;
                    return (
                      <TouchableOpacity
                        key={t.value}
                        onPress={() => setTier(t.value)}
                        activeOpacity={0.7}
                        className={`flex-1 min-w-[45%] p-3 rounded-xl border ${
                          isSelected
                            ? 'bg-lime-accent/15 border-lime-accent'
                            : 'bg-background border-border-subtle'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? 'text-lime-accent' : 'text-white'
                          }`}
                        >
                          {t.value}
                        </Text>
                        <Text className="text-[10px] font-mono mt-1 text-text-muted">
                          {getTierPrice(t.value)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View className="flex-row items-center justify-between gap-4 p-3 rounded-xl bg-background border border-border-subtle">
                  <View className="flex-1 mr-2">
                    <Text className="text-xs font-bold text-white">
                      Process Initial Payment Now
                    </Text>
                    <Text className="text-[10px] font-mono text-text-muted mt-0.5">
                      Instantly marks subscription active & logs transaction
                    </Text>
                  </View>
                  <Switch
                    value={initialPayment}
                    onValueChange={setInitialPayment}
                    trackColor={{ false: '#22222E', true: '#C8F135' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>

              {/* 3. Trainer & Fitness Targets */}
              <View className="gap-4 pt-6 border-t border-border-subtle">
                <Text className="text-[10px] font-mono uppercase text-text-muted tracking-wider font-bold">
                  3. Trainer & Fitness Targets
                </Text>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-[11px] font-mono text-text-muted uppercase mb-1.5">
                      Primary Goal
                    </Text>
                    <FormSelect
                      value={goal}
                      options={GOALS.map((g) => ({ label: g, value: g }))}
                      onChange={setGoal}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] font-mono text-text-muted uppercase mb-1.5">
                      Assigned Coach
                    </Text>
                    <FormSelect
                      value={trainer}
                      options={TRAINERS.map((t) => ({ label: t, value: t }))}
                      onChange={setTrainer}
                    />
                  </View>
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <InputField
                      label="Weight (kg)"
                      value={weightKg}
                      onChangeText={setWeightKg}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <InputField
                      label="Height (cm)"
                      value={heightCm}
                      onChangeText={setHeightCm}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <InputField
                      label="Target Days/Mo"
                      value={attendanceGoalDays}
                      onChangeText={setAttendanceGoalDays}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* 4. Emergency Contact */}
              <View className="gap-4 pt-6 border-t border-border-subtle">
                <Text className="text-[10px] font-mono uppercase text-text-muted tracking-wider font-bold">
                  4. Emergency Contact
                </Text>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <InputField
                      label="Contact Person Name"
                      value={emergencyName}
                      onChangeText={setEmergencyName}
                      placeholder="Contact Name"
                    />
                  </View>
                  <View className="flex-1">
                    <InputField
                      label="Contact Phone"
                      value={emergencyPhone}
                      onChangeText={setEmergencyPhone}
                      keyboardType="phone-pad"
                      placeholder="Contact Phone"
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="px-5 py-4 flex-row items-center justify-end gap-3 border-t border-border-subtle">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="px-4 py-2.5 rounded-xl bg-border-subtle items-center justify-center"
            >
              <Text className="text-xs font-mono font-bold text-white">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.7}
              className="px-5 py-2.5 rounded-xl bg-lime-accent flex-row items-center justify-center gap-2"
            >
              <Text className="font-display font-bold text-xs uppercase tracking-wider text-black">
                Complete Onboarding
              </Text>
              <UserPlus size={16} color="#000000" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
