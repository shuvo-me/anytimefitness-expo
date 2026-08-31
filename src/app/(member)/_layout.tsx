import { useAuth } from '@/hooks/useAuth';
import { Redirect, Stack } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';

export default function MemberLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center bg-background">
        <Spinner size="large" color="#C8F135" />
      </Box>
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
