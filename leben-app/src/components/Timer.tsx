import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  formatted: string;
  warning?: boolean;
}

export function Timer({ formatted, warning }: Props) {
  const { colors, fs } = useTheme();
  const color = warning ? colors.wrong : colors.textSecondary;

  return (
    <Text style={[styles.text, { color, fontSize: fs.lg }]}>
      ⏱ {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
