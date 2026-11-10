import { RoutineTab } from "@/components/members/routine/RoutineTab";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  DateTimePicker,
  DateTimePickerIcon,
  DateTimePickerInput,
  DateTimePickerTrigger,
} from "@/components/ui/date-time-picker";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useDeleteMember,
  useMember,
  useUpdateMember,
} from "@/hooks/useMembers";
import { useFacilitySettings } from "@/hooks/useSettings";
import { openWhatsApp } from "@/lib/whatsapp";
import type { MemberDetail } from "@/services/members.service";
import type { MembershipTier, MemberStatus } from "@/types/member";
import { TIER_OPTIONS } from "@/types/member";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Receipt,
  Trash2,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DetailTab = "profile" | "routine" | "edit";

export default function MemberDetailScreen() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const memberId = String(id);
  const { data: member, isLoading, isError, refetch } = useMember(memberId);
  const [activeTab, setActiveTab] = useState<DetailTab>("profile");

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background items-center justify-center">
        <Spinner color="#C8F135" />
        <Text className="text-xs font-mono text-muted-foreground mt-3">
          Loading member...
        </Text>
        <StatusBar style="light" />
      </Box>
    );
  }

  if (isError || !member) {
    return (
      <Box className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-sm font-mono text-destructive text-center mb-4">
          Could not load this member.
        </Text>
        <Button onPress={() => refetch()} size="sm" className="rounded-xl">
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            Retry
          </ButtonText>
        </Button>
        <StatusBar style="light" />
      </Box>
    );
  }

  const isExpired = member.status === "expired";
  const isPending = member.status === "pending";
  const isSuspended = member.status === "suspended";
  const statusColor = isExpired
    ? "text-destructive"
    : isSuspended
      ? "text-warning"
      : isPending
        ? "text-warning"
        : "text-primary";
  const avatarBg = isExpired
    ? "bg-destructive/15 border-destructive/30"
    : isSuspended
      ? "bg-warning/15 border-warning/30"
      : isPending
        ? "bg-warning/15 border-warning/30"
        : "bg-primary/15 border-primary/30";
  const avatarText = isExpired
    ? "text-destructive"
    : isSuspended
      ? "text-warning"
      : isPending
        ? "text-warning"
        : "text-primary";

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          backgroundColor: "#0C0C0F",
          paddingTop: inset.top + 16,
          paddingBottom: inset.bottom + 24,
          flexGrow: 1,
        }}
      >
        <VStack space="xl">
          {/* Header */}
          <HStack className="items-center justify-between">
            <Button
              onPress={() => router.back()}
              size="icon"
              className="w-10 h-10 rounded-xl bg-card border border-border-subtle items-center justify-center"
            >
              <ButtonIcon as={ArrowLeft} className="text-foreground" />
            </Button>
            <Text className="font-display font-black text-lg uppercase tracking-tight text-foreground">
              Member Profile
            </Text>
            <Box className="w-10 h-10" />
          </HStack>

          {/* Title block */}
          <Box className="bg-card border border-border-subtle p-4 rounded-2xl">
            <HStack space="md" className="items-center">
              <Box
                className={`w-12 h-12 rounded-full items-center justify-center border ${avatarBg}`}
              >
                <Text
                  className={`font-display font-black text-base tracking-tight ${avatarText}`}
                >
                  {member.initials}
                </Text>
              </Box>
              <Box className="flex-1">
                <HStack space="sm" className="items-center">
                  <Text className="font-display font-black text-xl uppercase tracking-tight text-foreground leading-none">
                    {member.name}
                  </Text>
                  <Box
                    className={`px-2 py-0.5 rounded-full border ${
                      isExpired
                        ? "bg-destructive/15 border-destructive/30"
                        : isSuspended
                          ? "bg-warning/15 border-warning/30"
                          : isPending
                            ? "bg-warning/15 border-warning/30"
                            : "bg-primary/15 border-primary/30"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-mono font-bold ${statusColor}`}
                    >
                      {member.status.toUpperCase()}
                    </Text>
                  </Box>
                </HStack>
                <Text className="text-xs font-mono text-muted-foreground mt-1">
                  {member.displayId} • {member.tier} Plan
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* Tab bar — pill filter style matching members list */}
          <HStack space="sm" className="items-center">
            {(
              [
                { key: "profile", label: "Overview" },
                { key: "routine", label: "Routine" },
                { key: "edit", label: "Edit" },
              ] as { key: DetailTab; label: string }[]
            ).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Button
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  size="sm"
                  className={`px-4 py-1.5 rounded-full ${
                    isActive
                      ? "bg-primary"
                      : "bg-card border border-border-subtle"
                  }`}
                >
                  <ButtonText
                    className={`text-xs font-bold font-sans uppercase tracking-wider ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </ButtonText>
                </Button>
              );
            })}
          </HStack>

          {activeTab === "profile" && <OverviewTab member={member} />}
          {activeTab === "routine" && (
            <RoutineTab memberId={member.id} memberName={member.name} />
          )}
          {activeTab === "edit" && <EditTab member={member} />}
        </VStack>
      </ScrollView>
      <StatusBar style="light" />
    </>
  );
}

/* ── Overview & Stats Tab ─────────────────────────────────────────── */

function OverviewTab({ member }: { member: MemberDetail }) {
  const router = useRouter();
  const canCollect = member.status === "pending" || member.status === "expired";

  return (
    <VStack space="lg">
      {/* 3 Metric Cards */}
      <HStack space="sm">
        <Box className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-2xs font-mono text-muted-foreground uppercase">
            Total Sessions
          </Text>
          <Text className="font-display font-black text-2xl text-foreground mt-1">
            {member.totalSessions}
          </Text>
        </Box>
        <Box className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-2xs font-mono text-muted-foreground uppercase">
            Days Left
          </Text>
          <Text className="font-display font-black text-2xl text-primary mt-1">
            {member.daysLeft}d
          </Text>
        </Box>
        <Box className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-2xs font-mono text-muted-foreground uppercase">
            Admission Fee
          </Text>
          <Text className="font-display font-black text-2xl text-foreground mt-1">
            ৳{member.admissionFee}
          </Text>
        </Box>
      </HStack>

      {/* Goal & Details */}
      <Box className="bg-background border border-border-subtle p-4 rounded-2xl gap-2">
        <DetailRow
          label="Primary Goal"
          value={member.goal?.trim() || "—"}
          bold
          last={!member.phone}
        />
        {member.phone && (
          <DetailRow
            label="Phone"
            value={member.phone}
            onPress={() => openWhatsApp(member.phone)}
            last={
              !member.weightKg && !member.heightCm && !member.attendanceGoalDays
            }
          />
        )}
        {(member.weightKg != null || member.heightCm != null) && (
          <DetailRow
            label="Weight & Height"
            value={`${member.weightKg ?? "—"} kg / ${member.heightCm ?? "—"} cm`}
            last={!member.attendanceGoalDays}
          />
        )}
        {member.attendanceGoalDays != null && (
          <DetailRow
            label="Target Attendance"
            value={`${member.attendanceGoalDays} days / mo`}
            last
          />
        )}
        <DetailRow
          label="Emergency"
          value={
            member.emergencyContact
              ? `${member.emergencyContact.name || "—"} (${
                  member.emergencyContact.relation || "—"
                }) - ${member.emergencyContact.phone || "—"}`
              : "—"
          }
          last
        />
      </Box>

      {/* Subscription */}
      <Box className="bg-background border border-border-subtle p-4 rounded-2xl gap-2">
        <HStack className="items-center justify-between mb-1">
          <Text className="text-2xs font-mono text-muted-foreground uppercase">
            Subscription
          </Text>
          <Box
            className={`px-2 py-0.5 rounded-full ${
              member.status === "active"
                ? "bg-primary/15"
                : member.status === "expired"
                  ? "bg-destructive/15"
                  : "bg-warning/15"
            }`}
          >
            <Text
              className={`text-[10px] font-mono font-bold uppercase ${
                member.status === "active"
                  ? "text-primary"
                  : member.status === "expired"
                    ? "text-destructive"
                    : "text-warning"
              }`}
            >
              {member.status}
            </Text>
          </Box>
        </HStack>
        <DetailRow label="Plan" value={member.tier} bold />
        <DetailRow
          label="Start Date"
          value={member.startDate ? formatDate(member.startDate) : "—"}
        />
        <DetailRow
          label="End Date"
          value={member.expiryDate ? formatDate(member.expiryDate) : "—"}
          last
        />
      </Box>

      {/* Financial */}
      <Box className="bg-background border border-border-subtle rounded-2xl p-4">
        {/* Header */}
        <Box className="flex-row items-center justify-between mb-4">
          <Box>
            <Text className="text-[10px] font-mono text-muted-foreground uppercase">
              Total Lifetime Payment Summary
            </Text>
          </Box>

          {canCollect ? (
            <Button
              onPress={() =>
                router.push({
                  pathname: "/(admin)/payments/collect",
                  params: { memberId: member.id },
                })
              }
              size="sm"
              className="rounded-xl"
            >
              <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
                Collect
              </ButtonText>
            </Button>
          ) : (
            <Text className="text-[10px] font-mono text-muted-foreground uppercase">
              Active until{" "}
              {member.expiryDate ? formatDate(member.expiryDate) : "—"}
            </Text>
          )}
        </Box>

        {/* Lifetime total */}
        <Box className="bg-muted/30 rounded-xl p-3.5 mb-3">
          <Text className="font-display font-black text-2xl text-foreground mt-1">
            ৳{member.totalPaid}
          </Text>
        </Box>
      </Box>
    </VStack>
  );
}

function DetailRow({
  label,
  value,
  bold,
  last,
  onPress,
}: {
  label: string;
  value: string;
  bold?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  const valueClassName = `text-xs text-right flex-1 ml-3 ${bold ? "font-bold" : ""}`;

  return (
    <Box
      className={`flex-row justify-between py-1.5 ${last ? "" : "border-b border-border-subtle"}`}
    >
      <Text className="text-muted-foreground font-mono text-xs">{label}:</Text>
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="link"
          accessibilityLabel={`${label}: ${value}`}
          className="flex-row items-center justify-end flex-1 ml-3 gap-1 active:opacity-70"
        >
          <Text className={`${valueClassName} text-primary underline`}>
            {value}
          </Text>
          <MessageCircle size={12} color="#C8F135" />
        </Pressable>
      ) : (
        <Text className={`${valueClassName} text-foreground`}>{value}</Text>
      )}
    </Box>
  );
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

/* ── Edit Membership Tab ──────────────────────────────────────────── */

const STATUS_OPTIONS: { label: string; value: MemberStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Suspended", value: "suspended" },
  { label: "Pending", value: "pending" },
];

function EditTab({ member }: { member: MemberDetail }) {
  const router = useRouter();
  const updateMutation = useUpdateMember();
  const deleteMutation = useDeleteMember();
  const { data: facilitySettings } = useFacilitySettings();

  const [editName, setEditName] = useState(member.name);
  const [editAdmissionFee, setEditAdmissionFee] = useState<number | undefined>(
    member.admissionFee,
  );
  const [editTier, setEditTier] = useState<MembershipTier>(member.tier);
  const [editStatus, setEditStatus] = useState<MemberStatus>(member.status);
  const [editGoal, setEditGoal] = useState(member.goal ?? "");
  const [editStartDate, setEditStartDate] = useState<Date | undefined>(
    member.startDate ? new Date(`${member.startDate}T00:00:00`) : undefined,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const symbol = facilitySettings?.currencySymbol ?? "৳";
  const tierOptions = TIER_OPTIONS.map((t) => ({
    value: t.value,
    label: `${t.value} (${
      t.value === "Monthly"
        ? (facilitySettings?.pricing.monthly ?? 0)
        : (facilitySettings?.pricing.yearly ?? 0)
    }${symbol}/${t.value === "Monthly" ? "mo" : "yr"})`,
  }));

  const handleSave = () => {
    if (updateMutation.isPending) return;
    const toDateInputValue = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    updateMutation.mutate(
      {
        id: member.id,
        patch: {
          fullName: editName.trim() || member.name,
          tier: editTier,
          status: editStatus,
          goal: editGoal.trim() || null,
          admissionFee: editAdmissionFee,
          ...(editStartDate
            ? { startDate: toDateInputValue(editStartDate) }
            : {}),
        },
      },
      {
        onSuccess: () => {
          setFeedbackMsg({
            kind: "success",
            text: "Member updated successfully!",
          });
          setTimeout(() => setFeedbackMsg(null), 3000);
        },
        onError: () => {
          setFeedbackMsg({ kind: "error", text: "Failed to update member." });
          setTimeout(() => setFeedbackMsg(null), 3000);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(member.id, {
      onSuccess: () => {
        setFeedbackMsg({ kind: "success", text: `${member.name} removed` });
        setTimeout(() => {
          setFeedbackMsg(null);
          router.back();
        }, 1200);
      },
      onError: () => {
        setFeedbackMsg({ kind: "error", text: "Failed to remove member." });
        setTimeout(() => setFeedbackMsg(null), 3000);
      },
    });
  };

  return (
    <VStack space="md">
      {feedbackMsg && (
        <Box
          className={`p-3 rounded-xl flex-row items-center gap-2 ${
            feedbackMsg.kind === "success"
              ? "bg-primary/15 border border-primary/40"
              : "bg-destructive/15 border border-destructive/40"
          }`}
        >
          <CheckCircle2
            size={16}
            color={feedbackMsg.kind === "success" ? "#C8F135" : "#FF4B1F"}
          />
          <Text className="text-xs font-mono text-foreground flex-1">
            {feedbackMsg.text}
          </Text>
        </Box>
      )}

      <HStack space="md">
        <Box className="flex-1">
          <FieldLabel>Member Name</FieldLabel>
          <Input className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2">
            <InputField
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor="#555566"
              className="w-full text-xs text-foreground font-mono"
            />
          </Input>
        </Box>

        <Box className="flex-1">
          <FieldLabel>Admission Fee</FieldLabel>
          <Input className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2">
            <InputField
              keyboardType="numeric"
              value={
                editAdmissionFee !== undefined ? String(editAdmissionFee) : ""
              }
              onChangeText={(text) => {
                setEditAdmissionFee(text === "" ? undefined : Number(text));
              }}
              placeholderTextColor="#555566"
              className="w-full text-xs text-foreground font-mono"
            />
          </Input>
        </Box>
      </HStack>

      <HStack space="md" className="pt-1">
        <Box className="flex-1">
          <FieldLabel>Onboarding Date</FieldLabel>
          <DateTimePicker
            value={editStartDate}
            onChange={(date) => setEditStartDate(date)}
            mode="date"
            maximumDate={new Date()}
            placeholder="Select onboarding date"
            format="YYYY-MM-DD"
          >
            <DateTimePickerTrigger
              variant="outline"
              size="md"
              className="bg-background border-border-subtle rounded-xl h-11 px-3.5"
            >
              <DateTimePickerInput className="font-mono text-sm flex-1" />
              <DateTimePickerIcon
                as={Calendar}
                className="text-muted-foreground"
              />
            </DateTimePickerTrigger>
          </DateTimePicker>
        </Box>
      </HStack>

      <HStack space="md" className="pt-1">
        <Box className="flex-1">
          <FieldLabel>Tier</FieldLabel>
          <FormSelect
            value={editTier}
            options={tierOptions}
            onChange={(v) => setEditTier(v as MembershipTier)}
          />
        </Box>
        <Box className="flex-1">
          <FieldLabel>Status</FieldLabel>
          <FormSelect
            value={editStatus}
            options={STATUS_OPTIONS}
            onChange={(v) => setEditStatus(v as MemberStatus)}
          />
        </Box>
      </HStack>

      <Box className="pt-1">
        <FieldLabel>Goal Description</FieldLabel>
        <Input className="w-full bg-background border border-border-subtle rounded-xl px-3 py-2">
          <InputField
            value={editGoal}
            onChangeText={setEditGoal}
            placeholderTextColor="#555566"
            className="w-full text-xs text-foreground font-mono"
          />
        </Input>
      </Box>

      {showDeleteConfirm && (
        <Box className="p-4 bg-destructive/15 border border-destructive/40 rounded-2xl gap-3">
          <HStack space="sm" className="items-center">
            <AlertTriangle size={18} color="#FF4B1F" />
            <Text className="text-xs font-mono font-bold text-destructive">
              Confirm Member Removal
            </Text>
          </HStack>
          <Text className="text-xs text-foreground/80">
            Are you sure you want to permanently remove {editName} from the gym
            roster? This action cannot be undone.
          </Text>
          <HStack space="sm" className="justify-end">
            <Button
              onPress={() => setShowDeleteConfirm(false)}
              size="sm"
              variant="outline"
              className="rounded-lg"
            >
              <ButtonText className="text-xs font-mono text-foreground">
                Cancel
              </ButtonText>
            </Button>
            <Button
              onPress={handleDelete}
              isDisabled={deleteMutation.isPending}
              size="sm"
              variant="destructive"
              className="rounded-lg"
            >
              <ButtonText className="text-xs font-mono font-bold text-foreground">
                {deleteMutation.isPending ? "Removing..." : "Confirm Delete"}
              </ButtonText>
            </Button>
          </HStack>
        </Box>
      )}

      <Box className="pt-3 flex-row items-center justify-between border-t border-border-subtle">
        <HStack space="xs" className="items-center">
          <Receipt size={14} color="#8A8A9A" />
          <Text className="text-[10px] font-mono text-muted-foreground">
            ৳{member.totalPaid} collected lifetime
          </Text>
        </HStack>
        <Button
          onPress={handleSave}
          isDisabled={updateMutation.isPending}
          size="sm"
          className="rounded-xl"
        >
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </ButtonText>
        </Button>
      </Box>

      <Button
        onPress={() => setShowDeleteConfirm(true)}
        size="sm"
        variant="outline"
        className="rounded-xl flex-row items-center gap-1.5 self-start"
      >
        <ButtonIcon as={Trash2} className="text-destructive w-4 h-4" />
        <ButtonText className="text-xs font-mono text-destructive">
          Remove Member
        </ButtonText>
      </Button>
    </VStack>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-muted-foreground font-mono text-[10px] uppercase mb-1">
      {children}
    </Text>
  );
}

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
        className="bg-background border-border-subtle rounded-xl px-3 min-h-10"
      >
        <Box className="flex-1 flex-row items-center justify-between">
          <Text className="text-xs font-mono text-foreground">
            {selected?.label ?? "Select"}
          </Text>
          <ChevronDown size={14} color="#8A8A9A" />
        </Box>
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
