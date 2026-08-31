import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreditCard, Receipt, X } from 'lucide-react-native';
import { getTransactionById } from '@/types/transaction';

export default function InvoiceDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = getTransactionById(id ?? '');

  return (
    <Box className="flex-1 bg-card px-5 pt-1 pb-8">
      {tx ? (
        <Box className="gap-4">
          <Box className="flex-row items-center justify-between">
            <Box className="flex-row items-center gap-3">
              <Box className="w-11 h-11 rounded-2xl bg-primary items-center justify-center">
                <Receipt size={18} color="#000000" />
              </Box>
              <Box>
                <Text className="font-display font-black text-lg uppercase tracking-tight text-foreground leading-none">
                  Invoice
                </Text>
                <Text className="text-xs font-mono text-primary mt-0.5 font-bold">
                  {tx.invoiceNumber}
                </Text>
              </Box>
            </Box>
            <Box className="flex-row items-center gap-2">
              <Box className="bg-primary/15 border border-primary/30 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-mono text-primary font-bold uppercase">
                  Paid
                </Text>
              </Box>
              <Button
                onPress={() => router.back()}
                className="w-8 h-8 rounded-xl bg-border items-center justify-center"
              >
                <ButtonIcon as={X} className="text-muted-foreground w-4 h-4" />
              </Button>
            </Box>
          </Box>

          <Box className="gap-3 border-t border-border pt-4">
            <Box className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Member
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {tx.memberName}
              </Text>
            </Box>
            <Box className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Tier
              </Text>
              <Text className="text-sm font-bold text-foreground">{tx.tier}</Text>
            </Box>
            <Box className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Category
              </Text>
              <Text className="text-sm font-bold text-foreground">
                {tx.category}
              </Text>
            </Box>
            <Box className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Method
              </Text>
              <Box className="flex-row items-center gap-1.5">
                <CreditCard size={13} color="#8A8A9A" />
                <Text className="text-sm font-bold text-foreground">{tx.method}</Text>
              </Box>
            </Box>
            <Box className="flex-row items-center justify-between">
              <Text className="text-xs font-mono text-muted-foreground uppercase">
                Date
              </Text>
              <Text className="text-sm font-bold text-foreground">{tx.date}</Text>
            </Box>
          </Box>

          <Box className="bg-background border border-border rounded-2xl p-4 flex-row items-center justify-between">
            <Text className="text-xs font-mono text-muted-foreground uppercase">
              Total
            </Text>
            <Text className="font-display font-black text-2xl text-primary tracking-tight">
              {tx.amount < 0 ? '-' : '+'}$
              {Math.abs(tx.amount)}.00
            </Text>
          </Box>
        </Box>
      ) : (
        <Box className="flex-1 items-center justify-center">
          <Text className="font-mono text-sm text-muted-foreground">
            Invoice not found.
          </Text>
        </Box>
      )}
    </Box>
  );
}
