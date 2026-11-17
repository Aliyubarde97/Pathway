import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeCard from '../../components/HomeCard';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { colors } from '../../lib/theme';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();

  function confirmLogOut() {
    Alert.alert('Log out', 'Do you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: colors.primary,
          paddingTop: insets.top + 16,
          paddingBottom: 22,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF' }}>Pathway</Text>
          <Text numberOfLines={1} style={{ fontSize: 14, color: colors.headerSub }}>
            {session?.user.email ?? 'What would you like to do?'}
          </Text>
        </View>
        <Pressable
          onPress={confirmLogOut}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#3B57A8', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={{ flex: 1, padding: 16, gap: 14 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 14 }}>
          <HomeCard
            title="Scan to solve"
            description="Snap a question and get the answer"
            icon="camera-outline"
            onPress={() => router.navigate('/scan')}
          />
          <HomeCard
            title="Exams"
            description="JAMB, WAEC and NECO"
            icon="school-outline"
            onPress={() => router.navigate('/exams')}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', gap: 14 }}>
          <HomeCard
            title="Letters"
            description="SOP, email, CV and cover letter"
            icon="document-text-outline"
            onPress={() => router.navigate('/letters')}
          />
          <HomeCard
            title="Scholarships"
            description="New scholarships posted here"
            icon="notifications-outline"
            onPress={() => router.navigate('/scholarships')}
          />
        </View>
      </View>
    </View>
  );
}