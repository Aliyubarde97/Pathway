import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Format, downloadDocument, formats, shareDocument } from '../lib/exportDocument';
import { colors } from '../lib/theme';
import Button from './Button';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;   // used for the file name, e.g. "SOP"
  text: string;    // the draft
};

export default function ExportSheet({ visible, onClose, title, text }: Props) {
  const insets = useSafeAreaInsets();
  const [format, setFormat] = useState<Format>('pdf');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function run(action: 'share' | 'download') {
    setBusy(true);
    setMessage('');
    try {
            if (action === 'share') {
        const note = await shareDocument(format, title, text);
        if (note) setMessage(note);
      } else {
        setMessage(await downloadDocument(format, title, text));
      }
       } catch (e) {
      setMessage('Something went wrong: ' + (e instanceof Error ? e.message : String(e)));
    }
    setBusy(false);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(15,27,61,0.45)', justifyContent: 'flex-end' }}>
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            paddingBottom: insets.bottom + 20,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>Share or download</Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>Choose a format first.</Text>

          {formats.map((f) => {
            const active = f.key === format;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFormat(f.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={{
                  minHeight: 60,
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.iconBg : '#FFFFFF',
                  paddingHorizontal: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={active ? colors.primary : colors.muted}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text }}>{f.label}</Text>
                  <Text style={{ fontSize: 13, color: colors.muted }}>{f.hint}</Text>
                </View>
              </Pressable>
            );
          })}

          {busy ? (
            <View style={{ minHeight: 54, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <View style={{ flex: 1 }}>
                <Button label="Share" onPress={() => run('share')} />
              </View>
              <View style={{ flex: 1 }}>
                <Button label="Download" variant="secondary" onPress={() => run('download')} />
              </View>
            </View>
          )}

          {message !== '' && (
            <Text style={{ fontSize: 14, textAlign: 'center', color: colors.muted }}>{message}</Text>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}