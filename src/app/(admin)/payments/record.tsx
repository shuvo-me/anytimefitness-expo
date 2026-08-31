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
import { Text, TouchableOpacity, View } from "@/tw";
import { MOCK_MEMBERS } from "@/types/member";
import { CATEGORIES, METHODS, TxCategory, TxMethod } from "@/types/transaction";
import { useRouter } from "expo-router";
import { CheckCircle2, ChevronDown } from "lucide-react-native";
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
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            numberOfLines={1}
            className="text-sm font-mono text-white flex-1 pr-2"
          >
            {selectedLabel}
          </Text>
          <ChevronDown size={14} color="#8A8A9A" />
        </View>
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

export default function RecordPayment() {
  const router = useRouter();

  const [memberId, setMemberId] = useState(MOCK_MEMBERS[0]?.id ?? "");
  const [amount, setAmount] = useState("80");
  const [category, setCategory] = useState<TxCategory>("Monthly Fee");
  const [method, setMethod] = useState<TxMethod>("Credit Card");

  return (
    <View className="flex-1 bg-card px-5 pt-6 pb-8">
      <View className="gap-3">
        <Text className="font-display font-black text-xl uppercase tracking-tight text-white">
          Record Member Payment
        </Text>

        <View className="gap-5">
          <View className="gap-2.5">
            <Text className="text-[11px] font-mono text-text-muted uppercase">
              Select Member
            </Text>
            <FormSelect
              value={memberId}
              options={MOCK_MEMBERS.map((m) => ({
                label: `${m.name} (${m.tier} - ${m.id})`,
                value: m.id,
              }))}
              onChange={setMemberId}
              placeholder="Select member"
            />
          </View>

          <View>
            <Text className="text-[11px] font-mono text-text-muted uppercase mb-2">
              Amount
            </Text>
            <Input>
              <InputField
                value={amount}
                onChangeText={setAmount}
                placeholder="Amount"
                keyboardType="numeric"
                className="h-11 border border-red-300 rounded-md"
              />
            </Input>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-[11px] font-mono text-text-muted uppercase mb-2">
                Category
              </Text>
              <FormSelect
                value={category}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                onChange={setCategory}
                placeholder="Category"
              />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-mono text-text-muted uppercase mb-2">
                Payment Method
              </Text>
              <FormSelect
                value={method}
                options={METHODS.map((m) => ({ label: m, value: m }))}
                onChange={setMethod}
                placeholder="Method"
              />
            </View>
          </View>

          <View className="flex-row items-center justify-end gap-3 border-t border-[#1E1E26] pt-5 mt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="px-4 py-2.5 rounded-xl bg-[#1E1E26] items-center justify-center"
            >
              <Text className="text-xs font-mono font-bold text-white">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="px-5 py-2.5 rounded-xl bg-[#C8F135] flex-row items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} color="#000000" />
              <Text className="font-display font-bold text-xs uppercase tracking-wider text-black">
                Confirm & Receipt
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
