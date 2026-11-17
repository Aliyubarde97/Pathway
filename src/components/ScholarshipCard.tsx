import { Pressable, Text, View } from 'react-native';
import { Scholarship } from '../lib/scholarshipData';
import { colors } from '../lib/theme';

type Props = { item: Scholarship; onPress: () => void };

export default function ScholarshipCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={({ pressed }) => ({
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 16,
        gap: 8,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '800', color: colors.text }}>{item.title}</Text>
        {item.isNew && (
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: colors.text,
              backgroundColor: colors.border,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 3,
              overflow: 'hidden',
            }}
          >
            New
          </Text>
        )}
      </View>
      <Text style={{ fontSize: 14, lineHeight: 20, color: colors.muted }}>
        {item.country} · {item.level} · {item.funding}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: colors.accentText,
            backgroundColor: '#FFEDD5',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 3,
            overflow: 'hidden',
          }}
        >
          Deadline: {item.deadline}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>View details</Text>
      </View>
    </Pressable>
  );
}