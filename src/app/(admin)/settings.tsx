import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from '@/tw';
import { Host, Switch as ExpoSwitch } from '@expo/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  CreditCard,
  Bell,
  KeyRound,
  CheckCircle2,
  RotateCcw,
  LogOut,
  Save,
  Eye,
  EyeOff,
  ChevronDown,
  Phone,
  Mail,
} from 'lucide-react-native';
import { useState } from 'react';
import { useLogout } from '@/hooks/useAuth';
import {
  useAdminProfileSettings,
  useUpdateAdminProfile,
  useFacilitySettings,
  useUpdateFacilitySettings,
} from '@/hooks/useSettings';
import type { SettingCategory, AdminProfileSettings, FacilitySettings } from '@/types/admin';
import { DEFAULT_ADMIN_PROFILE, DEFAULT_FACILITY_SETTINGS } from '@/types/admin';

type ExpandedSections = Record<string, boolean>;

const ALL_SECTIONS: ExpandedSections = {
  profile: true,
  billing: true,
  security: true,
  notifications: true,
  maintenance: true,
};

const CATEGORY_CHIPS: { id: SettingCategory; label: string }[] = [
  { id: 'all', label: 'All Settings' },
  { id: 'profile', label: 'Profile' },
  { id: 'billing', label: 'Billing' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'maintenance', label: 'Maintenance' },
];

const NOTIFICATION_ITEMS = [
  {
    key: 'overduePaymentReminders' as const,
    title: 'Automated Dues SMS / Push Reminders',
    desc: 'Send gentle renewal notifications 3 days before membership expiration.',
  },
  {
    key: 'peakCapacityAlerts' as const,
    title: 'Floor Overcrowding Push Notification',
    desc: 'Notify staff when floor attendance exceeds 85% capacity.',
  },
  {
    key: 'dailyExecutiveDigest' as const,
    title: 'Daily 08:00 AM Revenue & Check-In Digest',
    desc: 'Morning summary of check-ins, signups, and delinquent accounts.',
  },
  {
    key: 'instantOnboardingAlerts' as const,
    title: 'Instant New Athlete Onboarding Alert',
    desc: 'Alert front desk when a new member registers via kiosk.',
  },
];

export default function AdminSettings() {
  const { data: profileData, isLoading: loadingProfile } =
    useAdminProfileSettings();
  const { data: facilityData, isLoading: loadingFacility } =
    useFacilitySettings();

  if (loadingProfile || loadingFacility) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-sm font-mono text-text-muted">
          Loading settings...
        </Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SettingsContent
      initialProfile={profileData ?? DEFAULT_ADMIN_PROFILE}
      initialFacility={facilityData ?? DEFAULT_FACILITY_SETTINGS}
    />
  );
}

