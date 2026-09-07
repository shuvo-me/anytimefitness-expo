import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useLogin } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginMode = "admin" | "member";

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [loginMode, setLoginMode] = useState<LoginMode>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (loginMode === "admin") {
      if (!email.trim() || !password.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      loginMutation.mutate(
        { email: email.trim(), password },
        {
          onError: (err: Error) => setError(err.message),
          onSuccess: () => router.replace("/"),
        },
      );
    } else {
      if (!phone.trim() || !pinCode.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      setError("Member login coming soon.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Box
        className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(200, 241, 53, 0.05)" }}
      />
      <Box
        className="absolute bottom-10 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
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
                Welcome back to your journey
              </Text>
            </Box>
          </Box>

          {/* Auth card */}
          <Box className="bg-card border border-border rounded-3xl p-6 gap-4 mt-10">
            {/* Role tabs */}
            <Box className="flex-row bg-background p-1 rounded-2xl border border-border">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setLoginMode("admin");
                  setError(null);
                }}
                className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-xl ${
                  loginMode === "admin" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Shield
                  size={14}
                  color={loginMode === "admin" ? "#000000" : "#8A8A9A"}
                />
                <ButtonText
                  className={`font-bold text-[11px] uppercase tracking-wider ${
                    loginMode === "admin"
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Admin
                </ButtonText>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setLoginMode("member");
                  setError(null);
                }}
                className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-xl ${
                  loginMode === "member" ? "bg-primary" : "bg-transparent"
                }`}
              >
                <User
                  size={14}
                  color={loginMode === "member" ? "#000000" : "#8A8A9A"}
                />
                <ButtonText
                  className={`font-bold text-[11px] uppercase tracking-wider ${
                    loginMode === "member"
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Member
                </ButtonText>
              </Button>
            </Box>

            {/* Error */}
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

            {loginMode === "admin" ? (
              <>
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

                {/* Password */}
                <Box className="gap-1.5">
                  <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Password
                  </Text>
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={Lock}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs font-bold"
                    />
                    <InputSlot onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon
                        as={showPassword ? EyeOff : Eye}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                  </Input>
                </Box>

                {/* Forgot password */}
                <Box className="items-end">
                  <Button
                    variant="link"
                    size="sm"
                    onPress={() => router.push("/(auth)/forgot-password")}
                  >
                    <ButtonText className="text-[11px] font-mono underline font-bold">
                      Forgot password?
                    </ButtonText>
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* Phone */}
                <Box className="gap-1.5">
                  <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Phone Number
                  </Text>
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={Phone}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      autoComplete="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs"
                    />
                  </Input>
                </Box>

                {/* PIN Code */}
                <Box className="gap-1.5">
                  <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    PIN Code
                  </Text>
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={Lock}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={pinCode}
                      onChangeText={setPinCode}
                      secureTextEntry={!showPin}
                      keyboardType="numeric"
                      maxLength={6}
                      placeholder="••••"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs font-bold"
                    />
                    <InputSlot onPress={() => setShowPin(!showPin)}>
                      <InputIcon
                        as={showPin ? EyeOff : Eye}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                  </Input>
                </Box>
              </>
            )}

            {/* Submit */}
            <Button
              variant="default"
              size="lg"
              onPress={handleLogin}
              isDisabled={loginMutation.isPending}
              className="w-full h-11 rounded-2xl flex-row items-center justify-center gap-2"
            >
              <ButtonText className="font-extrabold text-sm uppercase tracking-wider text-primary-foreground">
                {loginMutation.isPending ? (
                  <Spinner color="#0C0C0F" />
                ) : (
                  "Sign In"
                )}
              </ButtonText>
              {!loginMutation.isPending && (
                <ButtonIcon
                  as={ArrowRight}
                  className="text-primary-foreground w-4 h-4"
                />
              )}
            </Button>

            {/* Register link — admin only */}
            {loginMode === "admin" && (
              <Box className="flex-row items-center justify-center gap-1">
                <Text className="text-xs font-mono text-muted-foreground">
                  {"Don\u2019t have an account?"}
                </Text>
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => router.push("/(auth)/register")}
                >
                  <ButtonText className="text-xs font-mono font-bold underline">
                    Create one
                  </ButtonText>
                </Button>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box className="items-center gap-1">
            <Text className="font-mono text-[10px] text-muted-foreground">
              ANYTIMEFITNESS • SECURE ACCESS GATE
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
