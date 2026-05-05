import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { BannerAd } from '../../src/components/BannerAd';
import { LangPicker } from '../../src/components/LangPicker';
import { spacing } from '../../src/theme/spacing';
import { EXAM_PASS_THRESHOLD } from '../../src/lib/examLogic';
import { getQuestion } from '../../src/lib/translations';
import { useSettingsStore } from '../../src/store/settingsStore';
import type { Question } from '../../src/types/question';
import { getQuestions, getGeneralQuestions } from '../../src/data/questions';

const LABELS = ['A', 'B', 'C', 'D'] as const;

export default function ResultsScreen() {
  const { land, answers: answersParam, questionIds: idsParam, timeSeconds, mode } = useLocalSearchParams<{
    land: string;
    answers: string;
    questionIds: string;
    timeSeconds: string;
    mode?: string;
  }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const { lang } = useSettingsStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const answers: Record<number, number> = JSON.parse(answersParam ?? '{}');
  const questionIds: number[] = JSON.parse(idsParam ?? '[]');

  useEffect(() => {
    const landQ = land && land !== 'general' ? getQuestions(land) : [];
    const all = [...getGeneralQuestions(), ...landQ];
    const ordered = questionIds.map((id) => all.find((q) => q.id === id)).filter(Boolean) as Question[];
    setQuestions(ordered);
  }, [land]);

  const score = questions.filter((q) => answers[q.id] === q.correct).length;
  const passed = score >= EXAM_PASS_THRESHOLD;
  const secs = parseInt(timeSeconds ?? '0', 10);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  const filtered = questions.filter((q) => {
    const correct = answers[q.id] === q.correct;
    if (filter === 'correct') return correct;
    if (filter === 'wrong') return !correct;
    return true;
  });

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: passed ? colors.correctLight : colors.wrongLight }]}>
          <Text style={styles.heroEmoji}>{passed ? '🎉' : '😔'}</Text>
          <Text style={[styles.heroTitle, { color: passed ? colors.correct : colors.wrong, fontSize: fs.xxl }]}>
            {passed ? 'Bestanden!' : 'Nicht bestanden'}
          </Text>
          <Text style={[styles.heroScore, { color: colors.text, fontSize: fs.xl }]}>
            {score} / {questions.length}
          </Text>
          <Text style={[styles.heroSub, { color: colors.textSecondary, fontSize: fs.sm }]}>
            Mindestens {EXAM_PASS_THRESHOLD} richtig · Zeit: {mm}:{ss}
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatBox label="Richtig" value={score} color={colors.correct} fs={fs} />
            <StatBox label="Falsch" value={questions.length - score} color={colors.wrong} fs={fs} />
            <StatBox label="Gesamt" value={questions.length} color={colors.text} fs={fs} />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Filter tabs */}
          <View style={[styles.filterRow, { backgroundColor: colors.surface }]}>
            {([
              { id: 'all',     label: 'Alle',   icon: 'albums'          },
              { id: 'wrong',   label: 'Falsch',  icon: 'close-circle'   },
              { id: 'correct', label: 'Richtig', icon: 'checkmark-circle'},
            ] as const).map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterTab, filter === f.id && { backgroundColor: colors.primary }]}
                onPress={() => setFilter(f.id)}
              >
                <Ionicons name={f.icon} size={13} color={filter === f.id ? '#fff' : colors.textSecondary} />
                <Text style={[{ fontSize: fs.xs, fontWeight: '700', color: filter === f.id ? '#fff' : colors.textSecondary }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lang picker button */}
          <TouchableOpacity
            style={[styles.langBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setLangPickerOpen(true)}
          >
            <Ionicons name="globe-outline" size={20} color={colors.textSecondary} />
            <Text style={[{ color: colors.primary, fontSize: fs.xs, fontWeight: '700' }]}>{lang.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Questions list */}
        {filtered.map((q, i) => {
          const t = getQuestion(q, lang);
          const userAnswer = answers[q.id] ?? -1;
          const isCorrect = userAnswer === q.correct;

          return (
            <View
              key={q.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isCorrect ? colors.correct : colors.wrong,
                  borderLeftWidth: 4,
                },
              ]}
            >
              {/* Question number + status */}
              <View style={styles.cardHeader}>
                <Text style={[{ color: colors.textSecondary, fontSize: fs.xs, fontWeight: '700' }]}>
                  #{questionIds.indexOf(q.id) + 1}
                </Text>
                <Text style={[{ color: isCorrect ? colors.correct : colors.wrong, fontSize: fs.xs, fontWeight: '700' }]}>
                  {isCorrect ? '✓ Richtig' : '✗ Falsch'}
                </Text>
              </View>

              {/* Question text */}
              <Text selectable style={[styles.questionText, { color: colors.text, fontSize: fs.sm }]}>
                {t.question}
              </Text>

              {/* Answers */}
              <View style={styles.answersBlock}>
                {t.answers.map((ans, idx) => {
                  const isUserChoice = idx === userAnswer;
                  const isCorrectAns = idx === q.correct;
                  let bg = 'transparent';
                  let textColor = colors.textSecondary;
                  let prefix = `${LABELS[idx]}. `;

                  if (isCorrectAns) {
                    bg = colors.correctLight;
                    textColor = colors.correct;
                    prefix = '✓ ';
                  } else if (isUserChoice && !isCorrect) {
                    bg = colors.wrongLight;
                    textColor = colors.wrong;
                    prefix = '✗ ';
                  }

                  return (
                    <View key={idx} style={[styles.answerRow, { backgroundColor: bg }]}>
                      <Text selectable style={[styles.answerText, { color: textColor, fontSize: fs.xs }]}>
                        {prefix}{ans}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Action buttons */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace(`/${land}/${mode === 'learn' ? 'learn' : 'exam'}` as any)}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: fs.md }}>Nochmal versuchen</Text>
        </TouchableOpacity>
        {questions.some((q) => answers[q.id] !== q.correct) && (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.wrong }]}
            onPress={() => {
              const ids = questions.filter((q) => answers[q.id] !== q.correct).map((q) => q.id);
              router.replace({
                pathname: `/${land}/learn`,
                params: { wrongIds: JSON.stringify(ids) },
              } as any);
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: fs.md }}>
              Falsche wiederholen ({questions.filter((q) => answers[q.id] !== q.correct).length})
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btnOutline, { borderColor: colors.border }]}
          onPress={() => router.replace('/general' as any)}
        >
          <Text style={{ color: colors.text, fontSize: fs.md }}>Zum Menü</Text>
        </TouchableOpacity>
      </ScrollView>

      <BannerAd />

      <LangPicker visible={langPickerOpen} onClose={() => setLangPickerOpen(false)} />
    </SafeAreaView>
  );
}

function StatBox({ label, value, color, fs }: { label: string; value: number; color: string; fs: any }) {
  return (
    <View style={styles.statBox}>
      <Text style={[{ color, fontSize: 22, fontWeight: '800' }]}>{value}</Text>
      <Text style={[{ color, fontSize: fs.xs, opacity: 0.8 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 40 },
  hero: {
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroEmoji: { fontSize: 52 },
  heroTitle: { fontWeight: '800' },
  heroScore: { fontWeight: '700' },
  heroSub: { textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  statBox: { alignItems: 'center', gap: 2 },
  controls: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  filterRow: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 3,
    gap: 2,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 8,
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
  card: {
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionText: { lineHeight: 20, fontWeight: '500' },
  answersBlock: { gap: 4 },
  answerRow: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  answerText: { lineHeight: 18 },
  btn: {
    padding: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnOutline: {
    padding: spacing.md,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
