import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, Text, View } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import {
  Scholarship, fetchScholarship, isSaved, setSaved as saveToDb,
} from '../../../lib/scholarshipData';
import { colors } from '../../../lib/theme';

export default function ScholarshipDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Scholarship | null | undefined>(undefined); // undefined = loading
  const [saved, setSavedFlag] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchScholarship(id)
      .then((s) => {
        if (alive) setItem(s);
      })
      .catch(() => {
        if (alive) setItem(null);
      });
    isSaved(id)
      .then((v) => {
        if (alive) setSavedFlag(v);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [id]);

  async function toggleSave() {
    const next = !saved;
    setSavedFlag(next);
    try {
      await saveToDb(id, next);
    } catch {
      setSavedFlag(!next);
      Alert.alert('Could not save', 'Check your internet and try again.');
    }
  }

  function openPage(url: string) {
    if (!url) {
      Alert.alert('No link yet', 'The official link has not been added for this scholarship.');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Could not open the link'));
  }

  if (item === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title="Scholarship" showBack />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (item === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title="Scholarship" showBack />
        <Text style={{ padding: 24, fontSize: 16, color: colors.muted }}>
          This scholarship could not be found. It may have been removed.
        </Text>
      </View>
    );
  }

  const rows: [string, string][] = [
    ['Country', item.country],
    ['Level', item.level],
    ['Funding', item.funding],
    ['Deadline', item.deadline],
  ];

  const sections: [string, string][] = [
    ['About', item.description],
    ['Who can apply', item.eligibility],
    ['How to apply', item.howToApply],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Scholarship" showBack />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: colors.muted }}>
          Posted on {item.postedOn} by {item.postedBy}
        </Text>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 18,
            paddingHorizontal: 16,
          }}
        >
          {rows.map(([label, value], i) => (
            <View
              key={label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 12,
                paddingVertical: 12,
                borderBottomWidth: i === rows.length - 1 ? 0 : 2,
                borderBottomColor: colors.iconBg,
              }}
            >
              <Text style={{ fontSize: 15, color: colors.muted }}>{label}</Text>
              <Text style={{ flexShrink: 1, textAlign: 'right', fontSize: 15, fontWeight: '700', color: colors.text }}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        {sections.map(([heading, body]) => (
          <View key={heading} style={{ gap: 6 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{heading}</Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.text }}>{body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ padding: 16, gap: 10, backgroundColor: '#FFFFFF', borderTopWidth: 2, borderTopColor: colors.border }}>
        <Button label="Open official page" onPress={() => openPage(item.applyUrl)} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button label={saved ? 'Saved' : 'Save'} variant="secondary" onPress={toggleSave} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Remind me"
              variant="secondary"
              onPress={() => Alert.alert('Reminder', 'Reminders are coming soon.')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}