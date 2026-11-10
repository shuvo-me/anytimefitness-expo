import { dietPlanSchema, type DietPlanForm } from "@/api/routine.schema";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useDietPlan, useSaveDietPlan } from "@/hooks/useDietPlan";
import { emptyDietPlan } from "@/services/diet.service";
import type { DietPlan } from "@/types/routine";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FieldError, FieldLabel, MiniLabel } from "./fields";
import { SaveFeedback } from "./SaveFeedback";

const inputClassName =
  "w-full bg-card border border-border-subtle rounded-lg px-2 py-1";

function newMealId(): string {
  return `meal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function toForm(plan: DietPlan): DietPlanForm {
  return {
    title: plan.title,
    waterGoalLiters: String(plan.waterGoalMl / 1000),
    meals: plan.meals.map((meal) => ({
      id: meal.id,
      time: meal.time,
      title: meal.title,
      description: meal.description,
    })),
  };
}

function toDomain(values: DietPlanForm, plan: DietPlan): DietPlan {
  return {
    id: plan.id,
    memberId: plan.memberId,
    title: values.title,
    waterGoalMl: Math.round(Number(values.waterGoalLiters) * 1000),
    assignedDate: plan.assignedDate,
    meals: values.meals.map((meal) => ({
      id: meal.id || newMealId(),
      time: meal.time,
      title: meal.title,
      description: meal.description,
    })),
  };
}

export function DietEditor({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const { data, isLoading, isError, refetch } = useDietPlan(memberId);
  const saveMutation = useSaveDietPlan(memberId);
  const plan = data ?? emptyDietPlan(memberId);

  const { control, handleSubmit, reset } = useForm<DietPlanForm>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues: toForm(plan),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meals",
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
          Loading diet plan...
        </Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="p-4 gap-3 bg-background border border-border-subtle rounded-2xl">
        <SaveFeedback kind="error" message="Could not load this diet plan." />
        <Button onPress={() => refetch()} size="sm" className="rounded-xl self-start">
          <ButtonText className="font-display font-bold text-xs uppercase text-primary-foreground">
            Retry
          </ButtonText>
        </Button>
      </Box>
    );
  }

  const onSubmit = (values: DietPlanForm) => {
    saveMutation.mutate(toDomain(values, plan));
  };

  return (
    <VStack space="md">
      <HStack className="items-center justify-between">
        <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
          Diet Plan
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
          message={`Diet plan assigned to ${memberName}.`}
        />
      )}
      {saveMutation.isError && (
        <SaveFeedback
          kind="error"
          message="Failed to save the diet plan. Please try again."
        />
      )}

      <Box className="bg-background border border-border-subtle p-4 rounded-2xl gap-3">
        <HStack space="md">
          <Box className="flex-1">
            <FieldLabel>Plan Title</FieldLabel>
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
                      placeholder="e.g. Lean Bulk"
                      placeholderTextColor="#555566"
                      className="w-full text-xs text-foreground font-mono"
                    />
                  </Input>
                  <FieldError message={fieldState.error?.message} />
                </Box>
              )}
            />
          </Box>
          <Box className="flex-1">
            <FieldLabel>Water Goal (L)</FieldLabel>
            <Controller
              control={control}
              name="waterGoalLiters"
              render={({ field, fieldState }) => (
                <Box className="gap-1">
                  <Input className={inputClassName}>
                    <InputField
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      keyboardType="numeric"
                      placeholder="3"
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

      <VStack space="sm">
        <HStack className="items-center justify-between">
          <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
            Meals ({fields.length})
          </Text>
          <Button
            onPress={() =>
              append({
                id: newMealId(),
                time: "",
                title: "",
                description: "",
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
              Add Meal
            </ButtonText>
          </Button>
        </HStack>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            className="bg-background border border-border-subtle p-3 rounded-xl gap-2"
          >
            <HStack space="sm" className="items-center">
              <Box className="w-[92px]">
                <MiniLabel>Time</MiniLabel>
                <Controller
                  control={control}
                  name={`meals.${index}.time`}
                  render={({ field: timeField, fieldState }) => (
                    <Box className="gap-1">
                      <Input className={inputClassName}>
                        <InputField
                          value={timeField.value}
                          onChangeText={timeField.onChange}
                          onBlur={timeField.onBlur}
                          placeholder="08:00 AM"
                          placeholderTextColor="#555566"
                          className="w-full text-xs text-foreground font-mono"
                        />
                      </Input>
                      <FieldError message={fieldState.error?.message} />
                    </Box>
                  )}
                />
              </Box>
              <Box className="flex-1">
                <MiniLabel>Meal</MiniLabel>
                <Controller
                  control={control}
                  name={`meals.${index}.title`}
                  render={({ field: titleField, fieldState }) => (
                    <Box className="gap-1">
                      <Input className={inputClassName}>
                        <InputField
                          value={titleField.value}
                          onChangeText={titleField.onChange}
                          onBlur={titleField.onBlur}
                          placeholder="e.g. Breakfast"
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
                className="rounded-lg px-2.5 py-1.5 flex-row items-center gap-1 self-end mb-0.5"
              >
                <ButtonIcon
                  as={Trash2}
                  className="text-destructive w-3.5 h-3.5"
                />
              </Button>
            </HStack>

            <Box>
              <MiniLabel>Description</MiniLabel>
              <Controller
                control={control}
                name={`meals.${index}.description`}
                render={({ field: descriptionField, fieldState }) => (
                  <Box className="gap-1">
                    <Input className={inputClassName}>
                      <InputField
                        value={descriptionField.value}
                        onChangeText={descriptionField.onChange}
                        onBlur={descriptionField.onBlur}
                        multiline
                        numberOfLines={2}
                        placeholder="e.g. Oats, whey, banana"
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
        ))}

        {fields.length === 0 && (
          <Box className="p-6 items-center bg-background border border-border-subtle rounded-xl">
            <Text className="text-xs font-mono text-muted-foreground text-center">
              No meals yet.{" "}
              <Text className="text-primary">{'Tap "Add Meal".'}</Text>
            </Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
