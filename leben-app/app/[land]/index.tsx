import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { getLand } from '../../src/data/lands';
import { spacing } from '../../src/theme/spacing';
import { getQuestionImage } from '../../src/lib/imageMap';
import { BannerAd } from '../../src/components/BannerAd';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface ModeButton {
  icon: IoniconsName;
  title: string;
  subtitle: string;
  route: string;
  badge?: number;
}

export default function LandMenuScreen() {
  const { land } = useLocalSearchParams<{ land: string }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { favorites } = useFavoritesStore();

  const landData = getLand(land);
  const isGeneral = land === 'general';
  const wappenImg = land && land !== 'general' ? getQuestionImage(`${land}_wappen`) : null;

  const modes: ModeButton[] = isGeneral
    ? [
        { icon: 'book-outline', title: 'Lernen', subtitle: 'Alle Fragen der Reihe nach', route: `/${land}/learn` },
        { icon: 'star-outline', title: 'Favoriten', subtitle: 'Gespeicherte Fragen', route: `/${land}/favorites`, badge: favorites.length },
        { icon: 'barbell-outline', title: 'Schwächen üben', subtitle: 'Falsch beantwortete Fragen', route: `/${land}/weak` },
      ]
    : [
        { icon: 'book-outline', title: 'Lernen', subtitle: `${landData?.questionCount ?? 10} Fragen zu diesem Bundesland`, route: `/${land}/learn` },
      ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleRow}>
            {wappenImg
              ? <Image source={wappenImg} style={styles.wappen} resizeMode="contain" />
              : <Text style={{ fontSize: 44 }}>{landData?.emoji ?? '🇩🇪'}</Text>
            }
            <Text style={[styles.title, { color: colors.text, fontSize: fs.xl }]}>
              {landData?.name ?? land}
            </Text>
          </View>

          <View style={styles.modes}>
            {modes.map((m) => (
              <TouchableOpacity
                key={m.route}
                style={[styles.modeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(m.route as any)}
                activeOpacity={0.75}
              >
                <Ionicons name={m.icon} size={26} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeTitle, { color: colors.text, fontSize: fs.md }]}>{m.title}</Text>
                  <Text style={[styles.modeSub, { color: colors.textSecondary, fontSize: fs.sm }]}>{m.subtitle}</Text>
                </View>
                {!!m.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{m.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}

            {/* Question search — only for general */}
            {isGeneral && (
              <TouchableOpacity
                style={[styles.modeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push(`/${land}/search` as any)}
                activeOpacity={0.75}
              >
                <Ionicons name="search-outline" size={26} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modeTitle, { color: colors.text, fontSize: fs.md }]}>Frage suchen</Text>
                  <Text style={[styles.modeSub, { color: colors.textSecondary, fontSize: fs.sm }]}>Nach Nummer oder Stichwort</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
      </ScrollView>
      <View style={styles.adBar}>
        <BannerAd />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  back: { fontWeight: '600' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: { fontWeight: '800', flex: 1 },
  wappen: { width: 52, height: 64 },
  modes: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.md,
  },
  modeIcon: { fontSize: 28 },
  modeTitle: { fontWeight: '700' },
  modeSub: { marginTop: 2 },
  badge: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, minWidth: 26, alignItems: 'center' },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  arrow: { fontSize: 22 },
  startBtn: { padding: spacing.md, borderRadius: 14, alignItems: 'center' },
  adBar: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});
