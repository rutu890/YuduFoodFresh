
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMEMBER_ME_KEY = '@yudu_remember_me';
const SESSION_KEY = '@yudu_mock_session';
const ONBOARDING_KEY = '@yudu_onboarding_completed';

export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function hasCompletedOnboarding() {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
}

export async function getRememberMe() {
  return (await AsyncStorage.getItem(REMEMBER_ME_KEY)) === 'true';
}

export async function getRememberedSession() {
  if (!(await getRememberMe())) return null;

  const value = await AsyncStorage.getItem(SESSION_KEY);
  return value ? JSON.parse(value) : null;
}

export async function saveLoginPreference(user, rememberMe) {
  await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');

  if (rememberMe) {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}

export async function clearLoginSession() {
  await AsyncStorage.multiRemove([REMEMBER_ME_KEY, SESSION_KEY]);
}
