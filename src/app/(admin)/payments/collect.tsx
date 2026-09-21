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
import { Text } from "@/components/ui/text";
import { useMembers } from "@/hooks/useMembers";
import { useCreateTransaction } from "@/hooks/usePayments";
import {
  CATEGORIES,
  METHODS,
  TIER_PRICE,
  TxCategory,
  TxMethod,
} from "@/types/transaction";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Receipt,
} from "lucide-react-native";
import { useState } from "react";
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

export default function CollectFee() {
  const router = useRouter();
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const createTx = useCreateTransaction();
  const { data: members } = useMembers();
  const inset = useSafeAreaInsets();

  const member = (members ?? []).find((m) => m.id === memberId);

  const [amount, setAmount] = useState(
    member ? String(TIER_PRICE[member.tier]) : "600",
  );
  const [category, setCategory] = useState<TxCategory>("Monthly Fee");
  const [method, setMethod] = useState<TxMethod>("Cash");

  const handleSubmit = () => {
    if (!memberId || createTx.isPending) return;
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) return;

    createTx.mutate(
      { memberId, amount: numericAmount, method, category },
      {
        onSuccess: (txId) => {
          router.replace(`/(admin)/payments/invoice/${txId}`);
        },
      },
    );
  };

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
              Failed to record payment. Please try again.
            </Text>
          </Box>
        )}

        {!member ? (
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
            </Box>

            <Box>
              <Label>Amount (৳)</Label>
              <Input className="w-full bg-background border-border rounded-xl px-3 h-11">
                <InputField
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Amount"
                  keyboardType="numeric"
                  className="w-full text-sm font-mono text-foreground"
                />
              </Input>
            </Box>

            <Box className="flex-row gap-4">
              <Box className="flex-1">
                <Label>Category</Label>
                <FormSelect
                  value={category}
                  options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                  onChange={(v) => setCategory(v as TxCategory)}
                />
              </Box>
              <Box className="flex-1">
                <Label>Method</Label>
                <FormSelect
                  value={method}
                  options={METHODS.map((m) => ({ label: m, value: m }))}
                  onChange={(v) => setMethod(v as TxMethod)}
                />
              </Box>
            </Box>

            <Box className="bg-background border border-border rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Total
              </Text>
              <Text className="font-display font-black text-2xl text-primary tracking-tight">
                ৳{Number(amount) || 0}
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
                onPress={handleSubmit}
                isDisabled={createTx.isPending}
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
