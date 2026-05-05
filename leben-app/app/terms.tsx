import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { spacing } from '../src/theme/spacing';

const SECTIONS = [
  {
    title: '1. Geltungsbereich',
    body: 'Diese Nutzungsbedingungen gelten für die Nutzung der App „Leben in Deutschland – Einbürgerungstest" (nachfolgend „App"). Mit der Nutzung der App stimmen Sie diesen Bedingungen zu.',
  },
  {
    title: '2. Zweck der App',
    body: 'Die App dient der Vorbereitung auf den offiziellen Einbürgerungstest gemäß § 10 Abs. 5 StAG. Die Fragen basieren auf dem offiziellen Gesamtfragenkatalog des BAMF (Bundesamt für Migration und Flüchtlinge), Stand 2024/2025.',
  },
  {
    title: '3. Keine Haftung für Testergebnis',
    body: 'Die App ist ein Lernhilfsmittel und ersetzt keine offizielle Prüfungsvorbereitung. Wir übernehmen keine Haftung dafür, dass das Bestehen des tatsächlichen Einbürgerungstests garantiert wird. Der offizielle Test wird durch das BAMF durchgeführt und kann von den App-Inhalten abweichen.',
  },
  {
    title: '4. Aktualität der Fragen',
    body: 'Wir bemühen uns, die Fragen stets aktuell zu halten. Da der BAMF-Fragenkatalog gelegentlich aktualisiert wird, können wir keine absolute Übereinstimmung mit dem jeweils aktuellen offiziellen Katalog garantieren. Bitte prüfen Sie im Zweifel immer die offizielle BAMF-Website.',
  },
  {
    title: '5. Kostenfreie Nutzung & Werbung',
    body: 'Die App ist kostenlos nutzbar. Zur Finanzierung werden Werbeanzeigen von Google AdMob eingeblendet. Durch die Nutzung der App stimmen Sie der Anzeige von Werbung zu.',
  },
  {
    title: '6. Geistiges Eigentum',
    body: 'Die Fragen des Einbürgerungstests sind Eigentum des BAMF und werden gemäß den Nutzungsbedingungen des BAMF verwendet (öffentlich zugänglicher Fragenkatalog). Das Design, der Code und die Aufmachung der App sind urheberrechtlich geschützt.',
  },
  {
    title: '7. Verfügbarkeit',
    body: 'Wir bemühen uns um eine kontinuierliche Verfügbarkeit der App, übernehmen jedoch keine Garantie für unterbrechungsfreien Betrieb. Wir behalten uns das Recht vor, die App jederzeit zu ändern, zu aktualisieren oder einzustellen.',
  },
  {
    title: '8. Anwendbares Recht',
    body: 'Es gilt deutsches Recht. Gerichtsstand ist der Wohnort des Entwicklers.',
  },
  {
    title: '9. Kontakt',
    body: 'Bei Fragen zu diesen Nutzungsbedingungen:\nsohachdaniil@gmail.com',
  },
];

export default function TermsScreen() {
  const router = useRouter();
  const { colors, fs } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={{ color: colors.primary, fontSize: fs.md, fontWeight: '600' }}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: fs.lg }]}>Nutzungsbedingungen</Text>
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
