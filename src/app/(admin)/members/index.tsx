import { View, Text } from '@/tw';
import { StatusBar } from 'expo-status-bar';
import { Users } from 'lucide-react-native';

export default function MembersList() {
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-16 h-16 rounded-2xl bg-card border border-border-subtle items-center justify-center mb-4">
          <Users size={28} color="#C8F135" />
        </View>
        <Text className="font-display text-xl font-bold text-white text-center">
          Members
        </Text>
        <Text className="text-sm font-mono text-text-muted mt-2 text-center">
          Member list, search, and management
        </Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}
