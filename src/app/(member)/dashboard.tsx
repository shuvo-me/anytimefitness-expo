import { View, Text } from '@/tw';
import { StatusBar } from 'expo-status-bar';

export default function MemberDashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-display text-xl font-bold text-lime-accent">
        Member Dashboard
      </Text>
      <Text className="text-sm font-mono text-text-muted mt-2">
        Coming soon
      </Text>
      <StatusBar style="light" />
    </View>
  );
}
