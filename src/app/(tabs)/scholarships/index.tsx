import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, Switch, Text, View,
} from 'react-native';
import Header from '../../../components/Header';
import ScholarshipCard from '../../../components/ScholarshipCard';
import { useIsAdmin } from '../../../lib/admin';
import { Scholarship, fetchScholarships, levelFilters } from '../../../lib/scholarshipData';
import { colors } from '../../../lib/theme';

export default function Scholarships() {
  const router = useRouter();
  const { isAdmin } = useIsAdmin();
  const [items, setItems] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [alerts, setAlerts] = useState(true);

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await fetchScholarships());
    } catch (e) {
      console.warn('Scholarships failed:', e);
      setError('Could not load scholarships. Check your internet, then pull down to try again.');
    }
  }, []);

  // reload every time this tab is opened
  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false));
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const list = items.filter((s) => filter === 'All' || s.level === filter);

  const top = (
    <View style={{ gap: 12, paddingBottom: 4 }}>
      {isAdmin && (
        <Pressable
          onPress={() => router.push('/scholarships/admin')}
          accessibilityRole="button"
          style={{
            minHeight: 48,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: colors.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary }}>
            Manage scholarships (admin)
          </Text>
        </Pressable>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          backgroundColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 16,
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: colors.text }}>
          Alert me when new scholarships are posted
        </Text>
        <Switch
          value={alerts}
          onValueChange={setAlerts}
          trackColor={{ false: '#9AA7C7', true: colors.primary }}
          thumbColor="#FFFFFF"
          accessibilityLabel="Scholarship alerts"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {levelFilters.map((name) => {
          const active = filter === name;
          return (
            <Pressable
              key={name}
              onPress={() => setFilter(name)}
              accessibilityRole="button"
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
      </ScrollView>

      {error !== '' && (
        <Text style={{ fontSize: 14, lineHeight: 20, color: '#B91C1C' }}>{error}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Scholarships" />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(s) => s.id}
          ListHeaderComponent={top}
          ListEmptyComponent={
            error === '' ? (
              <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 24 }}>
                No open scholarships for this level right now. Check back soon.
              </Text>
            ) : undefined
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <ScholarshipCard
              item={item}
              onPress={() => router.push({ pathname: '/scholarships/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </View>
  );
}