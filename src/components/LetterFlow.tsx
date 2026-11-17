import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, ScrollView,
  Text, TextInput, View
} from 'react-native';
import { LetterConfig } from '../lib/letterData';
import { colors } from '../lib/theme';
import Button from './Button';
import ExportSheet from './ExportSheet';
import Header from './Header';
import OptionCard from './OptionCard';


type IconName = React.ComponentProps<typeof Ionicons>['name'];
type Screen = 'level' | 'form' | 'draft';

type Props = {
  title: string;                 // e.g. "Email generator"
  shortTitle: string;            // e.g. "Email"
  draftTitle: string;            // e.g. "Your email draft"
  formIntro: string;
  generateLabel: string;         // e.g. "Generate email"
  levelIntro?: string;
  levels?: { key: string; config: LetterConfig }[];   // with a level choice
  single?: LetterConfig;                              // no level choice
};

export default function LetterFlow({
  title, shortTitle, draftTitle, formIntro, generateLabel, levelIntro, levels, single,
}: Props) {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>(levels ? 'level' : 'form');
  const [levelKey, setLevelKey] = useState(levels?.[0]?.key ?? '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [sheet, setSheet] = useState(false);
  

  const current: LetterConfig = levels
    ? levels.find((l) => l.key === levelKey)!.config
    : single!;
  const firstScreen: Screen = levels ? 'level' : 'form';

  function goBack() {
    if (screen === firstScreen) router.back();
    else setScreen(screen === 'draft' ? 'form' : 'level');
  }

  function chooseLevel(key: string) {
    setLevelKey(key);
    setAnswers({});
    setScreen('form');
  }

  function generate() {
    setDraft(current.build(answers));
    setScreen('draft');
  }

  async function copyDraft() {
    await Clipboard.setStringAsync(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  

  // Screen 1: choose level
  if (screen === 'level' && levels) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title={title} showBack onBack={goBack} />
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.muted }}>
            {levelIntro ?? 'Which level are you applying for? The questions change with your choice.'}
          </Text>
          {levels.map((l) => (
            <OptionCard
              key={l.key}
              title={l.config.label}
              description={l.config.description}
              icon={(l.config.icon ?? 'document-text-outline') as IconName}
              onPress={() => chooseLevel(l.key)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Screen 2: form
  if (screen === 'form') {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
       behavior="padding"
      >
        <Header title={levels ? `${shortTitle}: ${current.label}` : title} showBack onBack={goBack} />
      <ScrollView
  contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 16 }}
  keyboardShouldPersistTaps="handled"
>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.muted }}>{formIntro}</Text>
          {current.fields.map((f) => (
            <View key={f.key} style={{ gap: 6 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{f.label}</Text>
              <TextInput
                value={answers[f.key] ?? ''}
                onChangeText={(t) => setAnswers((prev) => ({ ...prev, [f.key]: t }))}
                placeholder={f.hint}
                placeholderTextColor={colors.muted}
                multiline
                style={{
                  minHeight: 50,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: colors.border,
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                }}
              />
            </View>
          ))}
        </ScrollView>
        <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 2, borderTopColor: colors.border }}>
          <Button label={generateLabel} onPress={generate} />
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Screen 3: draft
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
    behavior="padding"
    >
      <Header title={draftTitle} showBack onBack={goBack} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: '#FFEDD5', borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.accentText }}>
            Personalise this draft. Generic text gets ignored. Replace the [brackets] with your own details.
          </Text>
        </View>
        <View style={{ backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: colors.border, borderRadius: 18, padding: 16 }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            textAlignVertical="top"
            style={{ minHeight: 320, fontSize: 16, lineHeight: 26, color: colors.text }}
          />
        </View>
      </ScrollView>
            <View style={{ padding: 16, gap: 12, backgroundColor: '#FFFFFF', borderTopWidth: 2, borderTopColor: colors.border }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Button label={copied ? 'Copied' : 'Copy'} variant="secondary" onPress={copyDraft} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Regenerate" variant="secondary" onPress={() => setDraft(current.build(answers))} />
          </View>
        </View>
        <Button label="Share or download" onPress={() => setSheet(true)} />
      </View>

      <ExportSheet visible={sheet} onClose={() => setSheet(false)} title={shortTitle} text={draft} />
    </KeyboardAvoidingView>
   
  );
}