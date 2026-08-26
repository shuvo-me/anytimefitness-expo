import { View, Text, TouchableOpacity } from '@/tw';
import { StatusBar } from 'expo-status-bar';
import { User, LogOut, Calendar, BarChart3 } from 'lucide-react-native';
import { useLogout } from '@/hooks/useAuth';

export default function AdminProfile() {
  const logoutMutation = useLogout();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-card border border-border-subtle items-center justify-center mb-3">
            <User size={32} color="#C8F135" />
          </View>
          <Text className="font-display text-lg font-bold text-white">
            Admin
          </Text>
          <Text className="text-xs font-mono text-text-muted">
            Administrator
          </Text>
        </View>

        {/* Settings links */}
        <View className="gap-2">
          <TouchableOpacity className="flex-row items-center gap-3 bg-card border border-border-subtle rounded-2xl p-4">
            <Calendar size={20} color="#C8F135" />
            <View className="flex-1">
              <Text className="text-sm font-mono font-bold text-white">
                Schedule
              </Text>
              <Text className="text-xs font-mono text-text-muted">
                Class roster and bookings
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-3 bg-card border border-border-subtle rounded-2xl p-4">
            <BarChart3 size={20} color="#5B8DEF" />
            <View className="flex-1">
              <Text className="text-sm font-mono font-bold text-white">
                Reports
              </Text>
              <Text className="text-xs font-mono text-text-muted">
                Analytics and insights
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="mt-auto mb-8">
          <TouchableOpacity
            onPress={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="flex-row items-center justify-center gap-2 bg-card border border-border-subtle rounded-2xl p-4"
          >
            <LogOut size={18} color="#FF4B1F" />
            <Text className="text-sm font-mono font-bold text-alert-red">
              {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="light" />
    </View>
  );
}
