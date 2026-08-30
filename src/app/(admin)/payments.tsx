import { InputField } from "@/components/common/InputField";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
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
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "@/tw";
import { MOCK_MEMBERS } from "@/types/member";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Plus,
  Receipt,
  Search,
} from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TxCategory =
  | "Monthly Fee"
  | "Personal Training"
  | "Registration"
  | "Locker";
type TxMethod = "Credit Card" | "Apple Pay" | "Cash" | "Bank Transfer";

interface Tx {
  id: string;
  invoiceNumber: string;
  memberName: string;
  initials: string;
  tier: string;
  amount: number;
  category: TxCategory;
  method: TxMethod;
  date: string;
}

const MOCK_TRANSACTIONS: Tx[] = [
  {
    id: "1",
    invoiceNumber: "INV-2041",
    memberName: "Sarah Johnson",
    initials: "SJ",
    tier: "Premium",
    amount: 99,
    category: "Monthly Fee",
    method: "Credit Card",
    date: "Mar 14",
  },
  {
    id: "2",
    invoiceNumber: "INV-2040",
    memberName: "Mike Chen",
    initials: "MC",
    tier: "Basic",
    amount: 40,
    category: "Monthly Fee",
    method: "Apple Pay",
    date: "Mar 13",
  },
  {
    id: "3",
    invoiceNumber: "INV-2039",
    memberName: "Emma Davis",
    initials: "ED",
    tier: "Premium",
    amount: 80,
    category: "Monthly Fee",
    method: "Credit Card",
    date: "Mar 12",
  },
  {
    id: "4",
    invoiceNumber: "INV-2038",
    memberName: "David Kim",
    initials: "DK",
    tier: "VIP",
    amount: 149,
    category: "Monthly Fee",
    method: "Bank Transfer",
    date: "Mar 11",
  },
  {
    id: "5",
    invoiceNumber: "INV-2037",
    memberName: "Olivia Brown",
    initials: "OB",
    tier: "Premium",
    amount: -20,
    category: "Locker",
    method: "Cash",
    date: "Mar 10",
  },
  {
    id: "6",
    invoiceNumber: "INV-2036",
    memberName: "Liam Wilson",
    initials: "LW",
    tier: "Basic",
    amount: 40,
    category: "Monthly Fee",
    method: "Credit Card",
    date: "Mar 09",
  },
];

const CATEGORIES: TxCategory[] = [
  "Monthly Fee",
  "Personal Training",
  "Registration",
  "Locker",
];
const METHODS: TxMethod[] = [
  "Credit Card",
  "Apple Pay",
  "Cash",
  "Bank Transfer",
];
const MONTHLY_REVENUE = 284500;

function FormSelect<T extends string>({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  placeholder: string;
}) {
  return (
    <Select selectedValue={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        variant="outline"
        size="md"
        className="bg-background border-[#252532] rounded-xl px-3.5 h-11"
      >
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-sm font-mono text-white flex-1 pr-2">
            {value || placeholder}
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
              <SelectItem key={o} label={o} value={o} />
            ))}
          </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

