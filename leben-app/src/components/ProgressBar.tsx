import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface Props {
  value: number;
  total: number;
  height?: number;
}

export function ProgressBar({ value, total, height = 6 }: Props) {
  const { colors } = useTheme();
  const pct = total === 0 ? 0 : Math.min(value / total, 1);

  return (
    <View style={[styles.track, { height, backgroundColor: colors.border }]}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 99,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
  },
});
