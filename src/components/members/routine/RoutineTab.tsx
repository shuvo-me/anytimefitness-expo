import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Dumbbell, Utensils } from "lucide-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import { DietEditor } from "./DietEditor";
import { WorkoutEditor } from "./WorkoutEditor";

type RoutineSubTab = "workout" | "diet";

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
      <HStack space="sm" className="items-center">
        <SubTabChip
          label="Workout"
          icon={
            <Dumbbell
              size={14}
              color={activeSubTab === "workout" ? "#000" : "#8A8A9A"}
            />
          }
          active={activeSubTab === "workout"}
          onPress={() => setActiveSubTab("workout")}
        />
        <SubTabChip
          label="Diet"
          icon={
            <Utensils
              size={14}
              color={activeSubTab === "diet" ? "#000" : "#8A8A9A"}
            />
          }
          active={activeSubTab === "diet"}
          onPress={() => setActiveSubTab("diet")}
        />
      </HStack>

      {activeSubTab === "workout" ? (
        <WorkoutEditor memberId={memberId} memberName={memberName} />
      ) : (
        <DietEditor memberId={memberId} memberName={memberName} />
      )}
    </VStack>
  );
}

function SubTabChip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      onPress={onPress}
      size="sm"
      className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${
        active ? "bg-primary" : "bg-card border border-border-subtle"
      }`}
    >
      {icon}
      <ButtonText
        className={`text-[11px] font-mono font-bold uppercase ${
          active ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </ButtonText>
    </Button>
  );
}
