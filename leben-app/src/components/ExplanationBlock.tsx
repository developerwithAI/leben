import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';

interface Props {
  text: string;
}

export function ExplanationBlock({ text }: Props) {
  const [open, setOpen] = useState(true);
  const { colors, fs } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
      <TouchableOpacity style={styles.header} onPress={() => setOpen((v) => !v)} activeOpacity={0.7}>
        <Text style={[styles.title, { color: colors.primary, fontSize: fs.sm }]}>
          💡 Erklärung {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {open && (
        <Text style={[styles.body, { color: colors.text, fontSize: fs.sm }]}>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  header: {
    padding: spacing.md,
  },
  title: {
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    lineHeight: 22,
  },
});
