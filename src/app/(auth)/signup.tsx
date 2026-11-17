import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Field from '../../components/Field';
import { supabase } from '../../lib/supabase';
import { colors } from '../../lib/theme';

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function createAccount() {
    if (!email.includes('@')) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Use a password of at least 8 characters.');
    if (password !== again) return setError('The two passwords do not match.');

    setBusy(true);
    setError('');
    const { data, error: err } = await supabase.auth.signUp({ email: email.trim(), password });
    if (err) setError(err.message);
    else if (!data.session) setSent(true); // email confirmation is on
    setBusy(false);
    // if confirmation is off, a session exists and the app moves in by itself
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior="padding">
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: colors.primary, paddingTop: insets.top + 56, paddingBottom: 32, paddingHorizontal: 24, gap: 8 }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF' }}>Pathway</Text>
          <Text style={{ fontSize: 16, color: colors.headerSub }}>Create your free account.</Text>
        </View>

        <View style={{ padding: 24, gap: 16 }}>
          {sent ? (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Check your email</Text>
              <Text style={{ fontSize: 16, lineHeight: 24, color: colors.muted }}>
                We sent a confirmation link to {email.trim()}. Open it, then come back here and log in.
              </Text>
              <Link href="/" style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>
                Go to log in
              </Link>
            </View>
          ) : (
            <>
              <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Create an account</Text>

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
                placeholder="At least 8 characters"
                autoCapitalize="none"
              />
              <Field
                label="Confirm password"
                secure
                value={again}
                onChangeText={setAgain}
                placeholder="Type the password again"
                autoCapitalize="none"
              />

              {error !== '' && <Text style={{ fontSize: 14, color: '#B91C1C' }}>{error}</Text>}

              <Button label={busy ? 'Please wait...' : 'Create account'} onPress={createAccount} />

              <Text style={{ textAlign: 'center', fontSize: 15, color: colors.muted }}>
                Already have an account?{' '}
                <Link href="/" style={{ fontWeight: '700', color: colors.primary }}>
                  Log in
                </Link>
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}