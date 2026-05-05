import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';

interface QuizEmptyStateProps {
  message: string;
  onBack: () => void;
}

export function QuizEmptyState({ message, onBack }: QuizEmptyStateProps) {
  const { colors, fs } = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={{ color: colors.textSecondary, fontSize: fs.md }}>{message}</Text>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
});
