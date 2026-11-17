import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export default function Header({ title, showBack = false, onBack }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingTop: insets.top + 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <StatusBar style="light" />
      {showBack && (
        <Pressable
          accessibilityLabel="Go back"
          onPress={onBack ?? (() => router.back())}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B57A8', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
      )}
      <Text style={{ fontSize: 19, fontWeight: '700', color: '#FFFFFF' }}>{title}</Text>
    </View>
  );
}