import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useSettingsStore } from '../src/store/settingsStore';
import { useProgressStore } from '../src/store/progressStore';
import { useFavoritesStore } from '../src/store/favoritesStore';
import { preloadAssets } from '../src/lib/preloadAssets';

let initMobileAds: (() => Promise<void>) | null = null;
try {
  const { MobileAds } = require('react-native-google-mobile-ads');
  initMobileAds = () => MobileAds().initialize();
} catch {}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loadSettings, theme } = useSettingsStore();
  const { loadProgress } = useProgressStore();
  const { loadFavorites } = useFavoritesStore();
  const systemScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Promise.all([
        loadSettings(),
        loadProgress(),
        loadFavorites(),
        preloadAssets(),
        initMobileAds?.(),
      ]);
      setReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemScheme === 'dark');

  if (!ready) return null;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#E8E8ED' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
