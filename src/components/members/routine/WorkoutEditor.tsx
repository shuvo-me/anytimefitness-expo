import {
  workoutWeekSchema,
  type WorkoutWeekForm,
} from "@/api/routine.schema";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
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
  useDeleteWorkoutDay,
  useDeleteWorkoutExercise,
  useSaveWorkoutWeek,
  useWorkoutDays,
} from "@/hooks/useMembers";
import { toDateInputValue } from "@/lib/date";
import type { Weekday, WorkoutDay } from "@/types/routine";
import { WEEKDAYS } from "@/types/routine";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, Save, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { FieldError, MiniLabel, routineInputClassName } from "./fields";
import { SaveFeedback } from "./SaveFeedback";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function toForm(days: WorkoutDay[]): WorkoutWeekForm {
  return {
    days: days.map((day) => ({
      id: day.id || newId("day"),
      weekday: day.weekday,
      title: day.title,
      focus: day.focus,
      exercises: day.exercises.map((exercise) => ({
        id: exercise.id || newId("ex"),
        name: exercise.name,
        sets: String(exercise.sets),
        reps: exercise.reps,
        weightKg: exercise.weightKg == null ? "" : String(exercise.weightKg),
      })),
    })),
  };
}

function toDomain(
  values: WorkoutWeekForm,
  memberId: string,
  existing: WorkoutDay[],
): WorkoutDay[] {
  const assignedById = new Map(
    existing.map((day) => [day.id, day.assignedDate]),
  );

  return values.days.map((day) => ({
    id: day.id,
    memberId,
    weekday: day.weekday as Weekday,
    title: day.title,
    focus: day.focus,
    assignedDate: assignedById.get(day.id) ?? toDateInputValue(),
    exercises: day.exercises.map((exercise) => ({
      id: exercise.id || newId("ex"),
      name: exercise.name,
      sets: Math.round(Number(exercise.sets)),
      reps: exercise.reps,
      weightKg:
        exercise.weightKg === "" ? null : Number(exercise.weightKg),
    })),
  }));
}

