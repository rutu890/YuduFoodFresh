
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (name.trim().length < 2) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert('Invalid phone number', 'Enter a 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must contain at least 6 characters.');
      return;
    }

    navigation.navigate('RememberMe', {
      user: {
        id: `mock_${normalizedEmail}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
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

        <Text style={styles.eyebrow}>JOIN YUDU FOOD</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Let's get your food journey started.</Text>

        <Text style={styles.label}>Full name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="10-digit mobile number"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrap}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
          <Ionicons name="arrow-forward" size={19} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { flexGrow: 1, padding: 25, paddingTop: 55, paddingBottom: 35 },
  back: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  eyebrow: { color: colors.orange, fontSize: 11, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.ink, fontSize: 29, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 8, marginBottom: 18 },
  label: { color: colors.ink, fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 14 },
  input: {
    height: 53, borderRadius: 14, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14,
    color: colors.ink, fontSize: 14,
  },
  passwordWrap: {
    height: 53, borderRadius: 14, backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  passwordInput: { flex: 1, color: colors.ink, fontSize: 14 },
  button: {
    height: 55, borderRadius: 16, backgroundColor: colors.orange,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 12, marginTop: 27,
  },
  buttonText: { color: colors.white, fontWeight: '900', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 23 },
  footerText: { color: colors.muted, fontSize: 13 },
  link: { color: colors.orangeDeep, fontWeight: '900', fontSize: 13 },
});
