import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  InputField as GInputField,
  Input,
  InputIcon,
  InputSlot,
} from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useLogout } from "@/hooks/useAuth";
import {
  useAdminProfileSettings,
  useFacilitySettings,
  useUpdateAdminProfile,
  useUpdateFacilitySettings,
} from "@/hooks/useSettings";
import type {
  AdminProfileSettings,
  FacilitySettings,
  SettingCategory,
} from "@/types/admin";
import {
  DEFAULT_ADMIN_PROFILE,
  DEFAULT_FACILITY_SETTINGS,
} from "@/types/admin";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  RotateCcw,
  Save,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ExpandedSections = Record<string, boolean>;

const ALL_SECTIONS: ExpandedSections = {
  profile: true,
  billing: true,
  security: true,
  notifications: true,
  maintenance: true,
};

const CATEGORY_CHIPS: { id: SettingCategory; label: string }[] = [
  { id: "all", label: "All Settings" },
  { id: "profile", label: "Profile" },
  { id: "billing", label: "Billing" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "maintenance", label: "Maintenance" },
];

const NOTIFICATION_ITEMS = [
  {
    key: "overduePaymentReminders" as const,
    title: "Automated Dues SMS / Push Reminders",
    desc: "Send gentle renewal notifications 3 days before membership expiration.",
  },
  {
    key: "peakCapacityAlerts" as const,
    title: "Floor Overcrowding Push Notification",
    desc: "Notify staff when floor attendance exceeds 85% capacity.",
  },
  {
    key: "dailyExecutiveDigest" as const,
    title: "Daily 08:00 AM Revenue & Check-In Digest",
    desc: "Morning summary of check-ins, signups, and delinquent accounts.",
  },
  {
    key: "instantOnboardingAlerts" as const,
    title: "Instant New Athlete Onboarding Alert",
    desc: "Alert front desk when a new member registers via kiosk.",
  },
];

function humanizeError(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return "Failed to save. Please try again.";
}

