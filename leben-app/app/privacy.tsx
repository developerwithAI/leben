import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { spacing } from '../src/theme/spacing';

const SECTIONS = [
  {
    title: '1. Verantwortlicher',
    body: 'Diese App wird als Einzelentwickler-Projekt betrieben. Bei Fragen zum Datenschutz wenden Sie sich bitte an: sohachdaniil@gmail.com',
  },
  {
    title: '2. Welche Daten werden gespeichert?',
    body: 'Die App speichert ausschließlich lokal auf Ihrem Gerät:\n\n• Lernfortschritt und beantwortete Fragen\n• Favorisierte Fragen\n• App-Einstellungen (Sprache, Theme, Schriftgröße)\n• Persönliches Wörterbuch\n\nDiese Daten verlassen Ihr Gerät nicht und werden nicht an uns übermittelt.',
  },
  {
    title: '3. Werbung (Google AdMob)',
    body: 'Die App verwendet Google AdMob zur Anzeige von Werbung. AdMob kann dabei folgende Daten erheben:\n\n• Geräte-ID (Advertising ID)\n• IP-Adresse\n• Nutzungsverhalten innerhalb der App\n• Standortdaten (nur grob, auf Basis der IP)\n\nDiese Daten werden von Google LLC verarbeitet. Weitere Informationen: https://policies.google.com/privacy\n\nSie können personalisierte Werbung in den Geräteeinstellungen unter „Datenschutz" → „Werbung" deaktivieren.',
  },
  {
    title: '4. Keine Registrierung erforderlich',
    body: 'Die App erfordert keine Anmeldung. Es werden keine Namen, E-Mail-Adressen oder sonstige personenbezogene Daten direkt von uns erhoben.',
  },
  {
    title: '5. Ihre Rechte (DSGVO)',
    body: 'Da wir keine personenbezogenen Daten auf eigenen Servern speichern, können Sie alle App-Daten jederzeit selbst löschen:\n\n• Einstellungen → „Fortschritt zurücksetzen" löscht alle lokalen Daten\n• Deinstallation der App löscht alle gespeicherten Daten vollständig\n\nFür Anfragen bezüglich der von Google AdMob gespeicherten Daten wenden Sie sich bitte direkt an Google.',
  },
  {
    title: '6. Datensicherheit',
    body: 'Alle Daten werden lokal im geschützten App-Speicher Ihres Geräts gespeichert. Ein Zugriff durch Dritte ist nicht möglich.',
  },
  {
    title: '7. Kinder',
    body: 'Diese App richtet sich an Personen ab 16 Jahren (Mindestalter für den Einbürgerungstest). Sie ist nicht für Kinder unter 13 Jahren gedacht.',
  },
  {
    title: '8. Änderungen dieser Richtlinie',
    body: 'Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Die aktuelle Version ist stets in der App verfügbar.',
  },
  {
    title: '9. Kontakt',
    body: 'Bei Fragen oder Anliegen zum Datenschutz:\nsohachdaniil@gmail.com',
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors, fs } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={{ color: colors.primary, fontSize: fs.md, fontWeight: '600' }}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: fs.lg }]}>Datenschutzerklärung</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.updated, { color: colors.textSecondary, fontSize: fs.xs }]}>
          Stand: Januar 2026
        </Text>

        {SECTIONS.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fs.md }]}>{s.title}</Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary, fontSize: fs.sm }]}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.xs,
  },
  title: { fontWeight: '800' },
  content: { padding: spacing.md, paddingBottom: 60, gap: spacing.md },
  updated: { marginBottom: spacing.sm },
  section: { gap: 6 },
  sectionTitle: { fontWeight: '700', lineHeight: 22 },
  sectionBody: { lineHeight: 22 },
});
