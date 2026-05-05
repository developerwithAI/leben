import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, Modal, Image, ScrollView,
  StyleSheet, Dimensions, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme/spacing';
import { LAND_INFO } from '../data/landInfo';
import { getQuestionImage } from '../lib/imageMap';
import GERMANY_GEOJSON from '../data/germany-states.json';
import { buildStatesHtml } from '../lib/mapHtml/statesHtml';
import { buildWorldHtml } from '../lib/mapHtml/worldHtml';

const SCREEN_W = Dimensions.get('window').width;
const MAP_HEIGHT = SCREEN_W * 1.05;

type MapMode = 'states' | 'neighbors' | 'europe';

const MAP_MODES: { id: MapMode; label: string; icon: string }[] = [
  { id: 'states',    label: 'Bundesländer', icon: 'layers'       },
  { id: 'neighbors', label: 'Nachbarn',     icon: 'git-network'  },
  { id: 'europe',    label: 'Europa',       icon: 'earth'        },
];

const ID_TO_SLUG: Record<string, string> = {
  'DE-BW': 'baden-wuerttemberg', 'DE-BY': 'bayern',     'DE-BE': 'berlin',
  'DE-BB': 'brandenburg',        'DE-HB': 'bremen',      'DE-HH': 'hamburg',
  'DE-HE': 'hessen',             'DE-MV': 'mecklenburg-vorpommern',
  'DE-NI': 'niedersachsen',      'DE-NW': 'nordrhein-westfalen',
  'DE-RP': 'rheinland-pfalz',    'DE-SL': 'saarland',    'DE-ST': 'sachsen-anhalt',
  'DE-SN': 'sachsen',            'DE-SH': 'schleswig-holstein', 'DE-TH': 'thueringen',
};

const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  (GERMANY_GEOJSON as any).features.map((f: any) => [
    ID_TO_SLUG[f.properties.id as string],
    f.properties.name as string,
  ])
);

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { onStartTest: (slug: string) => void; }

