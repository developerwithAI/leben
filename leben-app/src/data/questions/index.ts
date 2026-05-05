import type { Question } from '../../types/question';

const questionMap: Record<string, { questions?: Question[] } | Question[]> = {
  general: require('./general.json'),
  'baden-wuerttemberg': require('./baden-wuerttemberg.json'),
  bayern: require('./bayern.json'),
  berlin: require('./berlin.json'),
  brandenburg: require('./brandenburg.json'),
  bremen: require('./bremen.json'),
  hamburg: require('./hamburg.json'),
  hessen: require('./hessen.json'),
  'mecklenburg-vorpommern': require('./mecklenburg-vorpommern.json'),
  niedersachsen: require('./niedersachsen.json'),
  'nordrhein-westfalen': require('./nordrhein-westfalen.json'),
  'rheinland-pfalz': require('./rheinland-pfalz.json'),
  saarland: require('./saarland.json'),
  'sachsen-anhalt': require('./sachsen-anhalt.json'),
  sachsen: require('./sachsen.json'),
  'schleswig-holstein': require('./schleswig-holstein.json'),
  thueringen: require('./thueringen.json'),
};

export function getQuestions(land: string): Question[] {
  const data = questionMap[land];
  if (!data) return [];
  return Array.isArray(data) ? data : (data.questions ?? []);
}

export function getGeneralQuestions(): Question[] {
  return getQuestions('general');
}