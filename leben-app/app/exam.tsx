import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../src/hooks/useTheme';
import { LANDS } from '../src/data/lands';
import { spacing } from '../src/theme/spacing';
import { getQuestionImage } from '../src/lib/imageMap';

const STATES = LANDS.filter((l) => l.slug !== 'general');

export default function ExamSetupScreen() {
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { land: preselect } = useLocalSearchParams<{ land?: string }>();

  const [selected, setSelected] = useState<string | null>(preselect ?? null);

  const start = () => {
    if (!selected) return;
    router.replace(`/${selected}/exam` as any);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={{ color: colors.primary, fontSize: fs.md, fontWeight: '600' }}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: fs.xl }]}>
          Einbürgerungsprüfung
        </Text>
        <View style={[styles.infoBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary, fontSize: fs.xs }}>33 Fragen · 60 Min · 17/33 zum Bestehen</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: fs.xs }]}>
          IN WELCHEM BUNDESLAND WOHNEN SIE?
        </Text>
        <Text style={[styles.sub, { color: colors.textSecondary, fontSize: fs.sm }]}>
          3 der 33 Fragen kommen aus Ihrem Bundesland.
        </Text>

        <View style={styles.grid}>
          {STATES.map((land) => {
            const isSelected = selected === land.slug;
            return (
              <TouchableOpacity
                key={land.slug}
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && { borderColor: colors.primary, borderWidth: 2.5 },
                ]}
                onPress={() => setSelected(land.slug)}
                activeOpacity={0.75}
              >
                {(() => {
                  const img = getQuestionImage(`${land.slug}_wappen`);
                  return img
                    ? <Image source={img} style={styles.wappen} resizeMode="contain" />
                    : <Text style={{ fontSize: 20 }}>{land.emoji}</Text>;
                })()}
                <Text
                  style={[
                    styles.cardName,
                    { color: isSelected ? colors.primary : colors.text, fontSize: fs.xs },
                  ]}
                  numberOfLines={2}
                >
                  {land.name}
                </Text>
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.check}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Start button */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
        {selected && (
          <Text style={[styles.selectedHint, { color: colors.textSecondary, fontSize: fs.xs }]}>
            30 allgemeine + 3 Fragen aus{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>
              {STATES.find((l) => l.slug === selected)?.name}
            </Text>
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.startBtn,
            { backgroundColor: selected ? colors.primary : colors.border },
          ]}
          onPress={start}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#fff', fontSize: fs.md, fontWeight: '700' }}>
            {selected ? 'Prüfung starten →' : 'Bundesland wählen'}
          </Text>
        </TouchableOpacity>
      </View>
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
  infoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  scroll: { padding: spacing.md, paddingBottom: 20 },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sub: { marginBottom: spacing.md, lineHeight: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '30%',
    flexGrow: 1,
    minWidth: 90,
    maxWidth: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
    minHeight: 88,
    position: 'relative',
  },
  wappen: { width: 32, height: 40 },
  cardName: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  footer: {
    padding: spacing.md,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  selectedHint: { textAlign: 'center' },
  startBtn: {
    padding: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
});