export function WorkoutEditor({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const { data, isLoading, isError, refetch } = useWorkoutDays(memberId);
  const saveMutation = useSaveWorkoutWeek(memberId);
  const deleteMutation = useDeleteWorkoutDay(memberId);
  const days = data ?? [];

  const { control, handleSubmit, reset, getValues } = useForm<WorkoutWeekForm>({
    resolver: zodResolver(workoutWeekSchema),
    defaultValues: toForm(days),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
    keyName: "key",
  });

  const [openDays, setOpenDays] = useState<string[]>([]);
  const openDayValues = openDays.filter((id) =>
    fields.some((field) => field.id === id),
  );

  const watchedDays = useWatch({ control, name: "days" });
  const usedWeekdays = new Set(
    (watchedDays ?? []).map((day) => day.weekday).filter(Boolean),
  );
  const canAddDay = WEEKDAYS.some((weekday) => !usedWeekdays.has(weekday));

  const dayIdsSignature = days.map((day) => day.id).join("|");
  const initializedSignature = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const next = dayIdsSignature || "empty";
    if (initializedSignature.current === next) return;
    initializedSignature.current = next;
    reset(toForm(data ?? []));
  }, [data, dayIdsSignature, isLoading, reset]);

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

  if (isError) {
    return (
      <Box className="p-4 gap-3 bg-background border border-border-subtle rounded-2xl">
        <SaveFeedback kind="error" message="Could not load this workout." />
        <Button
          onPress={() => refetch()}
          size="sm"
          className="rounded-xl self-start"
        >
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            Retry
          </ButtonText>
        </Button>
      </Box>
    );
  }

  const handleAddDay = () => {
    const nextWeekday = WEEKDAYS.find(
      (weekday) => !usedWeekdays.has(weekday),
    );
    if (!nextWeekday) return;

    const dayId = newId("day");
    setOpenDays((prev) => [...prev, dayId]);
    append({
      id: dayId,
      weekday: nextWeekday,
      title: "",
      focus: "",
      exercises: [],
    });
  };

  const handleRemoveDay = async (dayId: string, index: number) => {
    const isPersisted = days.some((day) => day.id === dayId);

    if (isPersisted) {
      const previousSignature = initializedSignature.current;
      const remainingDays = days.filter((day) => day.id !== dayId);
      initializedSignature.current =
        remainingDays.map((day) => day.id).join("|") || "empty";

      try {
        await deleteMutation.mutateAsync(dayId);
      } catch {
        initializedSignature.current = previousSignature;
        return;
      }
    }

    setOpenDays((prev) => prev.filter((id) => id !== dayId));
    remove(index);
  };

  const onSubmit = (values: WorkoutWeekForm) => {
    saveMutation.mutate(toDomain(values, memberId, days));
  };

  const onInvalid = (errors: FieldErrors<WorkoutWeekForm>) => {
    const errorDays = errors.days;
    if (!errorDays) return;

    const formDays = getValues("days") ?? [];
    const rootError = (errorDays as unknown as { root?: unknown }).root;
    const errorEntries = errorDays as unknown as Record<string, unknown>;

    const dayIds = rootError
      ? formDays.map((day) => day.id)
      : formDays
          .filter((_, index) => Boolean(errorEntries[String(index)]))
          .map((day) => day.id);

    if (dayIds.length === 0) return;
    setOpenDays((prev) => Array.from(new Set([...prev, ...dayIds])));
  };

  return (
    <VStack space="md">
      <HStack className="items-center justify-between">
        <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
          Weekly Split
        </Text>
        <HStack space="sm" className="items-center">
          <Button
            onPress={handleAddDay}
            isDisabled={!canAddDay}
            size="sm"
            variant="outline"
            className="rounded-xl shrink-0 h-8 min-h-8"
          >
            <ButtonIcon as={Plus} className="text-foreground w-3.5 h-3.5" />
            <ButtonText
              numberOfLines={1}
              className="font-display font-bold text-xs uppercase text-foreground"
            >
              Add Day
            </ButtonText>
          </Button>
          <Button
            onPress={handleSubmit(onSubmit, onInvalid)}
            isDisabled={saveMutation.isPending || deleteMutation.isPending}
            size="sm"
            className="rounded-xl shrink-0 h-8 min-h-8"
          >
            <ButtonIcon
              as={Save}
              className="text-primary-foreground w-3.5 h-3.5"
            />
            <ButtonText
              numberOfLines={1}
              className="font-display font-bold text-xs uppercase text-primary-foreground"
            >
              {saveMutation.isPending ? "Saving..." : "Save Week"}
            </ButtonText>
          </Button>
        </HStack>
      </HStack>

      {saveMutation.isSuccess && (
        <SaveFeedback
          kind="success"
          message={`Weekly workout assigned to ${memberName}.`}
        />
      )}
      {saveMutation.isError && (
        <SaveFeedback
          kind="error"
          message="Failed to save the weekly workout. Please try again."
        />
      )}
      {deleteMutation.isError && (
        <SaveFeedback
          kind="error"
          message="Failed to remove the day. Please try again."
        />
      )}

      <Accordion
        type="multiple"
        value={openDayValues}
        onValueChange={setOpenDays}
      >
        <VStack space="sm">
          {fields.map((field, index) => {
            const summary = watchedDays?.[index];
            const weekdayLabel = summary?.weekday || "Select day";
            const titleLabel = summary?.title?.trim() || "Untitled workout";
            const focusLabel = summary?.focus?.trim() || "No body part";
            const exerciseCount = summary?.exercises?.length ?? 0;

            return (
              <AccordionItem
                key={field.key}
                value={field.id}
                className="bg-background border border-border-subtle rounded-xl overflow-hidden"
              >
                <AccordionHeader className="m-0 px-0 py-0">
                  <AccordionTrigger className="px-3 py-2.5">
                    <Box className="flex-1 mr-2">
                      <HStack space="sm" className="items-center">
                        <Text className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                          {weekdayLabel}
                        </Text>
                        <AccordionTitleText className="text-xs font-bold text-foreground">
                          {titleLabel}
                        </AccordionTitleText>
                      </HStack>
                      <Text className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {focusLabel} • {exerciseCount}{" "}
                        {exerciseCount === 1 ? "exercise" : "exercises"}
                      </Text>
                    </Box>
                    <AccordionIcon
                      as={ChevronDown}
                      className="text-muted-foreground w-4 h-4"
                    />
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="px-3 pt-3 pb-3 border-t border-border-subtle">
                  <VStack space="md">
                    <HStack space="sm" className="items-start">
                      <Box className="w-[140px]">
                        <MiniLabel>Day</MiniLabel>
                        <Controller
                          control={control}
                          name={`days.${index}.weekday`}
                          render={({ field: weekdayField, fieldState }) => (
                            <Box className="gap-1">
                              <WeekdaySelect
                                value={weekdayField.value}
                                onChange={weekdayField.onChange}
                              />
                              <FieldError message={fieldState.error?.message} />
                            </Box>
                          )}
                        />
                      </Box>
                      <Box className="flex-1">
                        <MiniLabel>Workout Title</MiniLabel>
                        <Controller
                          control={control}
                          name={`days.${index}.title`}
                          render={({ field: titleField, fieldState }) => (
                            <Box className="gap-1">
                              <Input className={routineInputClassName}>
                                <InputField
                                  value={titleField.value}
                                  onChangeText={titleField.onChange}
                                  onBlur={titleField.onBlur}
                                  placeholder="e.g. Push Day"
                                  placeholderTextColor="#555566"
                                  className="w-full text-xs text-foreground font-bold font-mono"
                                />
                              </Input>
                              <FieldError message={fieldState.error?.message} />
                            </Box>
                          )}
                        />
                      </Box>
                    </HStack>

                    <Box>
                      <MiniLabel>Body Part</MiniLabel>
                      <Controller
                        control={control}
                        name={`days.${index}.focus`}
                        render={({ field: focusField, fieldState }) => (
                          <Box className="gap-1">
                            <Input className={routineInputClassName}>
                              <InputField
                                value={focusField.value}
                                onChangeText={focusField.onChange}
                                onBlur={focusField.onBlur}
                                placeholder="e.g. Chest & Triceps"
                                placeholderTextColor="#555566"
                                className="w-full text-xs text-primary font-bold font-mono"
                              />
                            </Input>
                            <FieldError message={fieldState.error?.message} />
                          </Box>
                        )}
                      />
                    </Box>

                    <DayExercises
                      control={control}
                      dayIndex={index}
                      memberId={memberId}
                      persistedDay={days.find((day) => day.id === field.id)}
                    />

                    <Button
                      onPress={() => handleRemoveDay(field.id, index)}
                      isDisabled={deleteMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="rounded-lg px-2.5 py-1.5 flex-row items-center gap-1 self-start"
                    >
                      <ButtonIcon
                        as={Trash2}
                        className="text-destructive w-3.5 h-3.5"
                      />
                      <ButtonText className="text-[10px] font-mono font-bold uppercase text-destructive">
                        {deleteMutation.isPending &&
                        deleteMutation.variables === field.id
                          ? "Removing..."
                          : "Remove Day"}
                      </ButtonText>
                    </Button>
                  </VStack>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </VStack>
      </Accordion>

      {fields.length === 0 && (
        <Box className="p-6 items-center bg-background border border-border-subtle rounded-xl">
          <Text className="text-xs font-mono text-muted-foreground text-center">
            No workout days yet.{" "}
            <Text className="text-primary">{'Tap "Add Day".'}</Text>
          </Text>
        </Box>
      )}
    </VStack>
  );
}

function DayExercises({
  control,
  dayIndex,
  memberId,
  persistedDay,
}: {
  control: Control<WorkoutWeekForm>;
  dayIndex: number;
  memberId: string;
  persistedDay?: WorkoutDay;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.exercises`,
  });
  const deleteMutation = useDeleteWorkoutExercise(memberId);
  const watchedExercises = useWatch({
    control,
    name: `days.${dayIndex}.exercises`,
  });

  const handleRemoveExercise = async (exerciseIndex: number) => {
    const exerciseId = watchedExercises?.[exerciseIndex]?.id;

    if (persistedDay?.id && exerciseId) {
      try {
        await deleteMutation.mutateAsync({
          dayId: persistedDay.id,
          exerciseId,
        });
      } catch {
        return;
      }
    }

    remove(exerciseIndex);
  };

  return (
    <VStack space="sm">
      <HStack className="items-center justify-between">
        <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
          Exercises ({fields.length})
        </Text>
        <Button
          onPress={() =>
            append({
              id: newId("ex"),
              name: "",
              sets: "3",
              reps: "8-10",
              weightKg: "",
            })
          }
          size="sm"
          className="bg-primary rounded-full px-3 py-1.5"
        >
          <ButtonIcon
            as={Plus}
            className="text-primary-foreground w-3.5 h-3.5"
          />
          <ButtonText className="font-display font-bold text-[10px] uppercase tracking-wider text-primary-foreground">
            Add Exercise
          </ButtonText>
        </Button>
      </HStack>

      {fields.map((exerciseField, exerciseIndex) => (
        <Box
          key={exerciseField.id}
          className="bg-card border border-border-subtle p-2.5 rounded-lg gap-2"
        >
          <HStack space="sm" className="items-start">
            <Box className="flex-1">
              <Controller
                control={control}
                name={`days.${dayIndex}.exercises.${exerciseIndex}.name`}
                render={({ field: nameField, fieldState }) => (
                  <Box className="gap-1">
                    <Input className={routineInputClassName}>
                      <InputField
                        value={nameField.value}
                        onChangeText={nameField.onChange}
                        onBlur={nameField.onBlur}
                        placeholder="Exercise name"
                        placeholderTextColor="#555566"
                        className="w-full text-xs text-foreground font-bold font-mono"
                      />
                    </Input>
                    <FieldError message={fieldState.error?.message} />
                  </Box>
                )}
              />
            </Box>
            <Button
              onPress={() => handleRemoveExercise(exerciseIndex)}
              isDisabled={deleteMutation.isPending}
              size="sm"
              variant="outline"
              className="rounded-lg px-2.5 py-1.5 flex-row items-center gap-1 mt-1"
            >
              <ButtonIcon
                as={Trash2}
                className="text-destructive w-3.5 h-3.5"
              />
            </Button>
          </HStack>

          <HStack space="sm" className="flex-wrap">
            <Box className="flex-1 min-w-[90px]">
              <MiniLabel>Sets</MiniLabel>
              <Controller
                control={control}
                name={`days.${dayIndex}.exercises.${exerciseIndex}.sets`}
                render={({ field: setsField, fieldState }) => (
                  <Box className="gap-1">
                    <Input className={routineInputClassName}>
                      <InputField
                        value={setsField.value}
                        onChangeText={setsField.onChange}
                        onBlur={setsField.onBlur}
                        keyboardType="numeric"
                        placeholder="3"
                        placeholderTextColor="#555566"
                        className="w-full text-xs text-foreground font-mono"
                      />
                    </Input>
                    <FieldError message={fieldState.error?.message} />
                  </Box>
                )}
              />
            </Box>
            <Box className="flex-1 min-w-[90px]">
              <MiniLabel>Reps</MiniLabel>
              <Controller
                control={control}
                name={`days.${dayIndex}.exercises.${exerciseIndex}.reps`}
                render={({ field: repsField, fieldState }) => (
                  <Box className="gap-1">
                    <Input className={routineInputClassName}>
                      <InputField
                        value={repsField.value}
                        onChangeText={repsField.onChange}
                        onBlur={repsField.onBlur}
                        placeholder="8-10"
                        placeholderTextColor="#555566"
                        className="w-full text-xs text-foreground font-mono"
                      />
                    </Input>
                    <FieldError message={fieldState.error?.message} />
                  </Box>
                )}
              />
            </Box>
            <Box className="flex-1 min-w-[90px]">
              <MiniLabel>Weight (kg)</MiniLabel>
              <Controller
                control={control}
                name={`days.${dayIndex}.exercises.${exerciseIndex}.weightKg`}
                render={({ field: weightField, fieldState }) => (
                  <Box className="gap-1">
                    <Input className={routineInputClassName}>
                      <InputField
                        value={weightField.value}
                        onChangeText={weightField.onChange}
                        onBlur={weightField.onBlur}
                        keyboardType="numeric"
                        placeholder="Optional"
                        placeholderTextColor="#555566"
                        className="w-full text-xs text-primary font-bold font-mono"
                      />
                    </Input>
                    <FieldError message={fieldState.error?.message} />
                  </Box>
                )}
              />
            </Box>
          </HStack>
        </Box>
      ))}

      {deleteMutation.isError && (
        <SaveFeedback
          kind="error"
          message="Failed to remove the exercise. Please try again."
        />
      )}

      {fields.length === 0 && (
        <Box className="p-4 items-center bg-card border border-border-subtle rounded-lg">
          <Text className="text-[11px] font-mono text-muted-foreground text-center">
            No exercises for this day.
          </Text>
        </Box>
      )}
    </VStack>
  );
}

function WeekdaySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select selectedValue={value} onValueChange={onChange}>
      <SelectTrigger
        variant="outline"
        size="md"
        className="bg-card border-border-subtle rounded-lg px-2.5 h-9 min-h-9"
      >
        <Box className="flex-1 flex-row items-center justify-between">
          <Text
            className={`text-xs font-mono ${
              value ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {value || "Select day"}
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
            {WEEKDAYS.map((weekday) => (
              <SelectItem key={weekday} label={weekday} value={weekday} />
            ))}
          </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
