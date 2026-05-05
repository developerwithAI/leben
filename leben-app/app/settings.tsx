import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { useSettingsStore } from '../src/store/settingsStore';
import { useProgressStore } from '../src/store/progressStore';
import { useFavoritesStore } from '../src/store/favoritesStore';
import { spacing } from '../src/theme/spacing';

const APP_VERSION = '1.0.0';
const SUPPORT_EMAIL = 'sohachdaniil@gmail.com';

// Replace with actual App Store / Google Play URLs after publishing
const STORE_URL_IOS = 'https://apps.apple.com/app/id000000000';
const STORE_URL_ANDROID = 'https://play.google.com/store/apps/details?id=com.lebenindeutschland.hilfe';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { theme, fontSize, setTheme, setFontSize } = useSettingsStore();
  const { resetProgress } = useProgressStore();
  const { clearFavorites } = useFavoritesStore();

  const confirmReset = () => {
    Alert.alert(
      'Alle Daten löschen?',
      'Lernfortschritt, Favoriten und alle gespeicherten Daten werden unwiderruflich gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Alles löschen',
          style: 'destructive',
          onPress: () => { resetProgress(); clearFavorites(); },
        },
      ]
    );
  };

  const openSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Leben in Deutschland – Support`);
  };

  const rateApp = () => {
    // On a real device, detect platform and open the correct store
    Alert.alert(
      'App bewerten',
      'Gefällt Ihnen die App? Hinterlassen Sie eine Bewertung im Store!',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Zum App Store', onPress: () => Linking.openURL(STORE_URL_IOS) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: fs.xl }]}>Einstellungen</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Theme */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs.xs }]}>DESIGN</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {(['system', 'light', 'dark'] as const).map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[styles.row, i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => setTheme(t)}
            >
              <View style={styles.rowIcon}>
                <Ionicons
                  name={t === 'system' ? 'contrast-outline' : t === 'light' ? 'sunny-outline' : 'moon-outline'}
                  size={18}
                  color={colors.text}
                />
                <Text style={{ color: colors.text, fontSize: fs.md }}>
                  {t === 'system' ? '  Automatisch' : t === 'light' ? '  Hell' : '  Dunkel'}
                </Text>
              </View>
              {theme === t && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Font size */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs.xs }]}>SCHRIFTGRÖSSE</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {(['small', 'medium', 'large'] as const).map((s, i) => (
            <TouchableOpacity
              key={s}
              style={[styles.row, i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              onPress={() => setFontSize(s)}
            >
              <Text style={{ color: colors.text, fontSize: fs.md }}>
                {s === 'small' ? 'Klein' : s === 'medium' ? 'Mittel' : 'Groß'}
              </Text>
              {fontSize === s && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Support & Feedback */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs.xs }]}>SUPPORT</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={openSupport}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="mail-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: fs.md }}>  Feedback & Kontakt</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={rateApp}>
            <View style={styles.rowIcon}>
              <Ionicons name="star-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: fs.md }}>  App bewerten</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs.xs }]}>RECHTLICHES</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: fs.md }}>  Datenschutzerklärung</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/terms')}>
            <View style={styles.rowIcon}>
              <Ionicons name="document-text-outline" size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: fs.md }}>  Nutzungsbedingungen</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Data */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs.xs }]}>DATEN</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.row} onPress={confirmReset}>
            <View style={styles.rowIcon}>
              <Ionicons name="trash-outline" size={18} color={colors.wrong} />
              <Text style={{ color: colors.wrong, fontSize: fs.md, fontWeight: '600' }}>  Alle Daten löschen</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: colors.textSecondary, fontSize: fs.xs }]}>
          Löscht Lernfortschritt und Favoriten von diesem Gerät.
        </Text>

        {/* About */}
        <View style={[styles.card, { backgroundColor: colors.surface, marginTop: spacing.md }]}>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: fs.sm }}>Version</Text>
            <Text style={{ color: colors.text, fontSize: fs.sm, fontWeight: '600' }}>{APP_VERSION}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: fs.sm }}>Fragen</Text>
            <Text style={{ color: colors.text, fontSize: fs.sm, fontWeight: '600' }}>460 (Stand 2026)</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: colors.textSecondary, fontSize: fs.sm }}>Quelle</Text>
            <Text style={{ color: colors.text, fontSize: fs.sm, fontWeight: '600' }}>BAMF</Text>
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textSecondary, fontSize: fs.xs }]}>
          Leben in Deutschland: 460 Fragen{'\n'}
          Fragenkatalog: BAMF, Stand 05/2025{'\n'}
          Kein offizielles BAMF-Produkt. Zur Prüfungsvorbereitung.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  title: { fontWeight: '800' },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 60 },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: spacing.sm,
  },
  card: { borderRadius: 14, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  hint: { marginTop: 4, paddingHorizontal: spacing.xs },
  rowIcon: { flexDirection: 'row', alignItems: 'center' },
  footer: {
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
  },
});