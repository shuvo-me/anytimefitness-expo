import { StatusBar } from 'expo-status-bar';
import { Text, View } from '@/tw';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background">
      <Text className="font-display text-3xl font-bold text-lime-accent">
        AnytimeFitenss
      </Text>
      <Text className="text-text-muted">
        Tailwind is wired up. Start building.
      </Text>
      <StatusBar style="light" />
    </View>
  );
}
