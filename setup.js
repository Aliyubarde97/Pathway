const fs = require('fs');
const path = require('path');

const BASE = 'src';

function write(file, content) {
  const full = path.join(BASE, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
  console.log('created', full);
}

// remove the wrong folders and files
[
  'app',
  'components',
  'lib',
  'src/component',
  'src/app/(tabs)',
  'src/app/layout.tsx',
  'src/app/index.tsx',
].forEach((p) => fs.rmSync(p, { recursive: true, force: true }));

write('lib/theme.ts', `
export const colors = {
  primary: '#1E3A8A',
  accent: '#FDBA74',
  accentText: '#7C2D12',
  background: '#F6F8FC',
  card: '#FFFFFF',
  border: '#DCE4F5',
  text: '#0F1B3D',
  muted: '#4A587D',
};
`);

write('components/Placeholder.tsx', `
import { View, Text } from 'react-native';
import { colors } from '../lib/theme';

export default function Placeholder({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{title}</Text>
    </View>
  );
}
`);

write('app/_layout.tsx', `
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`);

write('app/(tabs)/_layout.tsx', `
import { ComponentProps } from 'react';
import { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../lib/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const icon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) =>
    <Ionicons name={name} size={size} color={color as string} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { height: 65, paddingTop: 6, paddingBottom: 8, backgroundColor: '#FFFFFF', borderTopColor: colors.border },
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
`);

write('app/(tabs)/index.tsx', `
import Placeholder from '../../components/Placeholder';

export default function Home() {
  return <Placeholder title="Main page" />;
}
`);

write('app/(tabs)/scan.tsx', `
import Placeholder from '../../components/Placeholder';

export default function Scan() {
  return <Placeholder title="Scan to solve" />;
}
`);

[
  ['exams', 'Exams'],
  ['letters', 'Letters'],
  ['scholarships', 'Scholarships'],
].forEach(([folder, name]) => {
  write('app/(tabs)/' + folder + '/_layout.tsx', `
import { Stack } from 'expo-router';

export default function ${name}Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`);
  write('app/(tabs)/' + folder + '/index.tsx', `
import Placeholder from '../../../components/Placeholder';

export default function ${name}() {
  return <Placeholder title="${name}" />;
}
`);
});