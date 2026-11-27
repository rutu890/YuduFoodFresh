
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid password', 'Password must contain at least 6 characters.');
      return;
    }

    navigation.navigate('RememberMe', {
      user: {
        id: `mock_${normalizedEmail}`,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </TouchableOpacity>

        <Text style={styles.eyebrow}>WELCOME BACK</Text>
        <Text style={styles.title}>Login to your account</Text>
        <Text style={styles.subtitle}>Your favourite food is just a few taps away.</Text>

        <Text style={styles.label}>Email address</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={19} color={colors.muted} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={19} color={colors.muted} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
          <Ionicons name="arrow-forward" size={19} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Signup')}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { flexGrow: 1, padding: 25, paddingTop: 55, justifyContent: 'center' },
  back: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: colors.white, alignItems: 'center',
    justifyContent: 'center', marginBottom: 40,
  },
  eyebrow: { color: colors.orange, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.ink, fontSize: 29, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 13, lineHeight: 21, marginTop: 8, marginBottom: 30 },
  label: { color: colors.ink, fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 16 },
  inputWrap: {
    height: 54, borderRadius: 14, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  input: { flex: 1, color: colors.ink, fontSize: 14 },
  button: {
    height: 55, borderRadius: 16, backgroundColor: colors.orange,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 12, marginTop: 30,
  },
  buttonText: { color: colors.white, fontWeight: '900', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: colors.muted, fontSize: 13 },
  link: { color: colors.orangeDeep, fontWeight: '900', fontSize: 13 },
});
