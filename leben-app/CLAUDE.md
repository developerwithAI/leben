# CLAUDE.md — Leben in Deutschland App

Developer guide for Claude Code sessions. For architecture details see [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

---

## What the App Does

German citizenship test prep app. Users study 310 general BAMF questions + 10 questions per German state (460 total). Four modes:
- **Learn** — paginate through questions sequentially, progress is saved per-question
- **Exam** — 33 random questions, 60-minute timer, results at the end
- **Weak** — review only questions previously answered wrong
- **Favorites** — review only bookmarked questions

Routing: `app/index.tsx` (home + map) → `app/[land]/index.tsx` (mode menu) → `app/[land]/learn|exam|weak|favorites|results|search.tsx`

`land='general'` is a special value that means "all general questions, no state-specific questions".

---

## Coding Conventions

**Colors and fonts:** Always use `useTheme()`. Never hardcode hex values in screen files.
```ts
const { colors, fs, isDark } = useTheme();
// colors.primary, colors.text, colors.background, colors.surface, colors.border
// colors.correct, colors.wrong, colors.textSecondary
// fs.xs, fs.sm, fs.md, fs.lg, fs.xl
```

**AsyncStorage:** All access goes through `src/lib/storage.ts`. Use `KEYS`, `getItem`, `setItem`, `removeItem`. Never import `AsyncStorage` directly outside of `storage.ts`.

**Zustand stores:** Every store must have `loaded: boolean` and a `loadX()` async init function. Stores are initialized in `app/_layout.tsx` via `Promise.all`. Follow the pattern in `src/store/settingsStore.ts`.

**Screen structure:** `SafeAreaView` root → top bar row → scrollable content → fixed bottom bar (nav/ad). Copy from `app/[land]/learn.tsx`.

**Styles:** `StyleSheet.create({})` at the bottom of the file only. Dynamic values (colors, font sizes) inline. No inline style objects for static values.

**Touchables:** `hitSlop={12}` on all icon-only touchable elements.

**Question browsing screens:** Use `useQuizSession` hook from `src/hooks/useQuizSession.ts` for state management (index, selectedAnswer, sessionAnswers, handleAnswer, goNext, goPrev).

---

## Quiz Engine (Reusable Core)

These files have zero dependency on German-specific content. They can be copied verbatim to build another quiz app:

| File | Purpose |
|------|---------|
| `src/hooks/useQuizSession.ts` | Session state: index, answers, navigation |
| `src/hooks/useTimer.ts` | Exam countdown timer |
| `src/hooks/useTheme.ts` | Color + font size provider |
| `src/store/settingsStore.ts` | Language, theme, font size |
| `src/store/progressStore.ts` | Correct/wrong tracking per question ID |
| `src/store/favoritesStore.ts` | Bookmarked question IDs |
| `src/lib/storage.ts` | AsyncStorage wrapper with typed KEYS |
| `src/lib/examLogic.ts` | Exam generation, seeded shuffle |
| `src/lib/translations.ts` | Language fallback logic |
| `src/types/question.ts` | Core data types: Question, Translation, ExamResult |
| `src/theme/` | colors.ts, typography.ts, spacing.ts |
| `src/components/QuizTopBar.tsx` | Reusable top navigation bar |
| `src/components/QuizEmptyState.tsx` | Empty state screen |
| `src/components/QuestionCard.tsx` | Question display |
| `src/components/AnswerOption.tsx` | Answer button |
| `src/components/ProgressBar.tsx` | Progress indicator |
| `src/components/Timer.tsx` | Countdown display |
| `src/components/LangPicker.tsx` | Language selector modal |
| `src/components/BannerAd.tsx` | AdMob banner wrapper |

See [../docs/TEMPLATE_GUIDE.md](../docs/TEMPLATE_GUIDE.md) for the checklist to start a new app.

---

## App-Specific Content (Replace When Templating)

| File/Directory | What It Contains |
|----------------|-----------------|
| `src/data/questions/` | 17 JSON files with BAMF questions |
| `src/data/lands.ts` | 17 German states metadata |
| `src/data/landInfo.ts` | State capitals, population, descriptions |
| `src/data/germany-states.json` | GeoJSON state boundaries |
| `src/components/GermanyMap.tsx` | Germany-specific home screen map |
| `src/lib/mapHtml/statesHtml.ts` | Leaflet HTML for Germany states map |
| `src/lib/mapHtml/worldHtml.ts` | Leaflet HTML for neighbors/Europe map |
| `src/lib/imageMap.ts` | Static image require() mapping |
| `src/lib/preloadAssets.ts` | Font/image preloading list |
| `app/index.tsx` | Home screen (Germany map specific) |
| `assets/images/` | Coat of arms images, question images |
| `app.json` | App name, bundle ID, AdMob IDs |

---

## Known Issues and TODOs

- **AdMob IDs:** iOS and Android IDs in `src/components/BannerAd.tsx` and `src/hooks/useInterstitialAd.ts` are real production IDs. Test IDs are used in `__DEV__` mode.
- **Translations:** Turkish (tr), Arabic (ar), Persian (fa) JSON structures exist but content is incomplete/machine-translated.
- **EAS Build:** Production build config in `eas.json` needs final signing credentials.
- **App Store:** Store URLs in `app/settings.tsx` are placeholders.

---

## Manual Test Checklist

After any change to screens or stores, verify:

- [ ] Learn mode: answer questions, advance, go back, reach end → results screen
- [ ] Learn mode single question (`questionNum` param): summary modal appears
- [ ] Exam mode: timer counts down, dot navigator scrolls, finish button with alert
- [ ] Results screen: filter tabs (Alle/Richtig/Falsch), score display
- [ ] Weak mode: only wrong questions appear, wrap-around at end
- [ ] Favorites: toggle ☆ on a question, enter favorites, question appears
- [ ] Settings: theme switch (light/dark/system), font size change
- [ ] Map: switch all 3 modes, click a state → modal with info → start test
- [ ] Dark mode: all refactored screens render correctly
- [ ] Large font: no text truncation in top bars or cards

---

## Running TypeScript Check

```bash
cd leben-app
npx tsc --noEmit
```

Should always return zero errors.
