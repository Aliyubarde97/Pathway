import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, View,
} from 'react-native';
import Button from '../../../components/Button';
import Field from '../../../components/Field';
import Header from '../../../components/Header';
import { Draft, emptyDraft, fetchDraft, saveScholarship, useIsAdmin } from '../../../lib/admin';
import { colors } from '../../../lib/theme';

const LEVELS = ['Undergraduate', "Master's", 'PhD'];

function validate(d: Draft): string {
  if (d.title.trim() === '') return 'Enter the scholarship name.';
  if (d.country.trim() === '') return 'Enter the country.';
  if (!LEVELS.includes(d.level)) return 'Choose a level.';
  if (d.deadline.trim() !== '') {
    const ok = /^\d{4}-\d{2}-\d{2}$/.test(d.deadline.trim()) && !isNaN(new Date(d.deadline.trim()).getTime());
    if (!ok) return 'Write the deadline as year-month-day, for example 2027-03-31, or leave it empty.';
  }
  if (d.applyUrl.trim() !== '' && !/^https?:\/\//i.test(d.applyUrl.trim())) {
    return 'The link must start with http:// or https://';
  }
  return '';
}

export default function EditScholarship() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { isAdmin, checking } = useIsAdmin();

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchDraft(id)
      .then((d) => {
        if (d) setDraft(d);
        else setError('This scholarship could not be found.');
      })
      .catch(() => setError('Could not load this scholarship.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key: keyof Draft) => (value: string) => setDraft((prev) => ({ ...prev, [key]: value }));

  async function save() {
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError('');
    try {
      await saveScholarship(draft, id);
      Alert.alert('Saved', id ? 'The scholarship was updated.' : 'The scholarship was posted.');
      router.back();
    } catch (e: any) {
      setError(e?.message ?? 'Could not save. Check your internet and try again.');
    }
    setSaving(false);
  }

  const title = id ? 'Edit scholarship' : 'Add scholarship';

  if (checking || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title={title} showBack />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title={title} showBack />
        <Text style={{ padding: 24, fontSize: 16, color: colors.muted }}>This page is for admins only.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior="padding">
      <Header title={title} showBack />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 16 }}
      >
        <Field label="Scholarship name" value={draft.title} onChangeText={set('title')} placeholder="Official name" />
        <Field label="Country" value={draft.country} onChangeText={set('country')} placeholder="e.g. Germany" />

        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>Level</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {LEVELS.map((name) => {
              const active = draft.level === name;
              return (
                <Pressable
                  key={name}
                  onPress={() => set('level')(name)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={{
                    minHeight: 44,
                    paddingHorizontal: 18,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: colors.primary,
                    backgroundColor: active ? colors.primary : '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: active ? '#FFFFFF' : colors.primary }}>
                    {name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Field label="Funding" value={draft.funding} onChangeText={set('funding')} placeholder="e.g. Fully funded" />
        <Field
          label="Deadline"
          value={draft.deadline}
          onChangeText={set('deadline')}
          placeholder="2027-03-31 (empty means open)"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
        />
        <Field
          label="About"
          value={draft.description}
          onChangeText={set('description')}
          placeholder="A short summary in your own words"
          multiline
          textAlignVertical="top"
        />
        <Field
          label="Who can apply"
          value={draft.eligibility}
          onChangeText={set('eligibility')}
          placeholder="The requirements"
          multiline
          textAlignVertical="top"
        />
        <Field
          label="How to apply"
          value={draft.howToApply}
          onChangeText={set('howToApply')}
          placeholder="Steps and documents needed"
          multiline
          textAlignVertical="top"
        />
        <Field
          label="Official link"
          value={draft.applyUrl}
          onChangeText={set('applyUrl')}
          placeholder="https://..."
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Field label="Posted by" value={draft.postedBy} onChangeText={set('postedBy')} placeholder="Pathway team" />

        {error !== '' && <Text style={{ fontSize: 14, lineHeight: 20, color: '#B91C1C' }}>{error}</Text>}

        <Button label={saving ? 'Saving...' : id ? 'Save changes' : 'Post scholarship'} onPress={save} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}