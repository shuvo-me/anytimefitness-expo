import { useAuth } from '@/hooks/useAuth';
import { Redirect, Tabs } from 'expo-router';
import { View, ActivityIndicator } from '@/tw';
import {
  Home,
  Users,
  Calendar,
  Settings,
} from 'lucide-react-native';

export default function AdminLayout() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#C8F135" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C8F135',
        tabBarInactiveTintColor: '#8A8A9A',
        tabBarStyle: {
          backgroundColor: '#141418',
          borderTopColor: '#1E1E26',
          paddingBottom: 24,
          paddingTop: 8,
          height: 72,
        },
        tabBarLabelStyle: {
          fontFamily: 'monospace',
          fontSize: 10,
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarIcon: ({ color }) => <Users size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Calendar size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
