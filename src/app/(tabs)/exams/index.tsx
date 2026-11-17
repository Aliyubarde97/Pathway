import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Header from '../../../components/Header';
import OptionCard from '../../../components/OptionCard';
import { ExamKey, examOrder, exams } from '../../../lib/examData';
import { colors } from '../../../lib/theme';

const icons: Record<ExamKey, React.ComponentProps<typeof OptionCard>['icon']> = {
  jamb: 'school-outline',
  waec: 'book-outline',
  neco: 'reader-outline',
};

export default function Exams() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Exams" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={{ fontSize: 14, color: colors.muted }}>Choose an exam to practise</Text>
        {examOrder.map((key) => (
          <OptionCard
            key={key}
            title={exams[key].name}
            description={exams[key].description}
            icon={icons[key]}
            onPress={() => router.push({ pathname: '/exams/choose', params: { exam: key } })}
          />
        ))}
      </ScrollView>
    </View>
  );
}