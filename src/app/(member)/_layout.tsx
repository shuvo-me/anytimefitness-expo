import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text } from '@/tw';

export default function MemberLayout() {
  const { role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-mono text-sm text-text-muted">Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || (role !== 'member' && role !== 'trainer')) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0C0C0F' },
      }}
    />
  );
}
