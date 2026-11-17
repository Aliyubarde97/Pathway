import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../lib/theme';

type Props = TextInputProps & { label: string; secure?: boolean };

export default function Field({ label, secure, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{label}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
        }}
      >
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={colors.muted}
          style={{ flex: 1, minHeight: 50, paddingHorizontal: 14, fontSize: 16, color: colors.text }}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden(!hidden)}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={{ width: 48, height: 50, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} color={colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}