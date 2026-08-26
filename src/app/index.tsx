import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, Text, View } from "@/tw";
import { Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dumbbell } from "lucide-react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background gap-4">
        <View className="w-16 h-16 rounded-2xl bg-lime-accent items-center justify-center">
          <Dumbbell size={32} color="#000000" strokeWidth={2.5} />
        </View>
        <Text className="font-display text-2xl font-extrabold italic tracking-tighter uppercase text-white">
          ANYTIME<Text className="text-lime-accent">FITNESS bbbb</Text>
        </Text>
        <ActivityIndicator size="small" color="#C8F135" className="mt-4" />
        <StatusBar style="light" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(admin)/dashboard" />;
}
