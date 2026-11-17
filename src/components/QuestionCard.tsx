import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Question, letter } from '../lib/questions';
import { colors } from '../lib/theme';

type Props = { number: number; question: Question };

export default function QuestionCard({ number, question }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [mine, setMine] = useState('');
  const [state, setState] = useState<'closed' | 'loading' | 'open'>('closed');

  function solve() {
    if (state === 'open') {
      setState('closed');
      return;
    }
    setState('loading');
    setTimeout(() => setState('open'), 1000); // later: the real AI answer from the backend
  }

  const open = state === 'open';
  const isObjective = question.kind === 'objective';
  const answerLine =
    isObjective && question.options && question.correct !== undefined
      ? `${letter(question.correct)}. ${question.options[question.correct]}`
      : '';

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 16,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.muted }}>
        Question {number} · {isObjective ? 'Objective' : 'Text'}
      </Text>
      <Text style={{ fontSize: 17, lineHeight: 25, fontWeight: '600', color: colors.text }}>
        {question.text}
      </Text>

      {/* Objective: options A to D */}
      {isObjective &&
        question.options?.map((opt, i) => {
          const isCorrect = open && i === question.correct;
          const isWrong = open && picked === i && i !== question.correct;
          const isPicked = picked === i;
          return (
            <Pressable
              key={i}
              onPress={() => setPicked(i)}
              style={{
                minHeight: 48,
                borderRadius: 12,
                borderWidth: 2,
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderColor: isCorrect ? '#15803D' : isWrong ? '#B91C1C' : isPicked ? colors.primary : colors.border,
                backgroundColor: isCorrect ? '#DCFCE7' : isWrong ? '#FEE2E2' : isPicked ? colors.iconBg : '#FFFFFF',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{letter(i)}.</Text>
              <Text style={{ flex: 1, fontSize: 16, color: colors.text }}>{opt}</Text>
            </Pressable>
          );
        })}

      {/* Text: a box to type an answer */}
      {!isObjective && (
        <TextInput
          value={mine}
          onChangeText={setMine}
          placeholder="Type your answer here (optional)"
          placeholderTextColor={colors.muted}
          multiline
          textAlignVertical="top"
          style={{
            minHeight: 100,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            padding: 12,
            fontSize: 16,
            color: colors.text,
          }}
        />
      )}

      {/* Solve with AI */}
      <Pressable
        onPress={solve}
        accessibilityRole="button"
        style={({ pressed }) => ({
          minHeight: 48,
          borderRadius: 12,
          backgroundColor: colors.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Ionicons name="sparkles-outline" size={18} color="#FFFFFF" />
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>
          {open ? 'Hide solution' : 'Solve with AI'}
        </Text>
      </Pressable>

      {state === 'loading' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <ActivityIndicator color={colors.primary} />
          <Text style={{ fontSize: 14, color: colors.muted }}>Solving this question...</Text>
        </View>
      )}

      {open && (
        <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.muted }}>
            {isObjective ? 'Answer' : 'Model answer'}
          </Text>
          {isObjective && (
            <Text style={{ fontSize: 22, fontWeight: '800', color: colors.primary }}>{answerLine}</Text>
          )}
          {isObjective && (
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.muted }}>Quick working</Text>
          )}
          <Text selectable style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>
            {question.solution}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 4 }}>
            Report wrong answer
          </Text>
        </View>
      )}
    </View>
  );
}