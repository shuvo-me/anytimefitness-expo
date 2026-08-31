import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { useResetPassword } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Dumbbell,
  Mail,
} from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const resetMutation = useResetPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError(null);

    resetMutation.mutate(
      { email: email.trim() },
      {
        onError: (err: Error) => setError(err.message),
        onSuccess: () => setSuccess(true),
      },
    );
  };

  if (success) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Box className="flex-1 items-center justify-center px-6">
          <Box className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
            <CheckCircle size={32} color="#000000" />
          </Box>
          <Text size="xl" className="font-display font-bold text-center mb-2">
            Reset Link Sent
          </Text>
          <Text className="text-sm font-mono text-muted-foreground text-center mb-6 leading-relaxed">
            Check your inbox at{"\n"}
            <Text className="font-bold">{email}</Text>
            {"\n"}
            for a password reset link.
          </Text>
          <Button
            variant="default"
            size="lg"
            onPress={() => router.replace("/(auth)/login")}
            className="rounded-2xl"
          >
            <ButtonText className="font-bold text-sm uppercase tracking-wider text-primary-foreground">
              Back to Sign In
            </ButtonText>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Box
        className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(91, 141, 239, 0.05)" }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <Box className="w-full max-w-lg mx-auto gap-3 px-6 pt-40 pb-4">
          {/* Brand header */}
          <Box className="items-center gap-1">
            <Box className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-1">
              <Dumbbell size={28} color="#000000" strokeWidth={2.5} />
            </Box>
            <Box className="items-center">
              <Text
                size="3xl"
                className="font-display font-extrabold italic tracking-tighter uppercase"
              >
                ANYTIME
                <Text className="text-primary" size="3xl">
                  FITNESS
                </Text>
              </Text>
              <Text className="text-xs font-mono text-muted-foreground tracking-wider uppercase leading-none">
                {"We\u2019ll get you back on track"}
              </Text>
            </Box>
          </Box>

          {/* Auth card */}
          <Box className="bg-card border border-border rounded-3xl p-6 gap-4 mt-10">
            {error && (
              <Box
                className="p-3 rounded-2xl flex-row items-center gap-2.5"
                style={{
                  backgroundColor: "rgba(255, 75, 31, 0.15)",
                  borderColor: "rgba(255, 75, 31, 0.4)",
                  borderWidth: 1,
                }}
              >
                <AlertCircle size={16} color="#FF4B1F" />
                <Text className="text-xs font-mono flex-1">{error}</Text>
              </Box>
            )}

            {/* Email */}
            <Box className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Email Address
              </Text>
              <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                <InputSlot>
                  <InputIcon
                    as={Mail}
                    className="text-muted-foreground w-4 h-4"
                  />
                </InputSlot>
                <InputField
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="you@example.com"
                  placeholderTextColor="#666675"
                  className="font-mono text-xs"
                />
              </Input>
            </Box>

            {/* Submit */}
            <Button
              variant="default"
              size="lg"
              onPress={handleReset}
              isDisabled={resetMutation.isPending}
              className="w-full h-11 rounded-2xl flex-row items-center justify-center gap-2"
            >
              <ButtonText className="font-extrabold text-sm uppercase tracking-wider text-primary-foreground">
                {resetMutation.isPending ? "Sending..." : "Send Reset Link"}
              </ButtonText>
              {!resetMutation.isPending && (
                <ButtonIcon
                  as={ArrowRight}
                  className="text-primary-foreground w-4 h-4"
                />
              )}
            </Button>

            {/* Back to login */}
            <Button
              variant="ghost"
              className="flex-row items-center justify-center gap-1.5"
              onPress={() => router.back()}
            >
              <ButtonIcon
                as={ArrowLeft}
                className="text-muted-foreground w-3.5 h-3.5"
              />
              <ButtonText className="text-xs font-mono text-muted-foreground">
                Back to Sign In
              </ButtonText>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
