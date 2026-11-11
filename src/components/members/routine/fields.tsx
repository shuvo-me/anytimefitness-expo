import { Text } from "@/components/ui/text";
import type { ReactNode } from "react";

export const routineInputClassName =
  "w-full h-10 min-h-10 bg-card border border-border-subtle rounded-lg px-2.5";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-muted-foreground font-mono text-[10px] uppercase mb-1">
      {children}
    </Text>
  );
}

export function MiniLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-[10px] text-muted-foreground font-mono">
      {children}
    </Text>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text className="text-[10px] font-mono text-destructive">{message}</Text>
  );
}
