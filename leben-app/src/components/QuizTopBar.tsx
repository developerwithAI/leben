import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import type { LangCode } from '../types/question';

interface QuizTopBarProps {
  onBack: () => void;
  counter?: string;
  lang: LangCode;
  onOpenLangPicker: () => void;
  rightSlot?: React.ReactNode;
}

export function QuizTopBar({ onBack, counter, lang, onOpenLangPicker, rightSlot }: QuizTopBarProps) {
  const { colors, fs } = useTheme();

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={onBack} hitSlop={12}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      {counter !== undefined && (
        <Text style={{ color: colors.textSecondary, fontSize: fs.sm }}>{counter}</Text>
      )}

      {rightSlot ?? (
        <TouchableOpacity
          style={[styles.langBtn, { borderColor: colors.border }]}
          onPress={onOpenLangPicker}
          hitSlop={8}
        >
          <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
          <Text style={{ color: colors.primary, fontSize: fs.xs, fontWeight: '700' }}>
            {lang.toUpperCase()}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
});
