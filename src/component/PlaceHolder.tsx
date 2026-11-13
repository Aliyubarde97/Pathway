import { Text, View } from 'react-native';
import { colors } from '../lib/theme';


export default function Placeholder({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{title}</Text>
    </View>
  );
}