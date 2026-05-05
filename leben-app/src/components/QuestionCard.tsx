import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnswerOption } from './AnswerOption';
import { ExplanationBlock } from './ExplanationBlock';
import { useTheme } from '../hooks/useTheme';
import { useSettingsStore } from '../store/settingsStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { getQuestion } from '../lib/translations';
import { getQuestionImage } from '../lib/imageMap';
import { spacing } from '../theme/spacing';
import type { Question } from '../types/question';
import { RTL_LANGS } from '../types/question';

interface Props {
  question: Question;
  mode: 'learn' | 'exam';
  selectedAnswer: number | null;
  onAnswer: (idx: number) => void;
}

const LABELS = ['A', 'B', 'C', 'D'] as const;

export function QuestionCard({ question, mode, selectedAnswer, onAnswer }: Props) {
  const { colors, fs } = useTheme();
  const { lang } = useSettingsStore();
  const { isFavorite, toggle } = useFavoritesStore();

  const hasAnswer = selectedAnswer !== null;
  const de = getQuestion(question, 'de');
  const hasTranslation = lang !== 'de' && !!question.translations[lang as Exclude<typeof lang, 'de'>];
  const translated = hasTranslation ? getQuestion(question, lang) : null;
  const isRTL = hasTranslation && RTL_LANGS.has(lang);
  const imageSrc = question.imageKey ? getQuestionImage(question.imageKey) : null;

  const getState = (idx: number) => {
    if (!hasAnswer) return 'default';
    if (mode === 'exam') return idx === selectedAnswer ? 'selected' : 'default';
    if (idx === question.correct) return 'correct';
    if (idx === selectedAnswer) return 'wrong';
    return 'default';
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        {question.category
          ? <Text style={[styles.category, { color: colors.textSecondary, fontSize: fs.xs }]}>{question.category}</Text>
          : <View />
        }
        <TouchableOpacity onPress={() => toggle(question.id)} hitSlop={8}>
          <Ionicons
            name={isFavorite(question.id) ? 'star' : 'star-outline'}
            size={22}
            color={isFavorite(question.id) ? '#f59e0b' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Question: German + translation below */}
      <View style={styles.questionBlock}>
        <Text selectable style={[styles.question, { color: colors.text, fontSize: fs.lg }]}>
          {de.question}
        </Text>
        {translated && (
          <Text selectable style={[styles.translation, { color: colors.primary, fontSize: fs.md, textAlign: isRTL ? 'right' : 'left' }]}>
            {translated.question}
          </Text>
        )}
      </View>

      {/* Image */}
      {imageSrc && (
        <Image source={imageSrc} style={styles.questionImage} resizeMode="contain" accessibilityLabel="Bild zur Frage" />
      )}

      {/* Answers */}
      <View style={styles.answers}>
        {de.answers.map((answer, idx) => (
          <View key={idx}>
            <AnswerOption
              label={LABELS[idx]}
              text={answer}
              subText={translated?.answers[idx]}
              state={getState(idx)}
              onPress={() => onAnswer(idx)}
              disabled={hasAnswer}
              rtl={false}
            />
          </View>
        ))}
      </View>

      {/* Explanation */}
      {mode === 'learn' && hasAnswer && de.explanation && (
        <View style={styles.explanationBlock}>
          <ExplanationBlock text={de.explanation} />
          {translated?.explanation ? (
            <Text selectable style={[styles.translationExplanation, { color: colors.primary, fontSize: fs.sm }]}>
              {translated.explanation}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: spacing.md, flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  category: { fontWeight: '500', flex: 1 },
  questionBlock: { marginBottom: spacing.md, gap: 6 },
  question: { fontWeight: '600', lineHeight: 26 },
  translation: { fontWeight: '400', lineHeight: 22, opacity: 0.9 },
  answers: { gap: 0 },
  questionImage: { width: '100%', height: 180, marginBottom: spacing.md, borderRadius: 8 },
  explanationBlock: { gap: 6 },
  translationExplanation: { lineHeight: 20, marginTop: 4 },
});
