import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import Header from '../../../components/Header';
import { ExamKey, exams, subjects, years } from '../../../lib/examData';
import { colors } from '../../../lib/theme';

export default function Choose() {
  const router = useRouter();
  const { exam } = useLocalSearchParams<{ exam: ExamKey }>();
  const info = exams[exam] ?? exams.jamb;

  const [year, setYear] = useState('2024');
  const [subject, setSubject] = useState('Mathematics');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title={info.name} showBack />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Choose a year and a subject to start practising.
        </Text>

        <Dropdown label="Year" value={year} options={years} onChange={setYear} />
        <Dropdown label="Subject" value={subject} options={subjects} onChange={setSubject} />

        <View style={{ marginTop: 8 }}>
          <Button
            label="Start practice"
            onPress={() =>
              router.push({ pathname: '/exams/practice', params: { exam, subject, year } })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}