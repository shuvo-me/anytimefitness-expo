import { supabase } from "@/lib/supabase";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "@/tw";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    // useAuth will re-render and the root layout redirect will handle navigation
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Background glow */}
      <View
        className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(200, 241, 53, 0.05)" }}
      />
      <View
        className="absolute bottom-10 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(91, 141, 239, 0.05)" }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-32 pb-4"
      >
        <View className="w-full max-w-lg mx-auto gap-3">
          {/* Brand header */}
          <View className="items-center gap-1">
            <View className="w-14 h-14 rounded-2xl bg-lime-accent items-center justify-center mb-1">
              <Dumbbell size={28} color="#000000" strokeWidth={2.5} />
            </View>
            <View className="items-center">
              <Text className="font-display text-3xl font-extrabold italic tracking-tighter uppercase text-white">
                ANYTIME<Text className="text-lime-accent">FITNESS</Text>
              </Text>
              <Text className="text-xs font-mono text-text-muted tracking-wider uppercase leading-none">
                Welcome back to your journey
              </Text>
            </View>
          </View>

          {/* Auth card */}
          <View className="bg-card border border-border-subtle rounded-3xl p-6 gap-4">
            {/* Error */}
            {error && (
              <View
                className="p-3 rounded-2xl flex-row items-center gap-2.5"
                style={{
                  backgroundColor: "rgba(255, 75, 31, 0.15)",
                  borderColor: "rgba(255, 75, 31, 0.4)",
                  borderWidth: 1,
                }}
              >
                <AlertCircle size={16} color="#FF4B1F" />
                <Text className="text-xs font-mono text-white flex-1">
                  {error}
                </Text>
              </View>
            )}

            {/* Email */}
            <View className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                Email Address
              </Text>
              <View className="flex-row items-center bg-background border border-border-subtle rounded-xl px-3.5 h-11 gap-2.5">
                <Mail size={16} color="#8A8A9A" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="you@example.com"
                  placeholderTextColor="#666675"
                  className="flex-1 text-white font-mono text-xs"
                />
              </View>
            </View>

            {/* Password */}
            <View className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                Password
              </Text>
              <View className="flex-row items-center bg-background border border-border-subtle rounded-xl px-3.5 h-11 gap-2.5">
                <Lock size={16} color="#8A8A9A" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#666675"
                  className="flex-1 text-white font-mono text-xs font-bold"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} color="#8A8A9A" />
                  ) : (
                    <Eye size={16} color="#8A8A9A" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <View className="items-end">
              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text className="text-[11px] font-mono text-lime-accent underline">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              className="w-full h-11 rounded-2xl bg-lime-accent flex-row items-center justify-center gap-2"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              <Text className="font-extrabold text-sm text-black uppercase tracking-wider">
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
              {!isLoading && <ArrowRight size={16} color="#000000" />}
            </TouchableOpacity>

            {/* Register link */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-xs font-mono text-text-muted">
                Don{"'"}t have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text className="text-xs font-mono text-lime-accent font-bold underline">
                  Create one
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center gap-1">
            <Text className="font-mono text-[10px] text-text-muted">
              ANYTIMEFITNESS • SECURE ACCESS GATE
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
