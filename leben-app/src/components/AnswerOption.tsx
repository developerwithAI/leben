import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';

interface Props {
  label: string;
  text: string;
  subText?: string;
  state: 'default' | 'selected' | 'correct' | 'wrong';
  onPress: () => void;
  disabled: boolean;
  rtl?: boolean;
}

export function AnswerOption({ label, text, subText, state, onPress, disabled, rtl }: Props) {
  const { colors, fs } = useTheme();

  const bg =
    state === 'correct' ? colors.correctLight :
    state === 'wrong' ? colors.wrongLight :
    state === 'selected' ? colors.primaryLight :
    colors.surface;

  const border =
    state === 'correct' ? colors.correct :
    state === 'wrong' ? colors.wrong :
    state === 'selected' ? colors.primary :
    colors.border;

  const textColor =
    state === 'correct' ? colors.correct :
    state === 'wrong' ? colors.wrong :
    state === 'selected' ? colors.primary :
    colors.text;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bg, borderColor: border, flexDirection: rtl ? 'row-reverse' : 'row' }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.label, { borderColor: border, backgroundColor: state !== 'default' ? border : 'transparent' }]}>
        <Text style={[styles.labelText, { color: state !== 'default' ? '#fff' : textColor, fontSize: fs.sm }]}>
          {label}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text selectable style={[styles.text, { color: textColor, fontSize: fs.md, textAlign: rtl ? 'right' : 'left' }]}>{text}</Text>
        {!!subText && (
          <Text selectable style={[styles.subText, { color: textColor, fontSize: fs.sm, textAlign: rtl ? 'right' : 'left', opacity: 0.75 }]}>{subText}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  label: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontWeight: '700',
  },
  text: {
    lineHeight: 22,
  },
  subText: {
    lineHeight: 18,
    marginTop: 2,
  },
});
