import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';
import { View, ActivityIndicator } from '@/tw';

export default function AdminLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#C8F135" />
      </View>
    );
  }

  if (!isAuthenticated) {
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