function SettingsContent({
  initialProfile,
  initialFacility,
}: {
  initialProfile: AdminProfileSettings;
  initialFacility: FacilitySettings;
}) {
  const inset = useSafeAreaInsets();
  const logoutMutation = useLogout();
  const updateProfile = useUpdateAdminProfile();
  const updateFacility = useUpdateFacilitySettings();

  const [activeCategory, setActiveCategory] = useState<SettingCategory>('all');
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [showPin, setShowPin] = useState(false);
  const [cadence, setCadence] = useState<'monthly' | 'semiAnnual' | 'yearly'>(
    'monthly',
  );

  const [expandedSections, setExpandedSections] =
    useState<ExpandedSections>(ALL_SECTIONS);

  const [profileForm, setProfileForm] = useState(initialProfile);
  const [facilityForm, setFacilityForm] = useState(initialFacility);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const flashSaved = (key: string) => {
    setSaved((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setSaved((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const saveProfile = () => {
    updateProfile.mutate(profileForm);
    flashSaved('profile');
  };

  const saveBilling = () => {
    updateFacility.mutate({ pricing: facilityForm.pricing });
    flashSaved('billing');
  };

  const saveSecurity = () => {
    updateProfile.mutate({ securityPin: profileForm.securityPin });
    flashSaved('security');
  };

  return (
    <View className="flex-1 bg-background">
      {/* Fixed top: header + category filter chips */}
      <View
        style={{ paddingTop: inset.top + 16, paddingHorizontal: 16 }}
        className="bg-background"
      >
        <View className="gap-3">
          <View className="gap-1">
            <Text className="font-display font-black text-2xl uppercase tracking-tight text-white">
              Settings
            </Text>
            <Text className="text-xs font-mono text-text-muted">
              {profileForm.name} · {profileForm.title}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
          >
            {CATEGORY_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip.id}
                onPress={() => setActiveCategory(chip.id)}
                activeOpacity={0.7}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                  activeCategory === chip.id
                    ? 'bg-lime-accent'
                    : 'bg-card border border-border-subtle'
                }`}
              >
                <Text
                  className={`text-xs font-mono whitespace-nowrap ${
                    activeCategory === chip.id
                      ? 'text-black font-bold'
                      : 'text-text-muted'
                  }`}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Scrollable sections */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: inset.bottom + 24,
        }}
      >
        <Host>
          <View className="gap-6">

          {/* ================================================================= */}
          {/* SECTION 1: PROFILE */}
          {/* ================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'profile') && (
            <Section
              title="Profile"
              subtitle="Name and contact information"
              icon={<User size={16} color="#C8F135" />}
              iconBg="bg-lime-accent/15 border-lime-accent/30"
              expanded={expandedSections.profile}
              onToggle={() => toggleSection('profile')}
            >
              <View className="gap-4">
                <InputField
                  label="Full Legal Name"
                  value={profileForm.name}
                  onChangeText={(v) =>
                    setProfileForm({ ...profileForm, name: v })
                  }
                  placeholder="e.g. Alex Morgan"
                />

                <View className="flex-col sm:flex-row gap-4">
                  <InputField
                    label="Executive Email"
                    value={profileForm.email}
                    onChangeText={(v) =>
                      setProfileForm({ ...profileForm, email: v })
                    }
                    placeholder="alex@ironcladgym.com"
                    keyboardType="email-address"
                    icon={<Mail size={16} color="#666675" />}
                  />
                  <InputField
                    label="Direct Phone Hotline"
                    value={profileForm.phone}
                    onChangeText={(v) =>
                      setProfileForm({ ...profileForm, phone: v })
                    }
                    placeholder="+1 (555) 789-0142"
                    keyboardType="phone-pad"
                    icon={<Phone size={16} color="#666675" />}
                  />
                </View>
              </View>
              <SectionSave onSave={saveProfile} saved={!!saved.profile} />
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 2: MEMBERSHIP & BILLING */}
          {/* ================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'billing') && (
            <Section
              title="Membership & Billing"
              subtitle="Plan prices by billing cadence"
              icon={<CreditCard size={16} color="#C8F135" />}
              iconBg="bg-lime-accent/15 border-lime-accent/30"
              expanded={expandedSections.billing}
              onToggle={() => toggleSection('billing')}
            >
              <View className="gap-4">
                {/* Billing Cadence Selector */}
                <View className="flex-row gap-2 p-1 bg-card border border-border-subtle rounded-2xl">
                  {(
                    [
                      { key: 'monthly', label: 'Monthly' },
                      { key: 'semiAnnual', label: '6-Monthly' },
                      { key: 'yearly', label: 'Yearly' },
                    ] as const
                  ).map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setCadence(opt.key)}
                      activeOpacity={0.7}
                      className={`flex-1 py-2 rounded-xl ${
                        cadence === opt.key
                          ? 'bg-lime-accent'
                          : 'bg-transparent'
                      }`}
                    >
                      <Text
                        className={`text-xs font-mono font-bold text-center ${
                          cadence === opt.key
                            ? 'text-black'
                            : 'text-text-muted'
                        }`}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Pricing Cards per Tier */}
                <View className="flex-row flex-wrap gap-3">
                  {(
                    [
                      { key: 'basic', label: 'Basic Access', color: 'text-white' },
                      { key: 'premium', label: 'Premium Tier', color: 'text-[#5B8DEF]' },
                      { key: 'vip', label: 'VIP Elite', color: 'text-lime-accent' },
                    ] as const
                  ).map((tier) => (
                    <View
                      key={tier.key}
                      className="bg-background border border-[#22222E] p-3.5 rounded-2xl flex-1 min-w-[140px]"
                    >
                      <Text className={`text-[10px] font-mono uppercase ${tier.color}`}>
                        {tier.label}
                      </Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <Text className={`font-mono font-bold ${tier.color}`}>
                          $
                        </Text>
                        <TextInput
                          value={String(facilityForm.pricing[tier.key][cadence])}
                          onChangeText={(v) =>
                            setFacilityForm({
                              ...facilityForm,
                              pricing: {
                                ...facilityForm.pricing,
                                [tier.key]: {
                                  ...facilityForm.pricing[tier.key],
                                  [cadence]: Number(v) || 0,
                                },
                              },
                            })
                          }
                          keyboardType="numeric"
                          className="flex-1 text-lg font-display font-black text-white bg-transparent"
                        />
                      </View>
                      <Text className="text-[9px] font-mono text-[#666675]">
                        per athlete / {cadence === 'semiAnnual' ? '6 mo' : cadence}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <SectionSave onSave={saveBilling} saved={!!saved.billing} />
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 3: SECURITY */}
          {/* ================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'security') && (
            <Section
              title="Security"
              subtitle="Terminal access PIN"
              icon={<KeyRound size={16} color="#C8F135" />}
              iconBg="bg-lime-accent/15 border-lime-accent/30"
              expanded={expandedSections.security}
              onToggle={() => toggleSection('security')}
            >
              <View className="gap-4">
                <View className="flex-1">
                  <Text className="text-[11px] font-mono text-text-muted uppercase">
                    Master Terminal Security PIN
                  </Text>
                  <View className="flex-row items-center mt-1 bg-background border border-[#252532] rounded-xl">
                    <TextInput
                      value={profileForm.securityPin}
                      onChangeText={(v) =>
                        setProfileForm({ ...profileForm, securityPin: v })
                      }
                      secureTextEntry={!showPin}
                      maxLength={6}
                      className="flex-1 px-3.5 py-2.5 text-base text-white font-mono tracking-widest"
                      placeholderTextColor="#666675"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPin(!showPin)}
                      activeOpacity={0.7}
                      className="pr-3"
                    >
                      {showPin ? (
                        <EyeOff size={16} color="#8A8A9A" />
                      ) : (
                        <Eye size={16} color="#8A8A9A" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text className="text-[10px] font-mono text-[#666675] mt-1">
                    Used to unlock restricted admin actions.
                  </Text>
                </View>
              </View>
              <SectionSave onSave={saveSecurity} saved={!!saved.security} />
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 4: NOTIFICATIONS */}
          {/* ================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'notifications') && (
            <Section
              title="Notifications"
              subtitle="Automated alerts and reminders"
              icon={<Bell size={16} color="#5B8DEF" />}
              iconBg="bg-[#5B8DEF]/15 border-[#5B8DEF]/30"
              expanded={expandedSections.notifications}
              onToggle={() => toggleSection('notifications')}
            >
              <View className="gap-3">
                <View className="flex-row items-center gap-2 rounded-xl bg-[#5B8DEF]/10 border border-[#5B8DEF]/25 px-3 py-2 self-start">
                  <Bell size={13} color="#8A8A9A" />
                  <Text className="text-[11px] font-mono font-bold uppercase tracking-wide text-text-muted">
                    Coming soon
                  </Text>
                </View>
                {NOTIFICATION_ITEMS.map((item) => {
                  const isEnabled =
                    facilityForm.notifications[item.key];
                  return (
                    <View
                      key={item.key}
                      className="p-3.5 bg-background border border-[#22222E] rounded-2xl flex-row items-center justify-between gap-4 opacity-50"
                    >
                      <View className="flex-1 mr-2">
                        <Text className="text-xs font-bold text-white">
                          {item.title}
                        </Text>
                        <Text className="text-[11px] font-mono text-text-muted mt-0.5">
                          {item.desc}
                        </Text>
                      </View>
                      <ExpoSwitch
                        value={isEnabled}
                        disabled
                        onValueChange={() => {}}
                      />
                    </View>
                  );
                })}
              </View>
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 5: MAINTENANCE */}
          {/* ================================================================= */}
          {(activeCategory === 'all' || activeCategory === 'maintenance') && (
            <Section
              title="Maintenance"
              subtitle="Session"
              icon={<RotateCcw size={16} color="#FF4B1F" />}
              iconBg="bg-[#FF4B1F]/15 border-[#FF4B1F]/30"
              expanded={expandedSections.maintenance}
              onToggle={() => toggleSection('maintenance')}
              danger
            >
              <TouchableOpacity
                onPress={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                activeOpacity={0.7}
                className="p-4 bg-background border border-[#252532] rounded-2xl flex-row items-start gap-3"
              >
                <LogOut size={20} color="#FF4B1F" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-white">
                    Lock & Log Out Admin Session
                  </Text>
                  <Text className="text-[10px] font-mono text-text-muted">
                    {logoutMutation.isPending
                      ? 'Signing out...'
                      : 'Terminates session and returns to login.'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Section>
          )}
          </View>
        </Host>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

/* ── Sub-components ────────────────────────────────────────────────── */

function Section({
  title,
  subtitle,
  icon,
  iconBg,
  expanded,
  onToggle,
  danger,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  expanded: boolean;
  onToggle: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      className={`rounded-3xl overflow-hidden ${
        danger ? 'border border-[#FF4B1F]/30' : 'border border-border-subtle'
      } bg-card`}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        className="px-5 py-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          <View
            className={`w-8 h-8 rounded-xl border items-center justify-center ${iconBg}`}
          >
            {icon}
          </View>
          <View className="flex-1">
            <Text className="font-display text-base font-bold text-white">
              {title}
            </Text>
            <Text className="text-[11px] font-mono text-text-muted mt-0.5">
              {subtitle}
            </Text>
          </View>
        </View>
        <ChevronDown
          size={16}
          color="#8A8A9A"
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {expanded && (
        <View className="px-5 pb-5 border-t border-border-subtle">{children}</View>
      )}
    </View>
  );
}

function SectionSave({
  onSave,
  saved,
}: {
  onSave: () => void;
  saved: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between pt-4 mt-4 border-t border-border-subtle">
      {saved ? (
        <View className="flex-row items-center gap-1.5">
          <CheckCircle2 size={14} color="#C8F135" />
          <Text className="text-xs font-mono font-bold text-lime-accent">
            Saved
          </Text>
        </View>
      ) : (
        <View />
      )}
      <TouchableOpacity
        onPress={onSave}
        activeOpacity={0.7}
        className="flex-row items-center gap-1.5 bg-lime-accent px-4 py-2 rounded-xl"
      >
        <Save size={14} color="#000" />
        <Text className="font-display font-bold text-xs uppercase text-black">
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  icon,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  icon?: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <View className="flex-1">
      <Text className="text-[11px] font-mono text-text-muted uppercase">
        {label}
      </Text>
      <View className="flex-row items-center mt-1">
        {icon && (
          <View className="absolute left-3 z-10">{icon}</View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 2 : undefined}
          className={`w-full bg-background border border-[#252532] rounded-xl py-2.5 text-sm text-white font-mono ${
            icon ? 'pl-9 pr-3.5' : 'px-3.5'
          } ${multiline ? 'text-xs resize-none' : ''}`}
          placeholderTextColor="#666675"
        />
      </View>
    </View>
  );
}
