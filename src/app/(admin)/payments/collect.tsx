import { PaymentForm, paymentSchema } from "@/api/payment.schema";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
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
import { useMember } from "@/hooks/useMembers";
import { useCreateTransaction } from "@/hooks/usePayments";
import { plannedExpiry } from "@/services/members.service";
import { CATEGORIES, METHODS, TxCategory, TxMethod } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Receipt,
} from "lucide-react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        className="bg-background border-border rounded-xl px-3 h-11"
      >
        <Box className="flex-1 flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className="text-sm font-mono text-foreground flex-1 pr-2"
          >
            {selected?.label ?? "Select"}
          </Text>
          <ChevronDown size={14} color="#8A8A9A" />
        </Box>
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

function Label({ children }: { children: string }) {
  return (
    <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-2">
      {children}
    </Text>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text className="text-[11px] font-mono text-destructive mt-1">
      {message}
    </Text>
  );
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

export default function CollectFee() {
  const router = useRouter();
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const id = String(memberId ?? "");
  const createTx = useCreateTransaction();
  const { data: member, isLoading, isError } = useMember(id);
  const inset = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: "0", category: "Monthly Fee", method: "Cash" },
  });

  const amountValue = useWatch({ control, name: "amount" });

  const isPending = member?.status === "pending";
  const isExpired = member?.status === "expired";
  const canCollect = isPending || isExpired;
  const renewalExpiry =
    member && isExpired ? plannedExpiry(member.tier, new Date()) : null;

  const onSubmit = handleSubmit((values) => {
    if (!id || createTx.isPending || !canCollect) return;
    createTx.mutate(
      {
        memberId: id,
        amount: Number(values.amount),
        method: values.method as TxMethod,
        category: values.category as TxCategory,
      },
      {
        onSuccess: (txId) => {
          router.replace(`/(admin)/payments/invoice/${txId}`);
        },
      },
    );
  });

  return (
    <Box
      className="flex-1 bg-card px-5 "
      style={{ paddingTop: inset.top + 20, paddingBottom: inset.bottom + 20 }}
    >
      <Box className="gap-4">
        <Box className="flex-row items-center gap-3">
          <Box className="w-10 h-10 rounded-2xl bg-primary items-center justify-center">
            <Receipt size={18} color="#000000" />
          </Box>
          <Box className="flex-1">
            <Text className="font-display font-black text-xl uppercase tracking-tight text-foreground leading-none">
              Collect Fee
            </Text>
            <Text className="text-xs font-mono text-muted-foreground mt-1">
              {member ? `${member.name} • ${member.displayId}` : "Fee invoice"}
            </Text>
          </Box>
        </Box>

        {createTx.isError && (
          <Box className="p-3 bg-destructive/15 border border-destructive/40 rounded-xl flex-row items-center gap-2">
            <AlertCircle size={16} color="#FF4B1F" />
            <Text className="text-xs font-mono text-foreground flex-1">
              {createTx.error?.message ??
                "Failed to record payment. Please try again."}
            </Text>
          </Box>
        )}

        {isLoading ? (
          <Box className="p-8 items-center bg-background border border-border rounded-2xl">
            <Spinner color="#C8F135" />
            <Text className="text-xs font-mono text-muted-foreground mt-3">
              Loading member...
            </Text>
          </Box>
        ) : isError || !member ? (
          <Box className="p-8 items-center bg-background border border-border rounded-2xl">
            <Text className="text-sm font-mono text-muted-foreground text-center">
              Member not found.
            </Text>
          </Box>
        ) : (
          <Box className="gap-5">
            <Box className="bg-background border border-border rounded-2xl p-4 gap-3">
              <Box className="flex-row items-center justify-between">
                <Text className="text-xs font-mono text-muted-foreground uppercase">
                  Plan
                </Text>
                <Text className="text-sm font-bold text-foreground flex-1 text-right ml-4">
                  {member.tier}
                </Text>
              </Box>
              <Box className="flex-row items-center justify-between">
                <Text className="text-xs font-mono text-muted-foreground uppercase">
                  Status
                </Text>
                <Text className="text-sm font-bold text-warning flex-1 text-right ml-4 uppercase">
                  {member.status}
                </Text>
              </Box>
              {isPending && member.expiryDate && (
                <Box className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-muted-foreground uppercase">
                    Activates
                  </Text>
                  <Text className="text-xs font-mono text-foreground flex-1 text-right ml-4">
                    {member.startDate ? formatDate(member.startDate) : "—"} →{" "}
                    {formatDate(member.expiryDate)} (dates unchanged)
                  </Text>
                </Box>
              )}
              {isExpired && renewalExpiry && (
                <Box className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-muted-foreground uppercase">
                    Renews to
                  </Text>
                  <Text className="text-xs font-mono text-foreground flex-1 text-right ml-4">
                    Today → {formatDate(renewalExpiry)}
                  </Text>
                </Box>
              )}
              {!canCollect && (
                <Box className="p-3 bg-warning/15 border border-warning/40 rounded-xl">
                  <Text className="text-xs font-mono text-foreground">
                    Only pending or expired memberships can collect payment.
                  </Text>
                </Box>
              )}
            </Box>
            <Box className="flex-row gap-4">
              <Box className="flex-1">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, value } }) => (
                    <FormSelect
                      value={value}
                      options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                      onChange={(v) => onChange(v as TxCategory)}
                    />
                  )}
                />
                <FieldError message={errors.category?.message} />
              </Box>
              <Box className="flex-1">
                <Label>Method</Label>
                <Controller
                  control={control}
                  name="method"
                  render={({ field: { onChange, value } }) => (
                    <FormSelect
                      value={value}
                      options={METHODS.map((m) => ({ label: m, value: m }))}
                      onChange={(v) => onChange(v as TxMethod)}
                    />
                  )}
                />
                <FieldError message={errors.method?.message} />
              </Box>
            </Box>

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Label>Amount (৳)</Label>
                  <Input className="w-full bg-background border-border rounded-xl px-3 h-11">
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Amount"
                      keyboardType="numeric"
                      className="w-full text-sm font-mono text-foreground"
                    />
                  </Input>
                  <FieldError message={errors.amount?.message} />
                </Box>
              )}
            />

            <Box className="bg-background border border-border rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Total
              </Text>
              <Text className="font-display font-black text-2xl text-primary tracking-tight">
                ৳{Number(amountValue) || 0}
              </Text>
            </Box>

            <Box className="flex-row items-center justify-end gap-3 border-t border-border pt-5 mt-1">
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
                isDisabled={createTx.isPending || !canCollect}
                className="px-5 py-2.5 rounded-xl bg-primary flex-row items-center justify-center gap-2"
              >
                <ButtonIcon
                  as={CheckCircle2}
                  className="text-primary-foreground w-4 h-4"
                />
                <ButtonText className="font-display font-bold text-xs uppercase tracking-wider text-primary-foreground">
                  {createTx.isPending ? "Processing..." : "Confirm Payment"}
                </ButtonText>
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
