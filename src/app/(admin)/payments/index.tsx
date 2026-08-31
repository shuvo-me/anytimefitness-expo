import { ScrollView, Text, TextInput, TouchableOpacity, View } from "@/tw";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  AlertCircle,
  Plus,
  Receipt,
  Search,
} from "lucide-react-native";
import { MOCK_MEMBERS } from "@/types/member";
import { MOCK_TRANSACTIONS } from "@/types/transaction";

const MONTHLY_REVENUE = 284500;

export default function AdminPayments() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");

  const pendingMembers = MOCK_MEMBERS.filter((m) => m.duesAmount > 0);
  const totalDue = pendingMembers.reduce((sum, m) => sum + m.duesAmount, 0);

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      tx.memberName.toLowerCase().includes(q) ||
      tx.invoiceNumber.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <StatusBar style="light" />
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
              onPress={() => router.push("/(admin)/payments/record")}
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
                      onPress={() => router.push("/(admin)/payments/record")}
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
                      onPress={() =>
                        router.push(`/(admin)/payments/invoice/${tx.id}`)
                      }
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
                              isNegative
                                ? "text-alert-red"
                                : "text-lime-accent"
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
                            {tx.tier}{" "}
                            <Text className="text-[#555566]">•</Text> {tx.date}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2 ml-2">
                        <Text
                          className={`font-display font-black text-base tracking-tight ${
                            isNegative
                              ? "text-alert-red"
                              : "text-lime-accent"
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
    </>
  );
}