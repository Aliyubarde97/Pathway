import { useLocalSearchParams } from 'expo-router';
import { FlatList, KeyboardAvoidingView, Text, View } from 'react-native';
import Header from '../../../components/Header';
import QuestionCard from '../../../components/QuestionCard';
import { ExamKey, exams } from '../../../lib/examData';
import { getQuestions } from '../../../lib/questions';
import { colors } from '../../../lib/theme';

export default function Practice() {
  const { exam, subject, year } = useLocalSearchParams<{ exam: ExamKey; subject: string; year: string }>();
  const questions = getQuestions(subject);
  const examName = (exams[exam] ?? exams.jamb).name;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior="padding">
      <Header title={subject} showBack />
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.muted }}>
          {examName} · {year} · {questions.length} questions
        </Text>
      </View>
      <FlatList
        data={questions}
        keyExtractor={(q) => q.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, gap: 14 }}
        renderItem={({ item, index }) => <QuestionCard number={index + 1} question={item} />}
      />
    </KeyboardAvoidingView>
  );
}