import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, ScrollView, Image, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BannerAd } from '../src/components/BannerAd';
import { GermanyMap } from '../src/components/GermanyMap';
import { useTheme } from '../src/hooks/useTheme';
import { LANDS } from '../src/data/lands';
import { spacing } from '../src/theme/spacing';
import { getQuestionImage } from '../src/lib/imageMap';
import { getGeneralQuestions } from '../src/data/questions';

const [general, ...regions] = LANDS;
const generalCount = getGeneralQuestions().length;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, fs } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mapActive, setMapActive] = useState(false);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.adContainer}>
        <BannerAd />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: fs.xxl }]}>
          🇩🇪 Leben in Deutschland
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={10}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} scrollEnabled={!mapActive}>
        {/* Two main action cards */}
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.halfCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/${general.slug}`)}
            activeOpacity={0.8}
          >
            <Ionicons name="book-outline" size={32} color="#fff" />
            <Text style={[styles.halfCardTitle, { fontSize: fs.md }]}>Lernen</Text>
            <Text style={[styles.halfCardSub, { fontSize: fs.xs }]}>300 Fragen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.halfCard, { backgroundColor: colors.correct ?? '#22c55e' }]}
            onPress={() => router.push('/exam')}
            activeOpacity={0.8}
          >
            <Ionicons name="clipboard-outline" size={32} color="#fff" />
            <Text style={[styles.halfCardTitle, { fontSize: fs.md }]}>Prüfung</Text>
            <Text style={[styles.halfCardSub, { fontSize: fs.xs }]}>33 Fragen · BAMF</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown land selector */}
        <TouchableOpacity
          style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setDropdownOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={20} color={colors.textSecondary} />
          <Text style={[{ color: colors.text, fontSize: fs.md, flex: 1 }]}>Bundesland auswählen…</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Map section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: fs.sm }]}>
          Bundesländer — Karte
        </Text>
        <View
          onTouchStart={() => setMapActive(true)}
          onTouchEnd={() => setMapActive(false)}
          onTouchCancel={() => setMapActive(false)}
        >
          <GermanyMap onStartTest={(slug) => router.push(`/${slug}`)} />
        </View>
      </ScrollView>

      {/* Dropdown modal */}
      <Modal visible={dropdownOpen} transparent animationType="none" onRequestClose={() => setDropdownOpen(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setDropdownOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.text, fontSize: fs.lg }]}>Bundesland wählen</Text>
          <FlatList
            data={regions}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => {
              const img = getQuestionImage(`${item.slug}_wappen`);
              return (
                <TouchableOpacity
                  style={[styles.sheetRow, { borderBottomColor: colors.border }]}
                  onPress={() => { setDropdownOpen(false); router.push(`/${item.slug}`); }}
                >
                  {img
                    ? <Image source={img} style={styles.rowWappen} resizeMode="contain" />
                    : <Text style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{item.emoji}</Text>
                  }
                  <Text style={[{ color: colors.text, fontSize: fs.md, flex: 1 }]}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  adContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerActions: { flexDirection: 'row', gap: spacing.md },
  title: { fontWeight: '800' },
  scroll: { padding: spacing.md, paddingBottom: 80, gap: spacing.md },
  cardRow: { flexDirection: 'row', gap: spacing.sm },
  halfCard: {
    flex: 1,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.lg,
  },
  halfCardTitle: { color: '#fff', fontWeight: '700' },
  halfCardSub: { color: 'rgba(255,255,255,0.8)' },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  sheetTitle: {
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  rowWappen: { width: 36, height: 44 },
});
