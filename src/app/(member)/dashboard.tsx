import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { StatusBar } from 'expo-status-bar';

export default function MemberDashboard() {
  return (
    <Box className="flex-1 items-center justify-center bg-background">
      <Text size="xl" className="font-display font-bold">
        Member Dashboard
      </Text>
      <Text className="text-sm font-mono text-muted-foreground mt-2">
        Coming soon
      </Text>
      <StatusBar style="light" />
    </Box>
  );
}