export function GermanyMap({ onStartTest }: Props) {
  const { colors, fs, isDark } = useTheme();

  const WAPPEN_URIS = useMemo(() => Object.fromEntries(
    Object.values(ID_TO_SLUG).map((slug) => {
      const img = getQuestionImage(`${slug}_wappen`);
      return [slug, img ? Image.resolveAssetSource(img).uri : ''];
    }).filter(([, uri]) => uri)
  ), []);
  const [mode, setMode]               = useState<MapMode>('states');
  const [selected, setSelected]       = useState<string | null>(null);
  const [coatFullscreen, setCoatFullscreen] = useState(false);
  const [countryName, setCountryName] = useState<string | null>(null);
  const webViewRef = useRef<any>(null);

  const info = selected ? LAND_INFO[selected] : null;

  const html = mode === 'states'
    ? buildStatesHtml(isDark, WAPPEN_URIS, GERMANY_GEOJSON)
    : buildWorldHtml(mode, isDark);


  const switchMode = (m: MapMode) => {
    setSelected(null);
    setCountryName(null);
    setMode(m);
  };

  const closeModal = () => { setCoatFullscreen(false); setSelected(null); };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'landClick' && data.slug) {
        setCountryName(null);
        setSelected(data.slug);
      }
      if (data.type === 'countryClick' && data.name) {
        setCountryName(data.name);
      }
    } catch {}
  };

  return (
    <View>
      {/* Mode switcher */}
      <View style={styles.modeRow}>
        {MAP_MODES.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.modeBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
              mode === m.id && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => switchMode(m.id)}
            activeOpacity={0.75}
          >
            <Ionicons name={m.icon as any} size={14} color={mode === m.id ? '#fff' : colors.text} />
            <Text style={[styles.modeBtnText, {
              color: mode === m.id ? '#fff' : colors.text,
              fontSize: fs.xs,
            }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          key={mode + String(isDark)}
          originWhitelist={['*']}
          source={{ html }}
          style={{ width: SCREEN_W - spacing.md * 2 + 2, height: MAP_HEIGHT + 2, marginLeft: -1, marginTop: -1 }}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          scalesPageToFit={false}
          scrollEnabled={false}
          bounces={false}
          backgroundColor="transparent"
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
        />
      </View>

      {/* Country name tooltip (neighbors / europe) */}
      {countryName && mode !== 'states' && (
        <TouchableOpacity
          style={[styles.countryToast, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setCountryName(null)}
          activeOpacity={0.8}
        >
          <Text style={{ color: colors.text, fontSize: fs.sm, fontWeight: '700' }}>{countryName}</Text>
          <Text style={{ color: colors.textSecondary, fontSize: fs.xs }}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Germany state detail modal */}
      <Modal visible={!!selected && mode === 'states'} transparent animationType="none" onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={coatFullscreen ? () => setCoatFullscreen(false) : closeModal}
        />

        {info && !coatFullscreen && (
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              {getQuestionImage(info.coatKey) && (
                <TouchableOpacity onPress={() => setCoatFullscreen(true)} activeOpacity={0.75} style={styles.coatWrapper}>
                  <Image source={getQuestionImage(info.coatKey)!} style={styles.modalCoat} resizeMode="contain" />
                  <View style={styles.expandBadge}><ExpandIcon /></View>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.text, fontSize: fs.lg }]}>
                  {SLUG_TO_NAME[info.slug] ?? info.capital}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: fs.xs }}>seit {info.founded}</Text>
              </View>
              <TouchableOpacity onPress={closeModal} hitSlop={12}>
                <Text style={{ fontSize: 22, color: colors.textSecondary }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <View style={[styles.statsRow, { borderColor: colors.border }]}>
                <StatBox icon="🏛️" label="Hauptstadt" value={info.capital} colors={colors} fs={fs} />
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <StatBox icon="👥" label="Einwohner" value={info.population} colors={colors} fs={fs} />
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <StatBox icon="📐" label="Fläche" value={info.area} colors={colors} fs={fs} />
              </View>
              <Text style={[styles.desc, { color: colors.text, fontSize: fs.sm }]}>{info.description}</Text>
              <InfoBlock icon="💬" title="Motto" value={`„${info.motto}"`} colors={colors} fs={fs} italic />
              <InfoBlock icon="🏭" title="Wirtschaft" value={info.economy} colors={colors} fs={fs} />
              <InfoBlock icon="🏰" title="Sehenswürdigkeiten" value={info.landmark} colors={colors} fs={fs} />
              <TouchableOpacity
                style={[styles.wikiBtn, { borderColor: colors.border }]}
                onPress={() => Linking.openURL(info.wikiDe)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 16 }}>📖</Text>
                <Text style={[styles.wikiText, { color: colors.primary, fontSize: fs.sm }]}>Wikipedia auf Deutsch →</Text>
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={() => { closeModal(); onStartTest(info.slug); }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: fs.md }}>Test starten →</Text>
            </TouchableOpacity>
          </View>
        )}

        {info && coatFullscreen && getQuestionImage(info.coatKey) && (
          <TouchableOpacity style={styles.coatFullscreenBg} activeOpacity={1} onPress={() => setCoatFullscreen(false)}>
            <Image source={getQuestionImage(info.coatKey)!} style={styles.coatFullscreenImage} resizeMode="contain" />
            <Text style={styles.coatFullscreenName}>{SLUG_TO_NAME[info.slug] ?? info.capital}</Text>
            <Text style={styles.coatFullscreenHint}>Tippen zum Schließen</Text>
          </TouchableOpacity>
        )}
      </Modal>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExpandIcon() {
  return (
    <View style={exp.root}>
      <View style={[exp.c, exp.tl]} /><View style={[exp.c, exp.tr]} />
      <View style={[exp.c, exp.bl]} /><View style={[exp.c, exp.br]} />
    </View>
  );
}
const exp = StyleSheet.create({
  root:{width:14,height:14},
  c:{position:'absolute',width:5,height:5,borderColor:'#fff',borderTopWidth:1.5,borderLeftWidth:1.5},
  tl:{top:0,left:0}, tr:{top:0,right:0,borderLeftWidth:0,borderRightWidth:1.5},
  bl:{bottom:0,left:0,borderTopWidth:0,borderBottomWidth:1.5},
  br:{bottom:0,right:0,borderTopWidth:0,borderLeftWidth:0,borderRightWidth:1.5,borderBottomWidth:1.5},
});

function StatBox({ icon, label, value, colors, fs }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={{ color: colors.text, fontSize: fs.xs, fontWeight: '700', textAlign: 'center' }}>{value}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: fs.xs - 1, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

function InfoBlock({ icon, title, value, colors, fs, italic }: any) {
  return (
    <View style={styles.infoBlock}>
      <Text style={[styles.infoBlockTitle, { color: colors.textSecondary, fontSize: fs.xs }]}>{icon}  {title}</Text>
      <Text style={[styles.infoBlockValue, { color: colors.text, fontSize: fs.sm, fontStyle: italic ? 'italic' : 'normal' }]}>{value}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 8, borderRadius: 10, borderWidth: 1,
  },
  modeBtnText: { fontWeight: '600' },
  mapContainer: { borderRadius: 14, overflow: 'hidden' },
  countryToast: {
    marginTop: spacing.sm, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: spacing.sm, borderRadius: 10, borderWidth: 1,
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  modal: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: spacing.md, paddingBottom: 44,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  coatWrapper: { position: 'relative' },
  modalCoat: { width: 56, height: 56 },
  expandBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 20, height: 20,
    borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { fontWeight: '800' },
  statsRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, marginBottom: spacing.md, overflow: 'hidden' },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 3 },
  statDivider: { width: 1 },
  desc: { lineHeight: 20, marginBottom: spacing.md },
  infoBlock: { marginBottom: spacing.sm, gap: 3 },
  infoBlockTitle: { fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  infoBlockValue: { lineHeight: 20 },
  wikiBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderTopWidth: 1, marginTop: spacing.sm, marginBottom: spacing.sm,
  },
  wikiText: { fontWeight: '600' },
  startBtn: { marginTop: spacing.sm, padding: spacing.md, borderRadius: 14, alignItems: 'center' },
  coatFullscreenBg: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center', justifyContent: 'center',
  },
  coatFullscreenImage: { width: SCREEN_W - 64, height: SCREEN_W - 64 },
  coatFullscreenName: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 28, textAlign: 'center' },
  coatFullscreenHint: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8 },
});
