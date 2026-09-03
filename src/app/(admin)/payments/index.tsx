import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useMembers } from "@/hooks/useMembers";
import { useMonthlyRevenue, useTransactions } from "@/hooks/usePayments";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertCircle, Plus, Receipt, Search } from "lucide-react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminPayments() {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: members } = useMembers();
  const { data: transactions, isLoading: txLoading } = useTransactions();
  const { data: monthlyRevenue } = useMonthlyRevenue();

  const pendingMembers = (members ?? []).filter(
    (m) => m.status === "expired" || m.status === "pending",
  );

  const filteredTransactions = (transactions ?? []).filter((tx) => {
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
        <Box className="gap-5">
          {/* Header */}
          <Box className="flex-row items-center justify-between">
            <Box className="flex-1 pr-3">
              <Text className="font-display font-black text-3xl uppercase tracking-tight text-foreground leading-none">
                Payments
              </Text>
              <Text className="text-xs font-mono text-muted-foreground mt-1">
                Financial command & fee collection
              </Text>
            </Box>
            <Button
              onPress={() => router.push("/(admin)/payments/record")}
              className="bg-primary px-3.5 py-2 rounded-xl flex-row items-center gap-1.5"
            >
              <ButtonIcon
                as={Plus}
                className="text-primary-foreground w-4 h-4"
              />
              <ButtonText className="font-display font-bold text-xs uppercase tracking-wider text-primary-foreground">
                Record Payment
              </ButtonText>
            </Button>
          </Box>

          {/* Monthly Revenue Banner */}
          <Box className="relative overflow-hidden bg-primary p-5 rounded-3xl">
            <Box className="absolute -right-2 -bottom-8 pointer-events-none">
              <Text className="font-display font-black text-[120px] leading-none text-primary-foreground/10">
                $
              </Text>
            </Box>
            <Text className="text-[11px] font-mono font-black uppercase tracking-widest text-primary-foreground/80">
              Monthly Revenue
            </Text>
            <Text className="font-display font-black text-4xl tracking-tight text-primary-foreground mt-1 leading-none">
              ৳{(monthlyRevenue ?? 0).toLocaleString()}
            </Text>
            <Box className="flex-row items-center justify-between mt-5 pt-3 border-t border-primary-foreground/15">
              <Box className="bg-primary-foreground/10 px-2.5 py-1 rounded-full">
                <Text className="text-xs font-mono font-bold text-primary-foreground/90">
                  +12% vs last month
                </Text>
              </Box>
              <Text className="text-[11px] font-mono font-bold uppercase text-primary-foreground/70">
                Auto-Deposit Active
              </Text>
            </Box>
          </Box>

          {/* Outstanding Dues */}
          {pendingMembers.length > 0 && (
            <Box className="bg-card border border-border p-4 rounded-2xl gap-3">
              <Box className="flex-row items-center justify-between">
                <Text className="text-xs font-mono text-destructive font-bold uppercase tracking-wider flex-row items-center gap-1.5">
                  <AlertCircle size={14} color="#FF4B1F" /> Outstanding Dues (
                  {pendingMembers.length})
                </Text>
                <Text className="text-xs font-mono text-muted-foreground">
                  {pendingMembers.length} uncollected
                </Text>
              </Box>
              <Box className="gap-2">
                {pendingMembers.map((m) => (
                  <Box
                    key={m.id}
                    className="bg-background border border-border p-3 rounded-xl flex-row items-center justify-between"
                  >
                    <Box className="flex-row items-center gap-2.5 flex-1">
                      <Box className="w-8 h-8 rounded-lg bg-destructive/15 border border-destructive/30 items-center justify-center">
                        <Text className="font-mono font-bold text-xs text-destructive">
                          {initialsOf(m.name)}
                        </Text>
                      </Box>
                      <Box className="flex-1">
                        <Text className="text-xs font-bold text-foreground leading-none">
                          {m.name}
                        </Text>
                        <Text className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {m.tier} •{" "}
                          <Text className="text-destructive font-bold uppercase">
                            {m.status}
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                    <Button
                      onPress={() => router.push("/(admin)/payments/record")}
                      className="bg-primary px-3 py-1.5 rounded-lg"
                    >
                      <ButtonText className="font-display font-bold text-[11px] uppercase tracking-wider text-primary-foreground">
                        Collect Fee
                      </ButtonText>
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Recent Transactions */}
          <Box className="gap-3">
            <Box className="flex-row items-center justify-between gap-3">
              <Text className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-bold">
                Recent Transactions
              </Text>
              <Input className="flex-1 max-w-[52%] bg-card border-border rounded-xl pr-3 ">
                <InputSlot>
                  <InputIcon
                    as={Search}
                    className="text-muted-foreground w-3.5 h-3.5"
                  />
                </InputSlot>
                <InputField
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholder="Search payments..."
                  placeholderTextColor="#555566"
                  className="w-full text-xs text-foreground font-mono"
                />
              </Input>
            </Box>

            <Box className="gap-2">
              {txLoading ? (
                <Box className="p-8 items-center bg-card border border-border rounded-2xl">
                  <Spinner color="#C8F135" />
                  <Text className="text-xs font-mono text-muted-foreground mt-3">
                    Loading transactions...
                  </Text>
                </Box>
              ) : filteredTransactions.length === 0 ? (
                <Box className="p-8 items-center bg-card border border-border rounded-2xl">
                  <Text className="text-sm text-muted-foreground font-mono text-center">
                    No transactions found
                  </Text>
                </Box>
              ) : (
                filteredTransactions.map((tx) => {
                  const isNegative = tx.amount < 0;
                  return (
                    <Button
                      key={tx.id}
                      onPress={() =>
                        router.push(`/(admin)/payments/invoice/${tx.id}`)
                      }
                      className="bg-card border border-border p-3.5 rounded-2xl flex-row items-center justify-between"
                    >
                      <Box className="flex-row items-center gap-3 flex-1">
                        <Box
                          className={`w-9 h-9 rounded-full items-center justify-center border ${
                            isNegative
                              ? "bg-destructive/15 border-destructive/30"
                              : "bg-primary/15 border-primary/30"
                          }`}
                        >
                          <Text
                            className={`font-display font-black text-xs ${
                              isNegative ? "text-destructive" : "text-primary"
                            }`}
                          >
                            {tx.initials.slice(0, 1)}
                          </Text>
                        </Box>
                        <Box className="flex-1">
                          <Text className="font-bold text-foreground text-sm leading-tight">
                            {tx.memberName}
                          </Text>
                          <Text className="text-[11px] font-mono text-muted-foreground mt-0.5">
                            {tx.tier}{" "}
                            <Text className="text-muted-foreground">•</Text>{" "}
                            {tx.date}
                          </Text>
                        </Box>
                      </Box>
                      <Box className="flex-row items-center gap-2 ml-2">
                        <Text
                          className={`font-display font-black text-base tracking-tight ${
                            isNegative ? "text-destructive" : "text-primary"
                          }`}
                        >
                          {isNegative
                            ? `-৳${Math.abs(tx.amount)}`
                            : `+৳${tx.amount}`}
                        </Text>
                        <Receipt size={14} color="#555566" />
                      </Box>
                    </Button>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </>
  );
}
