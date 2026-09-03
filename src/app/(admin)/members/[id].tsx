import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
import { VStack } from "@/components/ui/vstack";
import {
  emptyProgram,
  type MemberDetail,
} from "@/services/members.service";
import {
  useDeleteMember,
  useMember,
  useSaveWorkoutProgram,
  useUpdateMember,
  useWorkoutProgram,
} from "@/hooks/useMembers";
import type { MembershipTier, MemberStatus } from "@/types/member";
import { TIER_OPTIONS } from "@/types/member";
import type {
  WorkoutExercise,
  WorkoutProgram,
} from "@/types/routine";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  Plus,
  Receipt,
  Save,
  Trash2,
  Utensils,
} from "lucide-react-native";
import { useState } from "react";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DetailTab = "profile" | "routine" | "edit";

export default function MemberDetailScreen() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const memberId = String(id);
  const {
    data: member,
    isLoading,
    isError,
    refetch,
  } = useMember(memberId);
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
        <Button
          onPress={() => refetch()}
          size="sm"
          className="rounded-xl"
        >
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
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
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

  return (
    <VStack space="lg">
      {/* 3 Metric Cards */}
      <HStack space="sm">
        <Box className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-[10px] font-mono text-muted-foreground uppercase">
            Total Sessions
          </Text>
          <Text className="font-display font-black text-2xl text-foreground mt-1">
            {member.totalSessions}
          </Text>
        </Box>
        <Box className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-[10px] font-mono text-muted-foreground uppercase">
            Days Left
          </Text>
          <Text className="font-display font-black text-2xl text-primary mt-1">
            {member.daysLeft}d
          </Text>
        </Box>
        <Box className="flex-1 bg-background border border-border-subtle p-3.5 rounded-2xl">
          <Text className="text-[10px] font-mono text-muted-foreground uppercase">
            Total Paid
          </Text>
          <Text className="font-display font-black text-2xl text-foreground mt-1">
            ৳{member.totalPaid}
          </Text>
        </Box>
      </HStack>

      {/* Goal & Details */}
      <Box className="bg-background border border-border-subtle p-4 rounded-2xl gap-2">
        <DetailRow label="Primary Goal" value={member.goal?.trim() || "—"} bold last={!member.phone} />
        {member.phone && (
          <DetailRow label="Phone" value={member.phone} last={!member.weightKg && !member.heightCm && !member.attendanceGoalDays} />
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
          <Text className="text-[10px] font-mono text-muted-foreground uppercase">
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
      <Box className="bg-background border border-border-subtle p-4 rounded-2xl flex-row items-center justify-between">
        <Box>
          <Text className="text-[10px] font-mono text-muted-foreground uppercase">
            Lifetime Collections
          </Text>
          <Text className="font-display font-black text-2xl mt-0.5 text-foreground">
            ৳{member.totalPaid}
          </Text>
        </Box>
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
            Collect Payment
          </ButtonText>
        </Button>
      </Box>
    </VStack>
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
    <Box
      className={`flex-row justify-between py-1.5 ${last ? "" : "border-b border-border-subtle"}`}
    >
      <Text className="text-muted-foreground font-mono text-xs">{label}:</Text>
      <Text
        className={`text-foreground text-xs text-right flex-1 ml-3 ${bold ? "font-bold" : ""}`}
      >
        {value}
      </Text>
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

/* ── Assigned Routine & Diet Tab ──────────────────────────────────── */

type RoutineSubTab = "workout" | "diet";

function RoutineTab({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const [activeSubTab, setActiveSubTab] = useState<RoutineSubTab>("workout");

  const { data: fetched, isLoading } = useWorkoutProgram(memberId);
  const [draft, setDraft] = useState<WorkoutProgram | null>(null);
  const saveMutation = useSaveWorkoutProgram(memberId);

  const program = draft ?? fetched ?? emptyProgram(memberId);

  if (isLoading) {
    return (
      <Box className="p-10 items-center bg-card border border-border-subtle rounded-2xl">
        <Spinner color="#C8F135" />
        <Text className="text-xs font-mono text-muted-foreground mt-3">
          Loading routine...
        </Text>
      </Box>
    );
  }

  const handleDeploy = () => {
    saveMutation.mutate(program);
  };

  const updateProgram = (patch: Partial<WorkoutProgram>) =>
    setDraft((prev) => ({ ...(prev ?? program), ...patch }));

  const handleAddExercise = () => {
    const newEx: WorkoutExercise = {
      id: `ex-${Date.now()}`,
      name: "Barbell Bench Press",
      targetMuscle: "Chest & Triceps",
      sets: 4,
      reps: "8-10",
      targetWeightKg: 70,
      completedSets: [false, false, false, false],
      instructions: "Retract scapula, lower bar to sternum with control.",
    };
    setDraft((prev) => {
      const base = prev ?? program;
      return { ...base, exercises: [...base.exercises, newEx] };
    });
  };

  const handleUpdateExercise = (
    index: number,
    field: keyof WorkoutExercise,
    value: string | number,
  ) => {
    setDraft((prev) => {
      const base = prev ?? program;
      const updated = [...base.exercises];
      if (field === "sets") {
        const numSets = Number(value) || 3;
        updated[index] = {
          ...updated[index],
          sets: numSets,
          completedSets: Array(numSets).fill(false),
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...base, exercises: updated };
    });
  };

  const handleRemoveExercise = (index: number) => {
    setDraft((prev) => {
      const base = prev ?? program;
      return { ...base, exercises: base.exercises.filter((_, i) => i !== index) };
    });
  };

  return (
    <VStack space="md">
      {/* Sub tabs + Deploy */}
      <HStack className="items-center justify-between">
        <HStack space="sm" className="items-center">
          <SubTabChip
            label="Workout Split"
            icon={
              <Dumbbell
                size={14}
                color={activeSubTab === "workout" ? "#000" : "#8A8A9A"}
              />
            }
            active={activeSubTab === "workout"}
            onPress={() => setActiveSubTab("workout")}
          />
          <SubTabChip
            label="Diet & Macros"
            icon={
              <Utensils
                size={14}
                color={activeSubTab === "diet" ? "#000" : "#8A8A9A"}
              />
            }
            active={activeSubTab === "diet"}
            onPress={() => setActiveSubTab("diet")}
          />
        </HStack>
        <Button
          onPress={handleDeploy}
          isDisabled={saveMutation.isPending}
          size="sm"
          className="rounded-xl"
        >
          <ButtonIcon as={Save} className="text-primary-foreground w-3.5 h-3.5" />
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            {saveMutation.isPending ? "Saving..." : "Deploy"}
          </ButtonText>
        </Button>
      </HStack>

      {saveMutation.isSuccess && (
        <Box className="p-3 bg-primary/15 border border-primary/40 rounded-xl flex-row items-center gap-2">
          <CheckCircle2 size={16} color="#C8F135" />
          <Text className="text-xs font-mono text-foreground flex-1">
            Saved routine for {memberName}!
          </Text>
        </Box>
      )}
      {saveMutation.isError && (
        <Box className="p-3 bg-destructive/15 border border-destructive/40 rounded-xl flex-row items-center gap-2">
          <AlertTriangle size={16} color="#FF4B1F" />
          <Text className="text-xs font-mono text-foreground flex-1">
            Failed to save routine. Please try again.
          </Text>
        </Box>
      )}

      {activeSubTab === "workout" ? (
        <WorkoutBuilder
          program={program}
          onChangeProgram={updateProgram}
          onAdd={handleAddExercise}
          onUpdate={handleUpdateExercise}
          onRemove={handleRemoveExercise}
        />
      ) : (
        <Box className="p-10 items-center bg-background border border-border-subtle rounded-2xl gap-2">
          <Utensils size={22} color="#8A8A9A" />
          <Text className="text-sm font-mono text-muted-foreground text-center">
            Diet & nutrition plans —{'\n'}coming in a future update.
          </Text>
        </Box>
      )}
    </VStack>
  );
}

function SubTabChip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      onPress={onPress}
      size="sm"
      className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${
        active ? "bg-primary" : "bg-card border border-border-subtle"
      }`}
    >
      {icon}
      <ButtonText
        className={`text-[11px] font-mono font-bold uppercase ${
          active ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </ButtonText>
    </Button>
  );
}

function WorkoutBuilder({
  program,
  onChangeProgram,
  onAdd,
  onUpdate,
  onRemove,
}: {
  program: WorkoutProgram;
  onChangeProgram: (patch: Partial<WorkoutProgram>) => void;
  onAdd: () => void;
  onUpdate: (i: number, f: keyof WorkoutExercise, v: string | number) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <VStack space="lg">
      {/* Program detail card */}
      <Box className="bg-background border border-border-subtle p-4 rounded-2xl gap-3">
        <VStack space="md">
          <Box className="flex-1">
            <InputLabel>Program Title</InputLabel>
            <Input className="w-full bg-card border border-border-subtle rounded-xl px-3 py-2">
              <InputField
                value={program.programTitle}
                onChangeText={(v) => onChangeProgram({ programTitle: v })}
                placeholder="e.g. 4-Day Upper/Lower Hypertrophy"
                placeholderTextColor="#555566"
                className="w-full text-xs text-foreground font-mono"
              />
            </Input>
          </Box>
          <Box className="flex-1">
            <InputLabel>Active Day Focus</InputLabel>
            <Input className="w-full bg-card border border-border-subtle rounded-xl px-3 py-2">
              <InputField
                value={program.currentDayTitle}
                onChangeText={(v) => onChangeProgram({ currentDayTitle: v })}
                placeholder="e.g. Day 1: Push (Chest / Shoulders / Triceps)"
                placeholderTextColor="#555566"
                className="w-full text-xs text-primary font-bold font-mono"
              />
            </Input>
          </Box>
          <Box className="flex-1">
            <InputLabel>Split Schedule</InputLabel>
            <Input className="w-full bg-card border border-border-subtle rounded-xl px-3 py-2">
              <InputField
                value={program.splitSchedule}
                onChangeText={(v) => onChangeProgram({ splitSchedule: v })}
                placeholder="e.g. Mon / Tue / Thu / Fri"
                placeholderTextColor="#555566"
                className="w-full text-xs text-foreground font-mono"
              />
            </Input>
          </Box>
        </VStack>
        <Box>
          <InputLabel>Coach Execution Notes</InputLabel>
          <Input className="w-full bg-card border border-border-subtle rounded-xl px-3 py-2">
            <InputField
              value={program.notes}
              onChangeText={(v) => onChangeProgram({ notes: v })}
              multiline
              numberOfLines={2}
              placeholder="Focus notes for the assigned program"
              placeholderTextColor="#555566"
              className="w-full text-xs text-foreground font-mono"
            />
          </Input>
        </Box>
      </Box>

      {/* Exercise list */}
      <VStack space="sm">
        <HStack className="items-center justify-between">
          <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
            Prescribed Exercises ({program.exercises.length})
          </Text>
          <Button
            onPress={onAdd}
            size="sm"
            className="bg-primary rounded-full px-3 py-1.5"
          >
            <ButtonIcon as={Plus} className="text-primary-foreground w-3.5 h-3.5" />
            <ButtonText className="font-display font-bold text-[11px] uppercase tracking-wider text-primary-foreground">
              Add Exercise
            </ButtonText>
          </Button>
        </HStack>

        {program.exercises.map((ex, idx) => (
          <Box
            key={ex.id || idx}
            className="bg-background border border-border-subtle p-3 rounded-xl gap-2"
          >
            <HStack space="sm" className="items-center">
              <Input className="flex-1 bg-card border border-border-subtle rounded-lg px-2 py-1">
                <InputField
                  value={ex.name}
                  onChangeText={(v) => onUpdate(idx, "name", v)}
                  placeholderTextColor="#555566"
                  className="w-full text-xs text-foreground font-bold font-mono"
                />
              </Input>
              <Button
                onPress={() => onRemove(idx)}
                size="sm"
                variant="outline"
                className="rounded-lg px-2.5 py-1.5 flex-row items-center gap-1"
              >
                <ButtonIcon as={Trash2} className="text-destructive w-3.5 h-3.5" />
                <ButtonText className="text-[10px] font-mono font-bold uppercase text-destructive">
                  Remove
                </ButtonText>
              </Button>
            </HStack>

            <HStack space="sm" className="flex-wrap">
              <Box className="flex-1 min-w-[110px]">
                <MiniLabel>Muscle</MiniLabel>
                <Input className="w-full bg-card border border-border-subtle rounded-lg px-2 py-1">
                  <InputField
                    value={ex.targetMuscle}
                    onChangeText={(v) => onUpdate(idx, "targetMuscle", v)}
                    placeholderTextColor="#555566"
                    className="w-full text-xs text-foreground font-mono"
                  />
                </Input>
              </Box>
              <Box className="flex-1 min-w-[110px]">
                <MiniLabel>Sets</MiniLabel>
                <Input className="w-full bg-card border border-border-subtle rounded-lg px-2 py-1">
                  <InputField
                    value={String(ex.sets)}
                    onChangeText={(v) => onUpdate(idx, "sets", v)}
                    keyboardType="numeric"
                    placeholderTextColor="#555566"
                    className="w-full text-xs text-foreground font-mono"
                  />
                </Input>
              </Box>
              <Box className="flex-1 min-w-[110px]">
                <MiniLabel>Reps</MiniLabel>
                <Input className="w-full bg-card border border-border-subtle rounded-lg px-2 py-1">
                  <InputField
                    value={ex.reps}
                    onChangeText={(v) => onUpdate(idx, "reps", v)}
                    placeholderTextColor="#555566"
                    className="w-full text-xs text-foreground font-mono"
                  />
                </Input>
              </Box>
              <Box className="flex-1 min-w-[110px]">
                <MiniLabel>Weight (kg)</MiniLabel>
                <Input className="w-full bg-card border border-border-subtle rounded-lg px-2 py-1">
                  <InputField
                    value={String(ex.targetWeightKg)}
                    onChangeText={(v) => onUpdate(idx, "targetWeightKg", v)}
                    keyboardType="numeric"
                    placeholderTextColor="#555566"
                    className="w-full text-xs text-primary font-bold font-mono"
                  />
                </Input>
              </Box>
            </HStack>
          </Box>
        ))}
        {program.exercises.length === 0 && (
          <Box className="p-6 items-center bg-background border border-border-subtle rounded-xl">
            <Text className="text-xs font-mono text-muted-foreground text-center">
              No exercises yet.{" "}
              <Text className="text-primary">{'Tap "+" Add Exercise.'}</Text>
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}

function InputLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-muted-foreground font-mono text-[10px] uppercase mb-1">
      {children}
    </Text>
  );
}

function MiniLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-[10px] text-muted-foreground font-mono">{children}</Text>
  );
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

  const [editName, setEditName] = useState(member.name);
  const [editTier, setEditTier] = useState<MembershipTier>(member.tier);
  const [editStatus, setEditStatus] = useState<MemberStatus>(member.status);
  const [editGoal, setEditGoal] = useState(member.goal ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = () => {
    if (updateMutation.isPending) return;
    updateMutation.mutate(
      {
        id: member.id,
        patch: {
          fullName: editName.trim() || member.name,
          tier: editTier,
          status: editStatus,
          goal: editGoal.trim() || null,
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

      <Box>
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

      <HStack space="md" className="pt-1">
        <Box className="flex-1">
          <FieldLabel>Tier</FieldLabel>
          <FormSelect
            value={editTier}
            options={TIER_OPTIONS}
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
              <ButtonText className="text-xs font-mono text-foreground">Cancel</ButtonText>
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
