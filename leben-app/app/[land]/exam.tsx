import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QuestionCard } from '../../src/components/QuestionCard';
import { Timer } from '../../src/components/Timer';
import { LangPicker } from '../../src/components/LangPicker';
import { useTheme } from '../../src/hooks/useTheme';
import { useTimer } from '../../src/hooks/useTimer';
import { useSettingsStore } from '../../src/store/settingsStore';
import { generateExam, EXAM_DURATION_SECONDS } from '../../src/lib/examLogic';
import { useInterstitialAd } from '../../src/hooks/useInterstitialAd';
import { spacing } from '../../src/theme/spacing';
import type { Question } from '../../src/types/question';
import { getQuestions, getGeneralQuestions } from '../../src/data/questions';

export default function ExamScreen() {
  const { land, ticket } = useLocalSearchParams<{ land: string; ticket?: string }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { lang } = useSettingsStore();
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const { showIfDue } = useInterstitialAd();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(0);
  const startTime = useRef(Date.now());
  const dotListRef = useRef<FlatList>(null);

  const timer = useTimer(EXAM_DURATION_SECONDS, () => handleFinish(true));

  useEffect(() => {
    if (questions.length > 0) {
      dotListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    }
  }, [index, questions.length]);

  useEffect(() => {
    const ticketNum = ticket ? parseInt(ticket, 10) : undefined;
    const landQ = land && land !== 'general' ? getQuestions(land) : [];
    const exam = generateExam(getGeneralQuestions(), landQ, ticketNum);
    setQuestions(exam);
    timer.start();
  }, [land, ticket]);

  const current = questions[index];
  const answered = answers[current?.id] ?? null;

  const handleAnswer = (idx: number) => {
    if (!current || answered !== null) return;
    setAnswers((prev) => ({ ...prev, [current.id]: idx }));
  };

  const handleFinish = async (timeUp = false) => {
    timer.stop();
    const timeSeconds = Math.round((Date.now() - startTime.current) / 1000);
    await showIfDue();
    router.replace({
      pathname: `/${land}/results`,
      params: {
        answers: JSON.stringify(answers),
        questionIds: JSON.stringify(questions.map((q) => q.id)),
        timeSeconds: String(timeSeconds),
      },
    });
  };

  const confirmFinish = () => {
    const remaining = questions.length - Object.keys(answers).length;
    if (remaining > 0) {
      Alert.alert(
        'Prüfung beenden?',
        `Noch ${remaining} Fragen nicht beantwortet.`,
        [
          { text: 'Weiter', style: 'cancel' },
          { text: 'Beenden', onPress: () => handleFinish(), style: 'destructive' },
        ]
      );
    } else {
      handleFinish();
    }
  };

  if (!current) return null;

  const isWarning = timer.seconds < 300;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Timer formatted={timer.formatted} warning={isWarning} />
        <Text style={[styles.counter, { color: colors.textSecondary, fontSize: fs.sm }]}>
          {ticket ? `#${ticket} · ` : ''}{index + 1} / {questions.length}
        </Text>
        <TouchableOpacity
          style={[styles.langBtn, { borderColor: colors.border }]}
          onPress={() => setLangPickerOpen(true)}
        >
          <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
          <Text style={[{ color: colors.primary, fontSize: 10, fontWeight: '700' }]}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={confirmFinish}>
          <Text style={[{ color: colors.wrong, fontSize: fs.sm, fontWeight: '600' }]}>Beenden</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <QuestionCard
          question={current}
          mode="exam"
          selectedAnswer={answered}
          onAnswer={handleAnswer}
        />
      </ScrollView>

      {/* Question navigator */}
      <FlatList
        ref={dotListRef}
        data={questions}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dotContent}
        style={[styles.dotRow, { borderTopColor: colors.border }]}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item, index: i }) => {
          const isAnswered = answers[item.id] !== undefined;
          const isCurrent = i === index;
          return (
            <TouchableOpacity
              onPress={() => setIndex(i)}
              style={[
                styles.dot,
                {
                  backgroundColor: isAnswered ? colors.primary : colors.surface,
                  borderColor: isCurrent ? colors.primary : colors.border,
                  borderWidth: isCurrent ? 2 : 1,
                },
              ]}
            >
              <Text style={[styles.dotText, { color: isAnswered ? '#fff' : colors.textSecondary }]}>
                {i + 1}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Nav buttons */}
      <View style={[styles.nav, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.navBtn, { borderColor: colors.border }]}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <View style={styles.rowIcon}>
            <Ionicons name="chevron-back" size={18} color={index === 0 ? colors.border : colors.text} />
            <Text style={[{ color: index === 0 ? colors.border : colors.text, fontSize: fs.md }]}>Vor.</Text>
          </View>
        </TouchableOpacity>

        {index < questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navBtnPrimary, { backgroundColor: colors.primary }]}
            onPress={() => setIndex((i) => i + 1)}
          >
            <View style={styles.rowIcon}>
              <Text style={[{ color: '#fff', fontSize: fs.md, fontWeight: '700' }]}>Weiter</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navBtnPrimary, { backgroundColor: colors.correct }]}
            onPress={() => {
              const unanswered = questions.map((q, i) => ({ q, i })).filter(({ q }) => answers[q.id] === undefined);
              if (unanswered.length > 0) {
                Alert.alert(
                  'Noch nicht beantwortet',
                  `${unanswered.length} Frage${unanswered.length > 1 ? 'n' : ''} wurde${unanswered.length > 1 ? 'n' : ''} nicht beantwortet.`,
                  [
                    { text: 'Ansehen', onPress: () => setIndex(unanswered[0].i) },
                    { text: 'Trotzdem abgeben', onPress: () => handleFinish(), style: 'destructive' },
                  ]
                );
              } else {
                handleFinish();
              }
            }}
          >
            <View style={styles.rowIcon}>
              <Text style={[{ color: '#fff', fontSize: fs.md, fontWeight: '700' }]}>Abgeben</Text>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <LangPicker visible={langPickerOpen} onClose={() => setLangPickerOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  counter: { fontWeight: '500' },
  langBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  nav: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  navBtn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  navBtnPrimary: {
    flex: 2,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  rowIcon: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dotRow: { borderTopWidth: 1, maxHeight: 52 },
  dotContent: { paddingHorizontal: spacing.sm, paddingVertical: 8, gap: 6 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { fontSize: 11, fontWeight: '700' },
});
