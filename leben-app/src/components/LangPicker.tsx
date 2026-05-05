import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../store/settingsStore';
import { spacing } from '../theme/spacing';
import type { LangCode } from '../types/question';

const LANGUAGES: { code: LangCode; native: string; flag: string }[] = [
  { code: 'de', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', native: 'Русский', flag: '🇷🇺' },
  { code: 'uk', native: 'Українська', flag: '🇺🇦' },
  { code: 'en', native: 'English', flag: '🇬🇧' },
  { code: 'tr', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', native: 'العربية', flag: '🇸🇦' },
  { code: 'fa', native: 'فارسی', flag: '🇮🇷' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function LangPicker({ visible, onClose }: Props) {
  const { colors, fs } = useTheme();
  const { lang, setLang } = useSettingsStore();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Text style={[styles.title, { color: colors.text, fontSize: fs.lg }]}>Übersetzungssprache</Text>
        <FlatList
          data={LANGUAGES}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, { borderBottomColor: colors.border }]}
              onPress={() => { setLang(item.code); onClose(); }}
            >
              <Text style={{ fontSize: 24 }}>{item.flag}</Text>
              <Text style={[styles.langLabel, { color: colors.text, fontSize: fs.md }]}>{item.native}</Text>
              {lang === item.code && (
                <Text style={{ color: colors.primary, fontSize: fs.lg }}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  langLabel: { flex: 1, fontWeight: '500' },
});
