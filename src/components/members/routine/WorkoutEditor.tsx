import {
  workoutProgramSchema,
  type WorkoutProgramForm,
} from "@/api/routine.schema";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSaveWorkoutProgram, useWorkoutProgram } from "@/hooks/useMembers";
import { emptyProgram } from "@/services/members.service";
import type { WorkoutProgram } from "@/types/routine";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FieldError, FieldLabel, MiniLabel } from "./fields";
import { SaveFeedback } from "./SaveFeedback";

const inputClassName =
  "w-full bg-card border border-border-subtle rounded-lg px-2 py-1";

function newExerciseId(): string {
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function toForm(program: WorkoutProgram): WorkoutProgramForm {
  return {
    title: program.title,
    exercises: program.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      sets: String(exercise.sets),
      reps: exercise.reps,
      weightKg: exercise.weightKg == null ? "" : String(exercise.weightKg),
    })),
  };
}

function toDomain(
  values: WorkoutProgramForm,
  program: WorkoutProgram,
): WorkoutProgram {
  return {
    id: program.id,
    memberId: program.memberId,
    title: values.title,
    assignedDate: program.assignedDate,
    exercises: values.exercises.map((exercise) => ({
      id: exercise.id || newExerciseId(),
      name: exercise.name,
      sets: Math.round(Number(exercise.sets)),
      reps: exercise.reps,
      weightKg:
        exercise.weightKg === "" ? null : Number(exercise.weightKg),
    })),
  };
}

export function WorkoutEditor({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const { data, isLoading, isError, refetch } = useWorkoutProgram(memberId);
  const saveMutation = useSaveWorkoutProgram(memberId);
  const program = data ?? emptyProgram(memberId);

  const { control, handleSubmit, reset } = useForm<WorkoutProgramForm>({
    resolver: zodResolver(workoutProgramSchema),
    defaultValues: toForm(program),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const initializedPlanId = useRef<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const planId = data.id || "new";
    if (initializedPlanId.current === planId) return;
    initializedPlanId.current = planId;
    reset(toForm(data));
  }, [data, reset]);

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
        <Button onPress={() => refetch()} size="sm" className="rounded-xl self-start">
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            Retry
          </ButtonText>
        </Button>
      </Box>
    );
  }

  const onSubmit = (values: WorkoutProgramForm) => {
    saveMutation.mutate(toDomain(values, program));
  };

  return (
    <VStack space="md">
      <HStack className="items-center justify-between">
        <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
          Workout Plan
        </Text>
        <Button
          onPress={handleSubmit(onSubmit)}
          isDisabled={saveMutation.isPending}
          size="sm"
          className="rounded-xl"
        >
          <ButtonIcon as={Save} className="text-primary-foreground w-3.5 h-3.5" />
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            {saveMutation.isPending ? "Saving..." : "Save"}
          </ButtonText>
        </Button>
      </HStack>

      {saveMutation.isSuccess && (
        <SaveFeedback
          kind="success"
          message={`Workout assigned to ${memberName}.`}
        />
      )}
      {saveMutation.isError && (
        <SaveFeedback
          kind="error"
          message="Failed to save the workout. Please try again."
        />
      )}

      <Box className="bg-background border border-border-subtle p-4 rounded-2xl gap-3">
        <Box>
          <FieldLabel>Workout Title</FieldLabel>
          <Controller
            control={control}
            name="title"
            render={({ field, fieldState }) => (
              <Box className="gap-1">
                <Input className={inputClassName}>
                  <InputField
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="e.g. Push Day"
                    placeholderTextColor="#555566"
                    className="w-full text-xs text-foreground font-mono"
                  />
                </Input>
                <FieldError message={fieldState.error?.message} />
              </Box>
            )}
          />
        </Box>
      </Box>

      <VStack space="sm">
        <HStack className="items-center justify-between">
          <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
            Exercises ({fields.length})
          </Text>
          <Button
            onPress={() =>
              append({
                id: newExerciseId(),
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
            <ButtonText className="font-display font-bold text-[11px] uppercase tracking-wider text-primary-foreground">
              Add Exercise
            </ButtonText>
          </Button>
        </HStack>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            className="bg-background border border-border-subtle p-3 rounded-xl gap-2"
          >
            <HStack space="sm" className="items-center">
              <Box className="flex-1 gap-1">
                <Controller
                  control={control}
                  name={`exercises.${index}.name`}
                  render={({ field: nameField, fieldState }) => (
                    <Box className="gap-1">
                      <Input className={inputClassName}>
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
                onPress={() => remove(index)}
                size="sm"
                variant="outline"
                className="rounded-lg px-2.5 py-1.5 flex-row items-center gap-1"
              >
                <ButtonIcon
                  as={Trash2}
                  className="text-destructive w-3.5 h-3.5"
                />
                <ButtonText className="text-[10px] font-mono font-bold uppercase text-destructive">
                  Remove
                </ButtonText>
              </Button>
            </HStack>

            <HStack space="sm" className="flex-wrap">
              <Box className="flex-1 min-w-[90px]">
                <MiniLabel>Sets</MiniLabel>
                <Controller
                  control={control}
                  name={`exercises.${index}.sets`}
                  render={({ field: setsField, fieldState }) => (
                    <Box className="gap-1">
                      <Input className={inputClassName}>
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
                  name={`exercises.${index}.reps`}
                  render={({ field: repsField, fieldState }) => (
                    <Box className="gap-1">
                      <Input className={inputClassName}>
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
                  name={`exercises.${index}.weightKg`}
                  render={({ field: weightField, fieldState }) => (
                    <Box className="gap-1">
                      <Input className={inputClassName}>
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

        {fields.length === 0 && (
          <Box className="p-6 items-center bg-background border border-border-subtle rounded-xl">
            <Text className="text-xs font-mono text-muted-foreground text-center">
              No exercises yet.{" "}
              <Text className="text-primary">{'Tap "Add Exercise".'}</Text>
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
