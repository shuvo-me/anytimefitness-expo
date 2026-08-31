import { Stack } from "expo-router";

export default function PaymentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0C0C0F" },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="record"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.75],
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
      <Stack.Screen
        name="invoice/[id]"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.55],
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}
