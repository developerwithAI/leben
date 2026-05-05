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
import { useFavoritesStore } from '../../src/store/favoritesStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { spacing } from '../../src/theme/spacing';
import type { Question } from '../../src/types/question';
import { getQuestions, getGeneralQuestions } from '../../src/data/questions';

export default function FavoritesScreen() {
  const { land } = useLocalSearchParams<{ land: string }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { favorites } = useFavoritesStore();
  const { lang } = useSettingsStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  useEffect(() => {
    const landQuestions = land && land !== 'general' ? getQuestions(land) : [];
    const all = [...getGeneralQuestions(), ...landQuestions];
    setQuestions(all.filter((q) => favorites.includes(q.id)));
  }, [land, favorites]);

  const { current, index, selectedAnswer, handleAnswer, goNext, goPrev } = useQuizSession({
    questions,
    mode: 'learn',
    wrapAround: true,
  });

  if (!current) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.empty}>
          <Ionicons name="star" size={48} color="#f59e0b" />
          <Text style={[{ color: colors.text, fontSize: fs.lg, fontWeight: '700' }]}>Keine Favoriten</Text>
          <Text style={[{ color: colors.textSecondary, fontSize: fs.md, textAlign: 'center' }]}>
            Tippe auf ☆ bei einer Frage, um sie zu speichern.
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
          style={[styles.navBtn, { borderColor: colors.border }]}
          onPress={goPrev}
          disabled={index === 0}
        >
          <View style={styles.rowIcon}>
            <Ionicons name="chevron-back" size={18} color={index === 0 ? colors.border : colors.text} />
            <Text style={[{ color: index === 0 ? colors.border : colors.text, fontSize: fs.md }]}>Vor.</Text>
          </View>
        </TouchableOpacity>
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
  nav: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm, borderTopWidth: 1 },
  navBtn: { flex: 1, padding: spacing.md, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  navBtnPrimary: { flex: 2, padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  rowIcon: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
});
