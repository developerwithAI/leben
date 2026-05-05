import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { getGeneralQuestions } from '../../src/data/questions';
import { spacing } from '../../src/theme/spacing';

export default function SearchScreen() {
  const { land } = useLocalSearchParams<{ land: string }>();
  const router = useRouter();
  const { colors, fs } = useTheme();
  const [search, setSearch] = useState('');

  const allQuestions = useMemo(() => getGeneralQuestions(), []);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return allQuestions;
    const num = parseInt(q, 10);
    if (!isNaN(num)) {
      return allQuestions.filter((item) => {
        const n = (item as any).number ?? item.id;
        return String(n).startsWith(q);
      });
    }
    const lower = q.toLowerCase();
    return allQuestions.filter((item) =>
      item.question_de?.toLowerCase().includes(lower)
    );
  }, [search, allQuestions]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontSize: fs.lg }]}>Fragen</Text>
        <Text style={[{ color: colors.textSecondary, fontSize: fs.sm }]}>{allQuestions.length}</Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={[{ flex: 1, color: colors.text, fontSize: fs.md }]}
          placeholder="Nummer oder Stichwort…"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          keyboardType="default"
          autoFocus
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const num = (item as any).number ?? item.id;
          return (
            <TouchableOpacity
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push({ pathname: `/${land}/learn`, params: { questionNum: String(num) } })}
              activeOpacity={0.7}
            >
              <View style={[styles.numBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.numText}>{num}</Text>
              </View>
              <Text style={[styles.questionText, { color: colors.text, fontSize: fs.sm }]} numberOfLines={2}>
                {item.question_de}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[{ color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl, fontSize: fs.md }]}>
            Keine Ergebnisse
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: { fontWeight: '800' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    margin: spacing.md,
    marginTop: 0,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: 40, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
  },
  numBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  questionText: { flex: 1, lineHeight: 18 },
});
