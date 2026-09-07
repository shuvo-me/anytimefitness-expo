import { RegisterForm, registerSchema } from "@/api/register.schema";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useRegister } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    registerMutation.mutate(
      {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      },
      {
        onError: (err: Error) => setError(err.message),
        onSuccess: () => setSubmittedEmail(values.email),
      },
    );
  });

  if (submittedEmail) {
    return (
      <Box className="flex-1 bg-background items-center justify-center px-6">
        <Box className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
          <CheckCircle size={32} color="#000000" />
        </Box>
        <Text size="xl" className="font-display font-bold text-center mb-2">
          Registration Successful!
        </Text>
        <Text className="text-sm font-mono text-muted-foreground text-center mb-6 leading-relaxed">
          Login with your email to access your account!
          <Text className="font-bold">{submittedEmail}</Text>
        </Text>
        <Button
          onPress={() => router.replace("/(auth)/login")}
          variant="default"
          size="lg"
          className="rounded-2xl"
        >
          <ButtonText className="font-bold text-sm uppercase tracking-wider text-primary-foreground">
            Back to Login
          </ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Box
        className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "rgba(200, 241, 53, 0.05)" }}
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
                Start your fitness journey today
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

            {/* Full Name */}
            <Box className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Full Name
              </Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={User}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      autoComplete="name"
                      placeholder="John Doe"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs"
                    />
                  </Input>
                )}
              />
              {errors.fullName && (
                <Text className="text-[11px] font-mono text-destructive">
                  {errors.fullName.message}
                </Text>
              )}
            </Box>

            {/* Email */}
            <Box className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Email Address
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={Mail}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      placeholder="you@example.com"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs"
                    />
                  </Input>
                )}
              />
              {errors.email && (
                <Text className="text-[11px] font-mono text-destructive">
                  {errors.email.message}
                </Text>
              )}
            </Box>

            {/* Password */}
            <Box className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={Lock}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      placeholder="Min. 6 characters"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs"
                    />
                    <InputSlot onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon
                        as={showPassword ? EyeOff : Eye}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                  </Input>
                )}
              />
              {errors.password && (
                <Text className="text-[11px] font-mono text-destructive">
                  {errors.password.message}
                </Text>
              )}
            </Box>

            {/* Confirm Password */}
            <Box className="gap-1.5">
              <Text className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input className="bg-background border-border rounded-xl h-11 px-3.5 gap-2.5">
                    <InputSlot>
                      <InputIcon
                        as={Lock}
                        className="text-muted-foreground w-4 h-4"
                      />
                    </InputSlot>
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      placeholder="Re-enter password"
                      placeholderTextColor="#666675"
                      className="font-mono text-xs"
                    />
                  </Input>
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-[11px] font-mono text-destructive">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </Box>

            {/* Submit */}
            <Button
              variant="default"
              size="lg"
              onPress={onSubmit}
              isDisabled={registerMutation.isPending}
              className="w-full h-11 rounded-2xl flex-row items-center justify-center gap-2"
            >
              <ButtonText className="font-extrabold text-sm uppercase tracking-wider text-primary-foreground">
                {registerMutation.isPending ? (
                  <Spinner color="#0C0C0F" />
                ) : (
                  "Create Account"
                )}
              </ButtonText>
              {!registerMutation.isPending && (
                <ButtonIcon
                  as={ArrowRight}
                  className="text-primary-foreground w-4 h-4"
                />
              )}
            </Button>

            {/* Login link */}
            <Box className="flex-row items-center justify-center gap-1">
              <Text className="text-xs font-mono text-muted-foreground">
                Already have an account?
              </Text>
              <Button variant="link" size="sm" onPress={() => router.back()}>
                <ButtonText className="text-xs font-mono font-bold underline">
                  Sign in
                </ButtonText>
              </Button>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
