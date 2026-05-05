import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QuestionCard } from '../../src/components/QuestionCard';
import { BannerAd } from '../../src/components/BannerAd';
import { LangPicker } from '../../src/components/LangPicker';
import { QuizTopBar } from '../../src/components/QuizTopBar';
import { useTheme } from '../../src/hooks/useTheme';
import { useQuizSession } from '../../src/hooks/useQuizSession';
import { useProgressStore } from '../../src/store/progressStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { spacing } from '../../src/theme/spacing';
import type { Question } from '../../src/types/question';
import { getQuestions, getGeneralQuestions } from '../../src/data/questions';

export default function WeakScreen() {
  const { land } = useLocalSearchParams<{ land: string }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { progress } = useProgressStore();
  const { lang } = useSettingsStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  useEffect(() => {
    const landQuestions = land && land !== 'general' ? getQuestions(land) : [];
    const all = [...getGeneralQuestions(), ...landQuestions];
    setQuestions(all.filter((q) => progress[q.id] === 'wrong'));
  }, [land, progress]);

  const { current, index, selectedAnswer, handleAnswer, goNext } = useQuizSession({
    questions,
    mode: 'learn',
    wrapAround: true,
  });

  if (!current) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>🎉</Text>
          <Text style={[{ color: colors.text, fontSize: fs.lg, fontWeight: '700' }]}>Keine Schwächen!</Text>
          <Text style={[{ color: colors.textSecondary, fontSize: fs.md, textAlign: 'center' }]}>
            Du hast alle Fragen richtig beantwortet.
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <QuizTopBar
        onBack={() => router.back()}
        counter={`${index + 1} / ${questions.length}`}
        lang={lang}
        onOpenLangPicker={() => setLangPickerOpen(true)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuestionCard question={current} mode="learn" selectedAnswer={selectedAnswer} onAnswer={handleAnswer} />
      </ScrollView>

      <BannerAd />
      <LangPicker visible={langPickerOpen} onClose={() => setLangPickerOpen(false)} />

      <View style={[styles.nav, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.navBtnPrimary, { backgroundColor: selectedAnswer !== null ? colors.primary : colors.border }]}
          onPress={goNext}
          disabled={selectedAnswer === null}
        >
          <View style={styles.rowIcon}>
            <Text style={{ color: '#fff', fontSize: fs.md, fontWeight: '700' }}>Weiter</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  nav: { padding: spacing.md, borderTopWidth: 1 },
  navBtnPrimary: { padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  rowIcon: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
});
