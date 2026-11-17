import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../lib/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const icon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) =>
    <Ionicons name={name} size={size} color={color as string} />;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          height: 56 + bottom,
          paddingTop: 6,
          paddingBottom: bottom,
          backgroundColor: '#FFFFFF',
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: icon('camera-outline') }} />
      <Tabs.Screen name="exams" options={{ title: 'Exams', tabBarIcon: icon('school-outline') }} />
      <Tabs.Screen name="letters" options={{ title: 'Letters', tabBarIcon: icon('document-text-outline') }} />
      <Tabs.Screen name="scholarships" options={{ title: 'Scholarships', tabBarIcon: icon('notifications-outline') }} />
    </Tabs>
  );
}