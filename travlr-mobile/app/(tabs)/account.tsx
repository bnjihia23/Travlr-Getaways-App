// app/(tabs)/account.tsx

import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';

type Mode = 'login' | 'register';

export default function AccountScreen() {
  const { token, userEmail, initializing, authLoading, login, register, logout } =
    useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    try {
      if (mode === 'register') {
        if (!name.trim() || !email.trim() || !password) {
          setError('Please enter name, email, and password.');
          return;
        }
        await register(name.trim(), email.trim(), password);
      } else {
        if (!email.trim() || !password) {
          setError('Please enter email and password.');
          return;
        }
        await login(email.trim(), password);
      }

      // Clear password field after any successful auth
      setPassword('');
    } catch (err: any) {
      console.warn('Auth failed', err);
      setError(err.message || 'Authentication failed. Please check your input.');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleMode = () => {
    setError(null);
    setPassword('');
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  if (initializing) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading account...</ThemedText>
      </ThemedView>
    );
  }

  const isLoggedIn = !!token;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Account
        </ThemedText>

        {isLoggedIn ? (
          <View style={styles.section}>
            <ThemedText type="subtitle">You are logged in.</ThemedText>
            {userEmail && (
              <ThemedText style={styles.infoText}>
                Email: {userEmail}
              </ThemedText>
            )}
            <ThemedText
              type="defaultSemiBold"
              style={styles.linkText}
              onPress={handleLogout}
            >
              Log out
            </ThemedText>
          </View>
        ) : (
          <View style={styles.section}>
            <ThemedText type="subtitle">
              {mode === 'login' ? 'Log in' : 'Create an account'}
            </ThemedText>

            {mode === 'register' && (
              <TextInput
                placeholder="Name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            )}

            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            {error && (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            )}

            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.linkText,
                authLoading && { opacity: 0.6 },
              ]}
              onPress={authLoading ? undefined : handleSubmit}
            >
              {authLoading
                ? mode === 'login'
                  ? 'Logging in...'
                  : 'Creating account...'
                : mode === 'login'
                ? 'Log in'
                : 'Create account'}
            </ThemedText>

            <ThemedText
              style={styles.toggleText}
              onPress={authLoading ? undefined : toggleMode}
            >
              {mode === 'login'
                ? "Need an account? Create one"
                : 'Already have an account? Log in'}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  title: {
    marginBottom: 8,
  },
  section: {
    gap: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  linkText: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  toggleText: {
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ff6b6b',
  },
  infoText: {
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
