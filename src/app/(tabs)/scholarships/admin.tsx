import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import { AdminRow, deleteScholarship, fetchAdminList, useIsAdmin } from '../../../lib/admin';
import { colors } from '../../../lib/theme';

export default function AdminList() {
  const router = useRouter();
  const { isAdmin, checking } = useIsAdmin();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      setRows(await fetchAdminList());
    } catch (e) {
      console.warn('Admin list failed:', e);
      setError('Could not load the list. Check your internet and try again.');
    }
    setLoading(false);
  }, []);

  // reload every time we come back (for example after saving)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function confirmDelete(row: AdminRow) {
    Alert.alert('Delete scholarship', `Delete "${row.title}"? Students will no longer see it.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteScholarship(row.id);
            setRows((prev) => prev.filter((r) => r.id !== row.id));
          } catch (e: any) {
            Alert.alert('Could not delete', e?.message ?? 'Please try again.');
          }
        },
      },
    ]);
  }

  if (checking || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title="Manage scholarships" showBack />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Header title="Manage scholarships" showBack />
        <Text style={{ padding: 24, fontSize: 16, color: colors.muted }}>This page is for admins only.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Manage scholarships" showBack />

      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View style={{ gap: 12, paddingBottom: 4 }}>
            <Button label="+ Add scholarship" onPress={() => router.push('/scholarships/edit')} />
            {error !== '' && <Text style={{ fontSize: 14, color: '#B91C1C' }}>{error}</Text>}
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {rows.length} scholarships. Expired ones stay here, but students do not see them.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: colors.border,
              borderRadius: 18,
              padding: 16,
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text }}>{item.title}</Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {item.country} · {item.level} · Deadline: {item.deadline ?? 'Open'}
            </Text>
            {item.expired && (
              <Text
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  fontWeight: '700',
                  color: '#7F1D1D',
                  backgroundColor: '#FEE2E2',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  overflow: 'hidden',
                }}
              >
                Expired
              </Text>
            )}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button
                  label="Edit"
                  variant="secondary"
                  onPress={() => router.push({ pathname: '/scholarships/edit', params: { id: item.id } })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button label="Delete" variant="secondary" onPress={() => confirmDelete(item)} />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          error === '' ? (
            <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 24 }}>
              No scholarships yet. Tap "+ Add scholarship".
            </Text>
          ) : undefined
        }
      />
    </View>
  );
}