export default function AdminSettings() {
  const { data: profileData, isLoading: loadingProfile } =
    useAdminProfileSettings();
  const { data: facilityData, isLoading: loadingFacility } =
    useFacilitySettings();

  if (loadingProfile || loadingFacility) {
    return (
      <Box className="flex-1 bg-background items-center justify-center">
        <Text className="text-sm font-mono text-muted-foreground">
          Loading settings...
        </Text>
        <StatusBar style="light" />
      </Box>
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

  const [activeCategory, setActiveCategory] = useState<SettingCategory>("all");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [pendingSave, setPendingSave] = useState<Record<string, boolean>>({});
  const [saveError, setSaveError] = useState<Record<string, string | null>>({});
  const [showPin, setShowPin] = useState(false);
  const [cadence, setCadence] = useState<"monthly" | "yearly">("monthly");

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

  const runSave = async (key: string, saveFn: () => Promise<unknown>) => {
    setPendingSave((prev) => ({ ...prev, [key]: true }));
    setSaveError((prev) => ({ ...prev, [key]: null }));
    try {
      await saveFn();
      flashSaved(key);
    } catch (err) {
      setSaveError((prev) => ({ ...prev, [key]: humanizeError(err) }));
    } finally {
      setPendingSave((prev) => ({ ...prev, [key]: false }));
    }
  };

  const saveProfile = () =>
    runSave("profile", () => updateProfile.mutateAsync(profileForm));

  const saveBilling = () =>
    runSave("billing", () =>
      updateFacility.mutateAsync({ pricing: facilityForm.pricing }),
    );

  const saveSecurity = () =>
    runSave("security", () =>
      updateProfile.mutateAsync({ securityPin: profileForm.securityPin }),
    );

  return (
    <Box className="flex-1 bg-background">
      {/* Fixed top: header + category filter chips */}
      <Box
        style={{ paddingTop: inset.top + 16, paddingHorizontal: 16 }}
        className="bg-background"
      >
        <Box className="gap-3">
          <Box className="gap-1">
            <Text className="font-display font-black text-2xl uppercase tracking-tight text-foreground">
              Settings
            </Text>
            <Text className="text-xs font-mono text-muted-foreground">
              {profileForm.name} · {profileForm.title}
            </Text>
          </Box>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, flexDirection: "row" }}
          >
            {CATEGORY_CHIPS.map((chip) => (
              <Button
                key={chip.id}
                onPress={() => setActiveCategory(chip.id)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                  activeCategory === chip.id
                    ? "bg-primary"
                    : "bg-card border border-border"
                }`}
              >
                <ButtonText
                  className={`text-xs font-mono ${
                    activeCategory === chip.id
                      ? "text-primary-foreground font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {chip.label}
                </ButtonText>
              </Button>
            ))}
          </ScrollView>
        </Box>
      </Box>

      {/* Scrollable sections */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: inset.bottom + 24,
        }}
      >
        <Box className="gap-6">
          {/* ================================================================= */}
          {/* SECTION 1: PROFILE */}
          {/* ================================================================= */}
          {(activeCategory === "all" || activeCategory === "profile") && (
            <Section
              title="Profile"
              subtitle="Name and contact information"
              icon={<User size={16} color="#C8F135" />}
              iconBg="bg-primary/15 border-primary/30"
              expanded={expandedSections.profile}
              onToggle={() => toggleSection("profile")}
            >
              <Box className="gap-4">
                <InputField
                  label="Full Legal Name"
                  value={profileForm.name}
                  onChangeText={(v) =>
                    setProfileForm({ ...profileForm, name: v })
                  }
                  placeholder="e.g. Alex Morgan"
                />

                <Box className="flex-col gap-4">
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
                </Box>
              </Box>
              <SectionSave
                onSave={saveProfile}
                saved={!!saved.profile}
                loading={pendingSave.profile}
                error={saveError.profile}
              />
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 2: MEMBERSHIP & BILLING */}
          {/* ================================================================= */}
          {(activeCategory === "all" || activeCategory === "billing") && (
            <Section
              title="Membership & Billing"
              subtitle="Plan prices by billing cadence"
              icon={<CreditCard size={16} color="#C8F135" />}
              iconBg="bg-primary/15 border-primary/30"
              expanded={expandedSections.billing}
              onToggle={() => toggleSection("billing")}
            >
              <Box className="gap-4">
                {/* Billing Cadence Selector */}
                <Box className="flex-row gap-2 p-1.5 bg-card border border-border rounded-2xl">
                  {(
                    [
                      { key: "monthly", label: "Monthly" },
                      { key: "yearly", label: "Yearly" },
                    ] as const
                  ).map((opt) => (
                    <Button
                      key={opt.key}
                      onPress={() => setCadence(opt.key)}
                      className={`flex-1 py-2.5 rounded-xl ${
                        cadence === opt.key ? "bg-primary" : "bg-transparent"
                      }`}
                    >
                      <ButtonText
                        className={`text-xs font-mono font-bold text-center ${
                          cadence === opt.key
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </ButtonText>
                    </Button>
                  ))}
                </Box>

                {/* Single Price per Cadence */}
                <Box className="flex-1">
                  <Text className="text-[11px] font-mono text-muted-foreground uppercase">
                    {cadence === "monthly" ? "Monthly Price" : "Yearly Price"}
                  </Text>
                  <Input className="w-full bg-background border-border rounded-xl h-12 mt-1.5 px-3.5 flex-row items-center">
                    <Text className="text-lg font-mono font-bold text-muted-foreground mr-2">
                      {facilityForm.currencySymbol}
                    </Text>
                    <GInputField
                      value={
                        typeof facilityForm.pricing[cadence] === "number"
                          ? String(facilityForm.pricing[cadence])
                          : ""
                      }
                      onChangeText={(v) =>
                        setFacilityForm({
                          ...facilityForm,
                          pricing: {
                            ...facilityForm.pricing,
                            [cadence]: Number(v) || 0,
                          },
                        })
                      }
                      keyboardType="numeric"
                      className="flex-1 text-xl font-display font-black text-foreground"
                      placeholderTextColor="#666675"
                    />
                  </Input>
                </Box>
              </Box>
              <SectionSave
                onSave={saveBilling}
                saved={!!saved.billing}
                loading={pendingSave.billing}
                error={saveError.billing}
              />
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 3: SECURITY */}
          {/* ================================================================= */}
          {(activeCategory === "all" || activeCategory === "security") && (
            <Section
              title="Security"
              subtitle="Terminal access PIN"
              icon={<KeyRound size={16} color="#C8F135" />}
              iconBg="bg-primary/15 border-primary/30"
              expanded={expandedSections.security}
              onToggle={() => toggleSection("security")}
            >
              <Box className="gap-4">
                <Box className="flex-1">
                  <Text className="text-[11px] font-mono text-muted-foreground uppercase">
                    Master Terminal Security PIN
                  </Text>
                  <Input className="flex-row items-center mt-1.5 bg-background border-border rounded-xl px-3.5 h-11">
                    <GInputField
                      value={profileForm.securityPin}
                      onChangeText={(v) =>
                        setProfileForm({ ...profileForm, securityPin: v })
                      }
                      secureTextEntry={!showPin}
                      maxLength={6}
                      className="flex-1 text-base text-foreground font-mono tracking-widest"
                      placeholderTextColor="#666675"
                    />
                    <InputSlot onPress={() => setShowPin(!showPin)}>
                      <InputIcon
                        as={showPin ? EyeOff : Eye}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                  </Input>
                  <Text className="text-[11px] font-mono text-muted-foreground mt-1.5">
                    Used to unlock restricted admin actions.
                  </Text>
                </Box>
              </Box>
              <SectionSave
                onSave={saveSecurity}
                saved={!!saved.security}
                loading={pendingSave.security}
                error={saveError.security}
              />
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 4: NOTIFICATIONS */}
          {/* ================================================================= */}
          {(activeCategory === "all" || activeCategory === "notifications") && (
            <Section
              title="Notifications"
              subtitle="Automated alerts and reminders"
              icon={<Bell size={16} color="#5B8DEF" />}
              iconBg="bg-blue-accent/15 border-blue-accent/30"
              expanded={expandedSections.notifications}
              onToggle={() => toggleSection("notifications")}
            >
              <Box className="gap-3">
                <Box className="flex-row items-center gap-2 rounded-xl bg-blue-accent/10 border border-blue-accent/25 px-3 py-2 self-start">
                  <Bell size={13} color="#8A8A9A" />
                  <Text className="text-[11px] font-mono font-bold uppercase tracking-wide text-muted-foreground">
                    Coming soon
                  </Text>
                </Box>
                {NOTIFICATION_ITEMS.map((item) => {
                  const isEnabled = facilityForm.notifications[item.key];
                  return (
                    <Box
                      key={item.key}
                      className="p-3.5 bg-background border border-border rounded-2xl flex-row items-center justify-between gap-4 opacity-50"
                    >
                      <Box className="flex-1 mr-2">
                        <Text className="text-xs font-bold text-foreground">
                          {item.title}
                        </Text>
                        <Text className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          {item.desc}
                        </Text>
                      </Box>
                      <Switch
                        value={isEnabled}
                        disabled
                        onValueChange={() => {}}
                        trackColor={{ true: "#C8F135", false: "#2A2A34" }}
                        thumbColor="#FFFFFF"
                      />
                    </Box>
                  );
                })}
              </Box>
            </Section>
          )}

          {/* ================================================================= */}
          {/* SECTION 5: MAINTENANCE */}
          {/* ================================================================= */}
          {(activeCategory === "all" || activeCategory === "maintenance") && (
            <Section
              title="Maintenance"
              subtitle="Session"
              icon={<RotateCcw size={16} color="#FF4B1F" />}
              iconBg="bg-destructive/15 border-destructive/30"
              expanded={expandedSections.maintenance}
              onToggle={() => toggleSection("maintenance")}
              danger
            >
              <Button
                onPress={() => logoutMutation.mutate()}
                isDisabled={logoutMutation.isPending}
                variant="ghost"
                className="p-4 bg-background border border-border rounded-2xl flex-row items-start gap-3 w-full"
              >
                <ButtonIcon as={LogOut} className="text-destructive w-5 h-5" />
                <Box className="flex-1">
                  <Text className="text-xs font-bold text-foreground">
                    Lock & Log Out Admin Session
                  </Text>
                  <Text className="text-[10px] font-mono text-muted-foreground">
                    {logoutMutation.isPending
                      ? "Signing out..."
                      : "Terminates session and returns to login."}
                  </Text>
                </Box>
              </Button>
            </Section>
          )}
        </Box>
      </ScrollView>
      <StatusBar style="light" />
    </Box>
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
    <Box
      className={`rounded-3xl overflow-hidden ${
        danger ? "border border-destructive/30" : "border border-border"
      } bg-card`}
    >
      <Button
        onPress={onToggle}
        variant="ghost"
        className="px-5 py-4 flex-row items-center justify-between"
      >
        <Box className="flex-row items-center gap-3 flex-1 mr-2">
          <Box
            className={`w-8 h-8 rounded-xl border items-center justify-center ${iconBg}`}
          >
            {icon}
          </Box>
          <Box className="flex-1">
            <Text className="font-display text-base font-bold text-foreground">
              {title}
            </Text>
            <Text className="text-[11px] font-mono text-muted-foreground mt-0.5">
              {subtitle}
            </Text>
          </Box>
        </Box>
        <ChevronDown
          size={16}
          color="#8A8A9A"
          style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
        />
      </Button>

      {expanded && (
        <Box className="px-5 pt-5 pb-5 border-t border-border">{children}</Box>
      )}
    </Box>
  );
}

function SectionSave({
  onSave,
  saved,
  loading = false,
  error = null,
}: {
  onSave: () => void;
  saved: boolean;
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <Box className="pt-4 mt-4 border-t border-border gap-3">
      {error && (
        <Box className="p-3 bg-destructive/15 border border-destructive/40 rounded-xl flex-row items-center gap-2">
          <AlertCircle size={16} color="#FF4B1F" />
          <Text className="text-xs font-mono text-foreground flex-1">
            {error}
          </Text>
        </Box>
      )}
      <Box className="flex-row items-center justify-between">
        {saved && !loading && !error ? (
          <Box className="flex-row items-center gap-1.5">
            <CheckCircle2 size={14} color="#C8F135" />
            <Text className="text-xs font-mono font-bold text-primary">
              Saved
            </Text>
          </Box>
        ) : (
          <Box />
        )}
        <Button
          onPress={onSave}
          isDisabled={loading}
          className="flex-row items-center gap-1.5 bg-primary px-4 py-2 rounded-xl"
        >
          {loading ? (
            <Spinner size="small" color="#101014" />
          ) : (
            <ButtonIcon
              as={Save}
              className="text-primary-foreground w-3.5 h-3.5"
            />
          )}
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            {loading ? "Saving..." : "Save"}
          </ButtonText>
        </Button>
      </Box>
    </Box>
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
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  icon?: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <Box className="flex-1">
      <Text className="text-[11px] font-mono text-muted-foreground uppercase">
        {label}
      </Text>
      <Input
        className={`w-full bg-background border-border rounded-xl h-11 mt-1.5 ${
          icon ? "pr-3.5" : "px-3.5"
        }`}
      >
        {icon && <InputSlot>{icon}</InputSlot>}
        <GInputField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 2 : undefined}
          className={`w-full text-sm text-foreground font-mono ${
            multiline ? "text-xs" : ""
          }`}
          placeholderTextColor="#666675"
        />
      </Input>
    </Box>
  );
}
