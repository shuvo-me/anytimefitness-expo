import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { colors } from "@/components/ui/gluestack-ui-provider/config";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { VariableContextProvider } from "nativewind";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <VariableContextProvider value={colors.dark}>
        <GluestackUIProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ animation: "fade" }} />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="(member)" />
          </Stack>
        </GluestackUIProvider>
      </VariableContextProvider>
    </QueryClientProvider>
  );
}
