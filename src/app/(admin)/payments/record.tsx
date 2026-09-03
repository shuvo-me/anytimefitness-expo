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
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useMembers } from "@/hooks/useMembers";
import { useCreateTransaction } from "@/hooks/usePayments";
import { CATEGORIES, METHODS, TxCategory, TxMethod } from "@/types/transaction";
import { useRouter } from "expo-router";
import { AlertCircle, CheckCircle2, ChevronDown } from "lucide-react-native";
import { useState } from "react";

function FormSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
  placeholder: string;
}) {
  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;
  return (
    <Select selectedValue={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        variant="outline"
        size="md"
        className="bg-background border-border rounded-xl px-3.5 h-11"
      >
        <Box className="flex-1 flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className="text-sm font-mono text-foreground flex-1 pr-2"
          >
            {selectedLabel}
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

export default function RecordPayment() {
  const router = useRouter();
  const { data: members } = useMembers();
  const createTx = useCreateTransaction();
  const memberList = members ?? [];

  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("80");
  const [category, setCategory] = useState<TxCategory>("Monthly Fee");
  const [method, setMethod] = useState<TxMethod>("Credit Card");

  const selectedMemberId = memberId || memberList[0]?.id || "";

  const handleSubmit = () => {
    if (!selectedMemberId || createTx.isPending) return;
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) return;

    createTx.mutate(
      {
        memberId: selectedMemberId,
        amount: numericAmount,
        method,
        category,
      },
      {
        onSuccess: (txId) => {
          router.replace(`/(admin)/payments/invoice/${txId}`);
        },
      },
    );
  };

  return (
    <Box className="flex-1 bg-card px-5 pt-6 pb-8">
      <Box className="gap-3">
        <Text className="font-display font-black text-xl uppercase tracking-tight text-foreground">
          Record Member Payment
        </Text>

        {createTx.isError && (
          <Box className="p-3 bg-destructive/15 border border-destructive/40 rounded-xl flex-row items-center gap-2">
            <AlertCircle size={16} color="#FF4B1F" />
            <Text className="text-xs font-mono text-foreground flex-1">
              Failed to record payment. Please try again.
            </Text>
          </Box>
        )}

        <Box className="gap-5">
          <Box className="gap-2.5">
            <Text className="text-[11px] font-mono text-muted-foreground uppercase">
              Select Member
            </Text>
            <FormSelect
              value={selectedMemberId}
              options={memberList.map((m) => ({
                label: `${m.name} (${m.tier} - ${m.displayId})`,
                value: m.id,
              }))}
              onChange={setMemberId}
              placeholder="Select member"
            />
          </Box>

          <Box>
            <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-2">
              Amount
            </Text>
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
              <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-2">
                Category
              </Text>
              <FormSelect
                value={category}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                onChange={setCategory}
                placeholder="Category"
              />
            </Box>
            <Box className="flex-1">
              <Text className="text-[11px] font-mono text-muted-foreground uppercase mb-2">
                Payment Method
              </Text>
              <FormSelect
                value={method}
                options={METHODS.map((m) => ({ label: m, value: m }))}
                onChange={setMethod}
                placeholder="Method"
              />
            </Box>
          </Box>

          <Box className="flex-row items-center justify-end gap-3 border-t border-border pt-5 mt-2">
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
              <ButtonIcon as={CheckCircle2} className="text-primary-foreground w-4 h-4" />
              <ButtonText className="font-display font-bold text-xs uppercase tracking-wider text-primary-foreground">
                {createTx.isPending ? "Recording..." : "Confirm & Receipt"}
              </ButtonText>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
