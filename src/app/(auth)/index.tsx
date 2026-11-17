import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Field from '../../components/Field';
import { supabase } from '../../lib/supabase';
import { colors } from '../../lib/theme';

function friendly(message: string) {
  if (message.includes('Invalid login credentials')) return 'Wrong email or password.';
  if (message.includes('Email not confirmed')) return 'Please confirm your email first. Check your inbox.';
  return message;
}

export default function Login() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function logIn() {
    if (!email.includes('@') || password.length === 0) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) setError(friendly(err.message));
    setBusy(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior="padding">
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 56, paddingBottom: 32, paddingHorizontal: 24, gap: 8 }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF' }}>Pathway</Text>
          <Text style={{ fontSize: 16, color: colors.headerSub }}>Exams, letters and scholarships in one app.</Text>
        </View>

        <View style={{ padding: 24, gap: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Log in with email</Text>

          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
          <Field
            label="Password"
            secure
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            autoCapitalize="none"
            autoComplete="password"
          />

          {error !== '' && <Text style={{ fontSize: 14, color: '#B91C1C' }}>{error}</Text>}

          <Button label={busy ? 'Please wait...' : 'Log in'} onPress={logIn} />

          <Text style={{ textAlign: 'center', fontSize: 15, color: colors.muted }}>
            New here?{' '}
            <Link href="/signup" style={{ fontWeight: '700', color: colors.primary }}>
              Create an account
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}