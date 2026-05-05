import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard } from '../../src/components/QuestionCard';
import { BannerAd } from '../../src/components/BannerAd';
import { ProgressBar } from '../../src/components/ProgressBar';
import { LangPicker } from '../../src/components/LangPicker';
import { QuizTopBar } from '../../src/components/QuizTopBar';
import { QuizEmptyState } from '../../src/components/QuizEmptyState';
import { useTheme } from '../../src/hooks/useTheme';
import { useQuizSession } from '../../src/hooks/useQuizSession';
import { useSettingsStore } from '../../src/store/settingsStore';
import { spacing } from '../../src/theme/spacing';
import type { Question } from '../../src/types/question';
import { getQuestions, getGeneralQuestions } from '../../src/data/questions';

export default function LearnScreen() {
  const { land, questionNum, wrongIds } = useLocalSearchParams<{ land: string; questionNum?: string; wrongIds?: string }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { lang } = useSettingsStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const isSingleQuestion = !!questionNum;

  useEffect(() => {
    const landQ = land && land !== 'general' ? getQuestions(land) : [];
    const all = [...getGeneralQuestions(), ...landQ];
    if (wrongIds) {
      const ids = JSON.parse(wrongIds) as number[];
      setQuestions(all.filter((q) => ids.includes(q.id)));
    } else if (questionNum) {
      const num = parseInt(questionNum, 10);
      const found = all.find((q) => (q as any).number === num || q.id === num);
      setQuestions(found ? [found] : []);
    } else {
      setQuestions(land === 'general' ? getGeneralQuestions() : getQuestions(land ?? ''));
    }
  }, [land, questionNum, wrongIds]);

  const { current, index, selectedAnswer, sessionAnswers, correct, answered, isEmpty, handleAnswer, goNext, goPrev, reset } =
    useQuizSession({
      questions,
      mode: 'learn',
      onComplete: (sa, timeSeconds) => {
        if (isSingleQuestion) {
          setSummaryVisible(true);
        } else {
          router.push({
            pathname: `/${land}/results`,
            params: {
              answers: JSON.stringify(sa),
              questionIds: JSON.stringify(questions.map((q) => q.id)),
              timeSeconds: String(timeSeconds),
              mode: 'learn',
            },
          });
        }
      },
    });

  if (isEmpty || !current) {
    return (
      <QuizEmptyState
        message={questionNum ? `Frage ${questionNum} nicht gefunden` : 'Keine Fragen gefunden'}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <QuizTopBar
        onBack={() => router.back()}
        counter={!isSingleQuestion ? `${index + 1} / ${questions.length}` : undefined}
        lang={lang}
        onOpenLangPicker={() => setLangPickerOpen(true)}
      />

      {!isSingleQuestion && <ProgressBar value={index + 1} total={questions.length} height={4} />}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuestionCard question={current} mode="learn" selectedAnswer={selectedAnswer} onAnswer={handleAnswer} />
      </ScrollView>

      <BannerAd />

      <View style={[styles.nav, { borderTopColor: colors.border }]}>
        {!isSingleQuestion && (
          <TouchableOpacity
            style={[styles.navBtn, { borderColor: colors.border }]}
            onPress={goPrev}
            disabled={index === 0}
          >
            <View style={styles.rowIcon}>
              <Text style={[{ color: index === 0 ? colors.border : colors.text, fontSize: fs.md }]}>← Vor.</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navBtnPrimary, { backgroundColor: selectedAnswer !== null ? colors.primary : colors.border }]}
          onPress={goNext}
          disabled={selectedAnswer === null}
        >
          <View style={styles.rowIcon}>
            {isSingleQuestion || index === questions.length - 1 ? (
              <Text style={{ color: '#fff', fontSize: fs.md, fontWeight: '700' }}>Fertig ✓</Text>
            ) : (
              <Text style={{ color: '#fff', fontSize: fs.md, fontWeight: '700' }}>Weiter →</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <LangPicker visible={langPickerOpen} onClose={() => setLangPickerOpen(false)} />

      <Modal visible={summaryVisible} transparent animationType="fade" onRequestClose={() => setSummaryVisible(false)}>
        <View style={styles.summaryBackdrop}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <Text style={{ fontSize: 52, textAlign: 'center' }}>
              {isSingleQuestion ? (correct > 0 ? '✅' : '❌') : (correct === answered ? '🎉' : correct > answered / 2 ? '👍' : '💪')}
            </Text>
            <Text style={[styles.summaryTitle, { color: colors.text, fontSize: fs.xl }]}>
              {isSingleQuestion ? (correct > 0 ? 'Richtig!' : 'Falsch!') : 'Abgeschlossen!'}
            </Text>

            {!isSingleQuestion && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={[{ color: colors.correct, fontSize: 28, fontWeight: '800' }]}>{correct}</Text>
                  <Text style={[{ color: colors.correct, fontSize: fs.xs }]}>Richtig</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[{ color: colors.wrong, fontSize: 28, fontWeight: '800' }]}>{answered - correct}</Text>
                  <Text style={[{ color: colors.wrong, fontSize: fs.xs }]}>Falsch</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[{ color: colors.text, fontSize: 28, fontWeight: '800' }]}>{answered}</Text>
                  <Text style={[{ color: colors.textSecondary, fontSize: fs.xs }]}>Gesamt</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.summaryBtn, { backgroundColor: colors.primary }]}
              onPress={() => { setSummaryVisible(false); reset(); }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: fs.md }}>Nochmal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.summaryBtnOutline, { borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Text style={{ color: colors.text, fontSize: fs.md }}>Zum Menü</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  nav: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm, borderTopWidth: 1 },
  navBtn: { flex: 1, padding: spacing.md, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  navBtnPrimary: { flex: 2, padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  rowIcon: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  summaryBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  summaryCard: { borderRadius: 20, padding: spacing.lg, width: '100%', gap: spacing.md, alignItems: 'center' },
  summaryTitle: { fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: spacing.xl, marginVertical: spacing.sm },
  statBox: { alignItems: 'center', gap: 4 },
  summaryBtn: { padding: spacing.md, borderRadius: 14, alignItems: 'center', width: '100%' },
  summaryBtnOutline: { padding: spacing.md, borderRadius: 14, alignItems: 'center', width: '100%', borderWidth: 1.5 },
});
