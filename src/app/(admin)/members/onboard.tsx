import { MemberForm, memberSchema } from "@/api/member.schema";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAddMember } from "@/hooks/useMembers";
import { MembershipTier, TIER_OPTIONS } from "@/types/member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronDown,
  Phone,
  User,
  UserPlus,
  X,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";

const GOALS = [
  "Hypertrophy & Strength",
  "Fat Loss & Conditioning",
  "Powerlifting & Heavy Compound",
  "Endurance & Mobility",
  "Hybrid Athletic Performance",
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
        className="bg-background border-border rounded-xl px-3.5 h-11"
      >
        <HStack className="flex-1 items-center justify-between">
          {selected ? (
            <Text className="text-sm font-mono text-foreground flex-1 pr-2">
              {selected.label}
            </Text>
          ) : (
            <Text className="text-sm font-mono text-muted-foreground flex-1 pr-2">
              Select...
            </Text>
          )}
          <ChevronDown size={14} color="#8A8A9A" />
        </HStack>
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="bg-card border-border">
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text className="text-[11px] font-mono text-destructive">{message}</Text>
  );
}

export default function MemberOnboard() {
  const router = useRouter();
  const addMember = useAddMember();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      tier: "Monthly",
      initialPayment: true,
      goal: GOALS[0],
      weightKg: "",
      heightCm: "",
      attendanceGoalDays: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    addMember.mutate(values, {
      onError: () => {},
    });
  });

  const created = addMember.isSuccess;

  const getTierPrice = (t: MembershipTier) => {
    switch (t) {
      case "Monthly":
        return "৳600 / mo";
      case "Yearly":
        return "৳7000 / yr";
    }
  };

  return (
    <Box className="flex-1 bg-background">
      {created ? (
        <VStack className="flex-1 items-center justify-center px-8" space="lg">
          <Box className="w-16 h-16 rounded-full bg-primary/20 items-center justify-center mb-4 border border-primary">
            <CheckCircle2 size={32} color="#C8F135" />
          </Box>
          <Text className="font-display font-black text-2xl uppercase text-foreground text-center">
            Member Enrolled Successfully!
          </Text>
          <Text className="text-xs font-mono text-muted-foreground">
            Profile created and workout setup initialized.
          </Text>
          <Button
            onPress={() => router.back()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-primary"
          >
            <ButtonText className="font-display font-bold text-xs uppercase tracking-wider text-primary-foreground">
              Done
            </ButtonText>
          </Button>
        </VStack>
      ) : (
        <>
          {/* Header */}
          <HStack className="px-5 pt-5 pb-3 border-b border-border items-center justify-between">
            <HStack className="items-center gap-2.5">
              <Box className="w-8 h-8 rounded-xl bg-primary items-center justify-center">
                <UserPlus size={16} color="#000000" />
              </Box>
              <Box>
                <Text className="font-display font-black text-lg uppercase tracking-tight text-foreground leading-none">
                  Member Onboarding
                </Text>
                <Text className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  ANYTIMEFITNESS ENROLLMENT
                </Text>
              </Box>
            </HStack>
            <Button
              onPress={() => router.back()}
              className="w-8 h-8 rounded-full bg-muted items-center justify-center"
            >
              <ButtonIcon as={X} className="text-muted-foreground" />
            </Button>
          </HStack>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 32,
            }}
          >
            <VStack space="4xl">
              {addMember.isError && (
                <Box className="p-3 bg-destructive/15 border border-destructive/40 rounded-xl">
                  <Text className="text-xs font-mono text-destructive">
                    {addMember.error?.message ??
                      "Failed to add member. Please try again."}
                  </Text>
                </Box>
              )}

              {/* 1. Athlete Identity */}
              <VStack space="lg">
                <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
                  1. Athlete Identity
                </Text>
                <VStack space="lg">
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Box className="gap-1.5">
                        <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                          Full Name *
                        </Text>
                        <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                          <InputSlot>
                            <InputIcon
                              as={User}
                              className="text-muted-foreground w-4 h-4"
                            />
                          </InputSlot>
                          <InputField
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="e.g. Marcus Vance"
                            placeholderTextColor="#666675"
                            className="font-mono text-sm"
                          />
                        </Input>
                      </Box>
                    )}
                  />
                  <FieldError message={errors.fullName?.message} />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Box className="gap-1.5">
                        <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                          Phone Number *
                        </Text>
                        <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                          <InputSlot>
                            <InputIcon
                              as={Phone}
                              className="text-muted-foreground w-4 h-4"
                            />
                          </InputSlot>
                          <InputField
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="phone-pad"
                            placeholder="+1 (555) 000-0000"
                            placeholderTextColor="#666675"
                            className="font-mono text-sm"
                          />
                        </Input>
                      </Box>
                    )}
                  />
                  <FieldError message={errors.phone?.message} />
                </VStack>
              </VStack>

              {/* 2. Membership Tier & Billing */}
              <VStack space="lg" className="pt-6 border-t border-border">
                <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
                  2. Membership Tier & Billing
                </Text>
                <Controller
                  control={control}
                  name="tier"
                  render={({ field: { onChange, value } }) => (
                    <HStack space="md" className="flex-wrap">
                      {TIER_OPTIONS.map((t) => {
                        const isSelected = value === t.value;
                        return (
                          <Button
                            key={t.value}
                            onPress={() => onChange(t.value)}
                            className={`flex-1 min-w-[45%] p-3 rounded-xl border ${
                              isSelected
                                ? "bg-primary/15 border-primary"
                                : "bg-background border-border"
                            }`}
                          >
                            <ButtonText
                              className={`text-xs font-bold ${
                                isSelected ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {t.value}
                            </ButtonText>
                            <Text className="text-[10px] font-mono mt-1 text-muted-foreground">
                              {getTierPrice(t.value)}
                            </Text>
                          </Button>
                        );
                      })}
                    </HStack>
                  )}
                />

                <Controller
                  control={control}
                  name="initialPayment"
                  render={({ field: { onChange, value } }) => (
                    <HStack
                      space="lg"
                      className="items-center justify-between p-3 rounded-xl bg-background border border-border"
                    >
                      <Box className="flex-1 mr-2">
                        <Text className="text-xs font-bold text-foreground">
                          Process Initial Payment Now
                        </Text>
                        <Text className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          Instantly marks subscription active & logs transaction
                        </Text>
                      </Box>
                      <Switch
                        value={value}
                        onValueChange={onChange}
                        trackColor={{ false: "#22222E", true: "#C8F135" }}
                        thumbColor="#FFFFFF"
                      />
                    </HStack>
                  )}
                />
              </VStack>

              {/* 3. Fitness Targets */}
              <VStack space="lg" className="pt-6 border-t border-border">
                <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
                  3. Fitness Targets
                </Text>
                <Box className="gap-1.5">
                  <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                    Primary Goal
                  </Text>
                  <Controller
                    control={control}
                    name="goal"
                    render={({ field: { onChange, value } }) => (
                      <FormSelect
                        value={value}
                        options={GOALS.map((g) => ({ label: g, value: g }))}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>
                <HStack space="lg">
                  <Box className="flex-1">
                    <Controller
                      control={control}
                      name="weightKg"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box className="gap-1.5">
                          <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                            Weight (kg)
                          </Text>
                          <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                            <InputField
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              keyboardType="numeric"
                              placeholderTextColor="#666675"
                              className="font-mono text-sm"
                            />
                          </Input>
                        </Box>
                      )}
                    />
                  </Box>
                  <Box className="flex-1">
                    <Controller
                      control={control}
                      name="heightCm"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box className="gap-1.5">
                          <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                            Height (cm)
                          </Text>
                          <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                            <InputField
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              keyboardType="numeric"
                              placeholderTextColor="#666675"
                              className="font-mono text-sm"
                            />
                          </Input>
                        </Box>
                      )}
                    />
                  </Box>
                  <Box className="flex-1">
                    <Controller
                      control={control}
                      name="attendanceGoalDays"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box className="gap-1.5">
                          <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                            Target Days/Mo
                          </Text>
                          <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                            <InputField
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              keyboardType="numeric"
                              placeholderTextColor="#666675"
                              className="font-mono text-sm"
                            />
                          </Input>
                        </Box>
                      )}
                    />
                  </Box>
                </HStack>
              </VStack>

              {/* 4. Emergency Contact */}
              <VStack space="lg" className="pt-6 border-t border-border">
                <Text className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-bold">
                  4. Emergency Contact
                </Text>
                <HStack space="lg">
                  <Box className="flex-1">
                    <Controller
                      control={control}
                      name="emergencyName"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box className="gap-1.5">
                          <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                            Contact Person Name *
                          </Text>
                          <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                            <InputField
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              placeholder="Contact Name"
                              placeholderTextColor="#666675"
                              className="font-mono text-sm"
                            />
                          </Input>
                        </Box>
                      )}
                    />
                    <FieldError message={errors.emergencyName?.message} />
                  </Box>
                  <Box className="flex-1">
                    <Controller
                      control={control}
                      name="emergencyPhone"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Box className="gap-1.5">
                          <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                            Contact Phone *
                          </Text>
                          <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                            <InputField
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                              keyboardType="phone-pad"
                              placeholder="Contact Phone"
                              placeholderTextColor="#666675"
                              className="font-mono text-sm"
                            />
                          </Input>
                        </Box>
                      )}
                    />
                    <FieldError message={errors.emergencyPhone?.message} />
                  </Box>
                </HStack>
                <Controller
                  control={control}
                  name="emergencyRelation"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Box className="gap-1.5">
                      <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-1.5">
                        Relationship
                      </Text>
                      <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                        <InputField
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="e.g. Spouse, Parent"
                          placeholderTextColor="#666675"
                          className="font-mono text-sm"
                        />
                      </Input>
                    </Box>
                  )}
                />
              </VStack>
            </VStack>
          </ScrollView>
          {/* Actions */}
          <HStack
            space="md"
            className="px-5 py-4 items-center justify-end border-t border-border"
          >
            <Button
              onPress={() => router.back()}
              className="px-4 py-2.5 rounded-xl bg-border items-center justify-center"
            >
              <ButtonText className="text-xs font-mono font-bold text-foreground">
                Cancel
              </ButtonText>
            </Button>
            <Button
              onPress={onSubmit}
              isDisabled={addMember.isPending}
              className="px-5 py-2.5 rounded-xl bg-primary flex-row items-center justify-center gap-2"
            >
              <ButtonText className="font-display font-bold text-xs uppercase tracking-wider text-primary-foreground">
                {addMember.isPending ? "Onboarding.." : " Onboard"}
              </ButtonText>
              <ButtonIcon as={UserPlus} />
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
}
