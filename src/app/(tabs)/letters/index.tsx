import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Header from '../../../components/Header';
import OptionCard from '../../../components/OptionCard';
import { colors } from '../../../lib/theme';

export default function Letters() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Letters" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={{ fontSize: 14, color: colors.muted }}>Choose what you want to write</Text>

        <OptionCard
          title="SOP generator"
          description="Statement of Purpose from your background"
          icon="document-text-outline"
          onPress={() => router.push('/letters/sop')}
        />
        <OptionCard
          title="Email generator"
          description="Email to a professor or supervisor"
          icon="mail-outline"
          onPress={() => router.push('/letters/email')}
        />
        <OptionCard
          title="CV generator"
          description="Build a CV for jobs or applications"
          icon="person-outline"
          onPress={() => router.push('/letters/cv')}
        />

          <OptionCard
          title="Cover letter generator"
          description="Cover letter for a job or internship application"
          icon="briefcase-outline"
          onPress={() => router.push('/letters/cover-letter')}
        />
      </ScrollView>
    </View>
  );
}