import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../lib/theme';

type Props = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export default function HomeCard({ title, description, icon, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => ({
        flex: 1,
        justifyContent: 'center',
        gap: 12,
        padding: 18,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.card,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: colors.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={{ fontSize: 21, fontWeight: '800', color: colors.text }}>{title}</Text>
      <Text style={{ fontSize: 14, lineHeight: 20, color: colors.muted }}>{description}</Text>
    </Pressable>
  );
}