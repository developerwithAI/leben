import type { Land } from '../types/land';

export const LANDS: Land[] = [
  { slug: 'general', name: 'Allgemeine Fragen', emoji: '🇩🇪', questionCount: 310 },
  { slug: 'baden-wuerttemberg', name: 'Baden-Württemberg', emoji: '🏔️', questionCount: 10 },
  { slug: 'bayern', name: 'Bayern', emoji: '🏰', questionCount: 10 },
  { slug: 'berlin', name: 'Berlin', emoji: '🐻', questionCount: 10 },
  { slug: 'brandenburg', name: 'Brandenburg', emoji: '🦅', questionCount: 10 },
  { slug: 'bremen', name: 'Bremen', emoji: '⚓', questionCount: 10 },
  { slug: 'hamburg', name: 'Hamburg', emoji: '🚢', questionCount: 10 },
  { slug: 'hessen', name: 'Hessen', emoji: '🦁', questionCount: 10 },
  { slug: 'mecklenburg-vorpommern', name: 'Mecklenburg-Vorpommern', emoji: '🌊', questionCount: 10 },
  { slug: 'niedersachsen', name: 'Niedersachsen', emoji: '🐴', questionCount: 10 },
  { slug: 'nordrhein-westfalen', name: 'Nordrhein-Westfalen', emoji: '⚙️', questionCount: 10 },
  { slug: 'rheinland-pfalz', name: 'Rheinland-Pfalz', emoji: '🍷', questionCount: 10 },
  { slug: 'saarland', name: 'Saarland', emoji: '⚒️', questionCount: 10 },
  { slug: 'sachsen', name: 'Sachsen', emoji: '💎', questionCount: 10 },
  { slug: 'sachsen-anhalt', name: 'Sachsen-Anhalt', emoji: '🌿', questionCount: 10 },
  { slug: 'schleswig-holstein', name: 'Schleswig-Holstein', emoji: '🌬️', questionCount: 10 },
  { slug: 'thueringen', name: 'Thüringen', emoji: '🌲', questionCount: 10 },
];

export const getLand = (slug: string): Land | undefined =>
  LANDS.find((l) => l.slug === slug);
