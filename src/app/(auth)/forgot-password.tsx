import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from '@/tw';
import { Dumbbell, Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'anytimefitenss://reset-password',
    });

    setIsLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-full bg-lime-accent items-center justify-center mb-4">
            <CheckCircle size={32} color="#000000" />
          </View>
          <Text className="font-display text-xl font-bold text-white text-center mb-2">
            Reset Link Sent
          </Text>
          <Text className="text-sm font-mono text-text-muted text-center mb-6 leading-relaxed">
            Check your inbox at{'\n'}
            <Text className="text-white font-bold">{email}</Text>{'\n'}
            for a password reset link.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.8}
            className="py-3 px-6 rounded-2xl bg-lime-accent"
          >
            <Text className="font-bold text-sm text-black uppercase tracking-wider">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(91, 141, 239, 0.05)' }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-40 pb-4"
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
                We{"'"}ll get you back on track
              </Text>
            </View>
          </View>

          {/* Auth card */}
          <View className="bg-card border border-border-subtle rounded-3xl p-6 gap-4 mt-10">
            {error && (
              <View className="p-3 rounded-2xl flex-row items-center gap-2.5" style={{ backgroundColor: 'rgba(255, 75, 31, 0.15)', borderColor: 'rgba(255, 75, 31, 0.4)', borderWidth: 1 }}>
                <AlertCircle size={16} color="#FF4B1F" />
                <Text className="text-xs font-mono text-white flex-1">{error}</Text>
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

            {/* Submit */}
            <TouchableOpacity
              onPress={handleReset}
              disabled={isLoading}
              activeOpacity={0.8}
              className="w-full h-11 rounded-2xl bg-lime-accent flex-row items-center justify-center gap-2"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            >
              <Text className="font-extrabold text-sm text-black uppercase tracking-wider">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
              {!isLoading && <ArrowRight size={16} color="#000000" />}
            </TouchableOpacity>

            {/* Back to login */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} color="#8A8A9A" />
              <Text className="text-xs font-mono text-text-muted">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
