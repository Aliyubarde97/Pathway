import { Pressable, Text } from 'react-native';
import { colors } from '../lib/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export default function Button({ label, onPress, variant = 'primary' }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        minHeight: 54,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: primary ? colors.primary : colors.card,
        borderWidth: primary ? 0 : 2,
        borderColor: colors.border,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 17, fontWeight: '700', color: primary ? '#FFFFFF' : colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
}