export default function AdminPayments() {
  const inset = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);
  const [showRecord, setShowRecord] = useState(false);

  const [memberId, setMemberId] = useState(MOCK_MEMBERS[0]?.id ?? "");
  const [amount, setAmount] = useState("80");
  const [category, setCategory] = useState<TxCategory>("Monthly Fee");
  const [method, setMethod] = useState<TxMethod>("Credit Card");

  const pendingMembers = MOCK_MEMBERS.filter((m) => m.duesAmount > 0);
  const totalDue = pendingMembers.reduce((sum, m) => sum + m.duesAmount, 0);
  const selectedMember = MOCK_MEMBERS.find((m) => m.id === memberId);

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      tx.memberName.toLowerCase().includes(q) ||
      tx.invoiceNumber.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q)
    );
  });

  const handleRecordSubmit = () => {
    setShowRecord(false);
  };

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
        <View className="gap-5">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-display font-black text-3xl uppercase tracking-tight text-white leading-none">
                Payments
              </Text>
              <Text className="text-xs font-mono text-text-muted mt-1">
                Financial command & fee collection
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowRecord(true)}
              activeOpacity={0.7}
              className="bg-lime-accent px-3.5 py-2 rounded-xl flex-row items-center gap-1.5"
            >
              <Plus size={16} color="#000000" />
              <Text className="font-display font-bold text-xs uppercase tracking-wider text-black">
                Record Payment
              </Text>
            </TouchableOpacity>
          </View>

          {/* Monthly Revenue Banner */}
          <View className="relative overflow-hidden bg-lime-accent p-5 rounded-3xl">
            <View className="absolute -right-2 -bottom-8 pointer-events-none">
              <Text className="font-display font-black text-[120px] leading-none text-black/10 opacity-5">
                $
              </Text>
            </View>
            <Text className="text-[11px] font-mono font-black uppercase tracking-widest text-black/80">
              Monthly Revenue
            </Text>
            <Text className="font-display font-black text-4xl tracking-tight text-black mt-1 leading-none">
              ${MONTHLY_REVENUE.toLocaleString()}.00
            </Text>
            <View className="flex-row items-center justify-between mt-5 pt-3 border-t border-black/15">
              <View className="bg-black/10 px-2.5 py-1 rounded-full">
                <Text className="text-xs font-mono font-bold text-black/90">
                  +12% vs last month
                </Text>
              </View>
              <Text className="text-[11px] font-mono font-bold uppercase text-black/70">
                Auto-Deposit Active
              </Text>
            </View>
          </View>

          {/* Outstanding Dues */}
          {pendingMembers.length > 0 && (
            <View className="bg-card border border-border-subtle p-4 rounded-2xl gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-mono text-alert-red font-bold uppercase tracking-wider flex-row items-center gap-1.5">
                  <AlertCircle size={14} color="#FF4B1F" /> Outstanding Dues (
                  {pendingMembers.length})
                </Text>
                <Text className="text-xs font-mono text-text-muted">
                  Total Due: ${totalDue}
                </Text>
              </View>
              <View className="gap-2">
                {pendingMembers.map((m) => (
                  <View
                    key={m.id}
                    className="bg-background border border-border-subtle p-3 rounded-xl flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2.5 flex-1">
                      <View className="w-8 h-8 rounded-lg bg-alert-red/15 border border-alert-red/30 items-center justify-center">
                        <Text className="font-mono font-bold text-xs text-alert-red">
                          {m.initials}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-white leading-none">
                          {m.name}
                        </Text>
                        <Text className="text-[10px] font-mono text-text-muted mt-0.5">
                          {m.tier} • Due:{" "}
                          <Text className="text-alert-red font-bold">
                            ${m.duesAmount}
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowRecord(true)}
                      activeOpacity={0.7}
                      className="bg-lime-accent px-3 py-1.5 rounded-lg"
                    >
                      <Text className="font-display font-bold text-[11px] uppercase tracking-wider text-black">
                        Collect Fee
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recent Transactions */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="text-xs font-mono text-text-muted uppercase tracking-widest font-bold">
                Recent Transactions
              </Text>
              <View className="relative flex-1 max-w-[52%]">
                <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Search size={14} color="#8A8A9A" />
                </View>
                <TextInput
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholder="Search payments..."
                  placeholderTextColor="#555566"
                  className="w-full bg-card border border-border-subtle rounded-xl pl-8 pr-3 py-1.5 text-xs text-white font-mono"
                />
              </View>
            </View>

            <View className="gap-2">
              {filteredTransactions.length === 0 ? (
                <View className="p-8 items-center bg-card border border-border-subtle rounded-2xl">
                  <Text className="text-sm text-text-muted font-mono text-center">
                    No transactions found
                  </Text>
                </View>
              ) : (
                filteredTransactions.map((tx) => {
                  const isNegative = tx.amount < 0;
                  return (
                    <TouchableOpacity
                      key={tx.id}
                      onPress={() => setSelectedTx(tx)}
                      activeOpacity={0.8}
                      className="bg-card border border-border-subtle p-3.5 rounded-2xl flex-row items-center justify-between"
                    >
                      <View className="flex-row items-center gap-3 flex-1">
                        <View
                          className={`w-9 h-9 rounded-full items-center justify-center border ${
                            isNegative
                              ? "bg-alert-red/15 border-alert-red/30"
                              : "bg-[#1B2412] border-lime-accent/30"
                          }`}
                        >
                          <Text
                            className={`font-display font-black text-xs ${
                              isNegative ? "text-alert-red" : "text-lime-accent"
                            }`}
                          >
                            {tx.initials.slice(0, 1)}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-bold text-white text-sm leading-tight">
                            {tx.memberName}
                          </Text>
                          <Text className="text-[11px] font-mono text-text-muted mt-0.5">
                            {tx.tier} <Text className="text-[#555566]">•</Text>{" "}
                            {tx.date}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2 ml-2">
                        <Text
                          className={`font-display font-black text-base tracking-tight ${
                            isNegative ? "text-alert-red" : "text-lime-accent"
                          }`}
                        >
                          {isNegative
                            ? `-$${Math.abs(tx.amount)}`
                            : `+$${tx.amount}`}
                        </Text>
                        <Receipt size={14} color="#555566" />
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Invoice Detail Bottom Sheet */}
      <Actionsheet
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        snapPoints={[60]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-card border-t border-border-subtle pb-8">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-border-subtle" />
          </ActionsheetDragIndicatorWrapper>
          {selectedTx && (
            <View className="w-full px-5 pt-4 gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="w-11 h-11 rounded-2xl bg-lime-accent items-center justify-center">
                    <Receipt size={18} color="#000000" />
                  </View>
                  <View>
                    <Text className="font-display font-black text-lg uppercase tracking-tight text-white leading-none">
                      Invoice
                    </Text>
                    <Text className="text-xs font-mono text-lime-accent mt-0.5 font-bold">
                      {selectedTx.invoiceNumber}
                    </Text>
                  </View>
                </View>
                <View className="bg-lime-accent/15 border border-lime-accent/30 px-2.5 py-1 rounded-lg">
                  <Text className="text-[10px] font-mono text-lime-accent font-bold uppercase">
                    Paid
                  </Text>
                </View>
              </View>

              <View className="gap-3 border-t border-border-subtle pt-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-text-muted uppercase">
                    Member
                  </Text>
                  <Text className="text-sm font-bold text-white">
                    {selectedTx.memberName}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-text-muted uppercase">
                    Tier
                  </Text>
                  <Text className="text-sm font-bold text-white">
                    {selectedTx.tier}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-text-muted uppercase">
                    Category
                  </Text>
                  <Text className="text-sm font-bold text-white">
                    {selectedTx.category}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-text-muted uppercase">
                    Method
                  </Text>
                  <View className="flex-row items-center gap-1.5">
                    <CreditCard size={13} color="#8A8A9A" />
                    <Text className="text-sm font-bold text-white">
                      {selectedTx.method}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-mono text-text-muted uppercase">
                    Date
                  </Text>
                  <Text className="text-sm font-bold text-white">
                    {selectedTx.date}
                  </Text>
                </View>
              </View>

              <View className="bg-background border border-border-subtle rounded-2xl p-4 flex-row items-center justify-between">
                <Text className="text-xs font-mono text-text-muted uppercase">
                  Total
                </Text>
                <Text className="font-display font-black text-2xl text-lime-accent tracking-tight">
                  {selectedTx.amount < 0 ? "-" : "+"}$
                  {Math.abs(selectedTx.amount)}.00
                </Text>
              </View>
            </View>
          )}
        </ActionsheetContent>
      </Actionsheet>

      {/* Record Payment Bottom Sheet */}
      <Actionsheet
        isOpen={showRecord}
        onClose={() => setShowRecord(false)}
        snapPoints={[75]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-card border-t border-border-subtle pb-8">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-border-subtle" />
          </ActionsheetDragIndicatorWrapper>
          <View className="w-full px-5 pt-2 gap-4">
            <Text className="font-display font-black text-xl uppercase tracking-tight text-white">
              Record Member Payment
            </Text>

            <View className="gap-2">
              <Text className="text-[11px] font-mono text-text-muted uppercase">
                Select Member
              </Text>
              <FormSelect
                value={memberId}
                options={MOCK_MEMBERS.map((m) => m.id)}
                onChange={setMemberId}
                placeholder="Select member"
              />
              {selectedMember && (
                <Text className="text-[11px] font-mono text-text-muted mt-0.5">
                  {selectedMember.name} ({selectedMember.tier})
                </Text>
              )}
            </View>

            <InputField
              label="Fee Amount ($)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-[11px] font-mono text-text-muted uppercase mb-1.5">
                  Category
                </Text>
                <FormSelect
                  value={category}
                  options={CATEGORIES}
                  onChange={setCategory}
                  placeholder="Category"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-mono text-text-muted uppercase mb-1.5">
                  Method
                </Text>
                <FormSelect
                  value={method}
                  options={METHODS}
                  onChange={setMethod}
                  placeholder="Method"
                />
              </View>
            </View>

            <View className="flex-row items-center justify-end gap-3 border-t border-border-subtle pt-4 mt-1">
              <TouchableOpacity
                onPress={() => setShowRecord(false)}
                activeOpacity={0.7}
                className="px-4 py-2.5 rounded-xl bg-border-subtle items-center justify-center"
              >
                <Text className="text-xs font-mono font-bold text-white">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleRecordSubmit}
                activeOpacity={0.7}
                className="px-5 py-2.5 rounded-xl bg-lime-accent flex-row items-center justify-center gap-2"
              >
                <CheckCircle2 size={15} color="#000000" />
                <Text className="font-display font-bold text-xs uppercase tracking-wider text-black">
                  Confirm & Receipt
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>

      <StatusBar style="light" />
    </>
  );
}
