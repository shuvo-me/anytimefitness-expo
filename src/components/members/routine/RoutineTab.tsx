import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Dumbbell, Utensils } from "lucide-react-native";
import { useState } from "react";
import { DietEditor } from "./DietEditor";
import { WorkoutEditor } from "./WorkoutEditor";

type RoutineSubTab = "workout" | "diet";

const ROUTINE_TABS = [
  { key: "workout", label: "Workout", icon: Dumbbell },
  { key: "diet", label: "Diet", icon: Utensils },
] as const;

export function RoutineTab({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const [activeSubTab, setActiveSubTab] = useState<RoutineSubTab>("workout");

  return (
    <VStack space="md">
      <HStack className="w-full">
        {ROUTINE_TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeSubTab === key;

          return (
            <Button
              key={key}
              onPress={() => setActiveSubTab(key)}
              accessibilityState={{ selected: isActive }}
              variant="ghost"
              size="sm"
              className={`flex-1 min-h-11 rounded-none border-b-2 px-3 py-2.5 ${
                isActive ? "border-primary" : "border-border-subtle"
              }`}
            >
              <Icon size={15} color={isActive ? "#C8F135" : "#8A8A9A"} />
              <ButtonText
                numberOfLines={1}
                className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </ButtonText>
            </Button>
          );
        })}
      </HStack>

      {activeSubTab === "workout" ? (
        <WorkoutEditor memberId={memberId} memberName={memberName} />
      ) : (
        <DietEditor memberId={memberId} memberName={memberName} />
      )}
    </VStack>
  );
}
