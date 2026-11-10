import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { AlertTriangle, CheckCircle2 } from "lucide-react-native";

export function SaveFeedback({
  kind,
  message,
}: {
  kind: "success" | "error";
  message: string;
}) {
  const isSuccess = kind === "success";

  return (
    <Box
      className={`p-3 rounded-xl flex-row items-center gap-2 ${
        isSuccess
          ? "bg-primary/15 border border-primary/40"
          : "bg-destructive/15 border border-destructive/40"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={16} color="#C8F135" />
      ) : (
        <AlertTriangle size={16} color="#FF4B1F" />
      )}
      <Text className="text-xs font-mono text-foreground flex-1">{message}</Text>
    </Box>
  );
}
