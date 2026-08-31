import { Text, View } from '@/tw';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreditCard, Receipt, X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { getTransactionById } from '@/types/transaction';

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = getTransactionById(id ?? '');

  return (
    <View className="flex-1 bg-card px-5 pt-1 pb-8">
      {tx ? (
        <View className="gap-4">
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
                  {tx.invoiceNumber}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="bg-lime-accent/15 border border-lime-accent/30 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-mono text-lime-accent font-bold uppercase">
                  Paid
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-8 h-8 rounded-xl bg-[#1E1E26] items-center justify-center"
              >
                <X size={16} color="#8A8A9A" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-3 border-t border-border-subtle pt-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-text-muted uppercase">
                Member
              </Text>
              <Text className="text-sm font-bold text-white">
                {tx.memberName}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-text-muted uppercase">
                Tier
              </Text>
              <Text className="text-sm font-bold text-white">{tx.tier}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-text-muted uppercase">
                Category
              </Text>
              <Text className="text-sm font-bold text-white">
                {tx.category}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-text-muted uppercase">
                Method
              </Text>
              <View className="flex-row items-center gap-1.5">
                <CreditCard size={13} color="#8A8A9A" />
                <Text className="text-sm font-bold text-white">{tx.method}</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-text-muted uppercase">
                Date
              </Text>
              <Text className="text-sm font-bold text-white">{tx.date}</Text>
            </View>
          </View>

          <View className="bg-background border border-border-subtle rounded-2xl p-4 flex-row items-center justify-between">
            <Text className="text-xs font-mono text-text-muted uppercase">
              Total
            </Text>
            <Text className="font-display font-black text-2xl text-lime-accent tracking-tight">
              {tx.amount < 0 ? '-' : '+'}$
              {Math.abs(tx.amount)}.00
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="font-mono text-sm text-text-muted">
            Invoice not found.
          </Text>
        </View>
      )}
    </View>
  );
}