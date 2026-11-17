import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function Dropdown({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{label}</Text>

      {/* The box the student taps */}
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        style={{
          minHeight: 54,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: colors.border,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 17, color: colors.text }}>{value}</Text>
        <Ionicons name="chevron-down" size={22} color={colors.muted} />
      </Pressable>

      {/* The list that slides up */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(15,27,61,0.45)', justifyContent: 'flex-end' }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '70%',
              paddingBottom: insets.bottom + 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, padding: 20, paddingBottom: 8 }}>
              Choose {label.toLowerCase()}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    style={{
                      minHeight: 54,
                      paddingHorizontal: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: selected ? colors.iconBg : '#FFFFFF',
                    }}
                  >
                    <Text style={{ fontSize: 17, fontWeight: selected ? '800' : '500', color: colors.text }}>
                      {item}
                    </Text>
                    {selected && <Ionicons name="checkmark" size={22} color={colors.primary} />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}