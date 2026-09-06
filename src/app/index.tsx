import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dumbbell } from "lucide-react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center bg-background gap-4">
        <Box className="w-16 h-16 rounded-2xl bg-primary items-center justify-center">
          <Dumbbell size={32} color="#000000" strokeWidth={2.5} />
        </Box>
        <Text
          className="font-display text-2xl font-extrabold italic tracking-tighter uppercase"
          size="2xl"
        >
          ANYTIME<Text className="text-primary text-2xl">FITNESS</Text>
        </Text>
        <Spinner size="small" color="#C8F135" className="mt-4" />
        <StatusBar style="light" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(admin)/home" />;
}
