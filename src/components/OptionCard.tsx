import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../lib/theme';

type Props = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
};

export default function OptionCard({ title, description, icon, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        minHeight: 96,
        padding: 16,
        borderRadius: 20,
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
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>{title}</Text>
        <Text style={{ fontSize: 14, lineHeight: 20, color: colors.muted }}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.muted} />
    </Pressable>
  );
}