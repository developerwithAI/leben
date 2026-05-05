// Static image map — React Native requires static require() calls
// Keys match the imageKey field in question JSON files

const imageMap: Record<string, ReturnType<typeof require>> = {
  // General
  q021: require('../../assets/images/coats/q021.png'),
  q055: require('../../assets/images/coats/q055.png'),   // Q55  Reichstag
  q070: require('../../assets/images/coats/q070.png'),   // Q70  Heinemann/Schmidt
  q130: require('../../assets/images/coats/q130.png'),   // Q130 Stimmzettel
  q176: require('../../assets/images/coats/q176.png'),   // Q176 Besatzungszonen
  q181: require('../../assets/images/coats/q181.png'),   // Q181 Willy Brandt Kniefall
  q187: require('../../assets/images/coats/q187.png'),   // Q187 DDR-Flagge
  q209: require('../../assets/images/coats/q209.png'),
  q216: require('../../assets/images/coats/q216.png'),   // Q216 Bundesadler Plenarsaal
  q226: require('../../assets/images/coats/q226.png'),
  q235: require('../../assets/images/coats/q235.png'),   // Q235 Mitterrand+Kohl Verdun
  // State coats of arms (Q1)
  baden_wuttemberg_001: require('../../assets/images/coats/baden_wuttemberg_001.png'),
  bayern_001: require('../../assets/images/coats/bayern_001.png'),
  berlin_001: require('../../assets/images/coats/berlin_001.png'),
  brandenburg_001: require('../../assets/images/coats/brandenburg_001.png'),
  bremen_001: require('../../assets/images/coats/bremen_001.png'),
  hamburg_001: require('../../assets/images/coats/hamburg_001.png'),
  hessen_001: require('../../assets/images/coats/hessen_001.png'),
  mecklenburg_vorpommern_001: require('../../assets/images/coats/mecklenburg_vorpommern_001.png'),
  niedersachsen_001: require('../../assets/images/coats/niedersachsen_001.png'),
  nordrhein_westfalen_001: require('../../assets/images/coats/nordrhein_westfalen_001.png'),
  rheinland_pfalz_001: require('../../assets/images/coats/rheinland_pfalz_001.png'),
  saarland_001: require('../../assets/images/coats/saarland_001.png'),
  sachsen_001: require('../../assets/images/coats/sachsen_001.png'),
  sachsen_anhalt_001: require('../../assets/images/coats/sachsen_anhalt_001.png'),
  schleswig_holstein_001: require('../../assets/images/coats/schleswig_holstein_001.png'),
  thueringen_001: require('../../assets/images/coats/thueringen_001.png'),
  // State maps (Q8)
  baden_wuttemberg_008: require('../../assets/images/coats/baden_wuttemberg_008.png'),
  bayern_008: require('../../assets/images/coats/bayern_008.png'),
  berlin_008: require('../../assets/images/coats/berlin_008.png'),
  brandenburg_008: require('../../assets/images/coats/brandenburg_008.png'),
  bremen_008: require('../../assets/images/coats/bremen_008.png'),
  hamburg_008: require('../../assets/images/coats/hamburg_008.png'),
  hessen_008: require('../../assets/images/coats/hessen_008.png'),
  mecklenburg_vorpommern_008: require('../../assets/images/coats/mecklenburg_vorpommern_008.png'),
  niedersachsen_008: require('../../assets/images/coats/niedersachsen_008.png'),
  nordrhein_westfalen_008: require('../../assets/images/coats/nordrhein_westfalen_008.png'),
  rheinland_pfalz_008: require('../../assets/images/coats/rheinland_pfalz_008.png'),
  saarland_008: require('../../assets/images/coats/saarland_008.png'),
  sachsen_008: require('../../assets/images/coats/sachsen_008.png'),
  sachsen_anhalt_008: require('../../assets/images/coats/sachsen_anhalt_008.png'),
  schleswig_holstein_008: require('../../assets/images/coats/schleswig_holstein_008.png'),
  thueringen_008: require('../../assets/images/coats/thueringen_008.png'),
  // Großes Landeswappen
  'baden-wuerttemberg_wappen': require('../../assets/images/wappen/baden-wuerttemberg_wappen.png'),
  'bayern_wappen': require('../../assets/images/wappen/bayern_wappen.png'),
  'berlin_wappen': require('../../assets/images/wappen/berlin_wappen.png'),
  'brandenburg_wappen': require('../../assets/images/wappen/brandenburg_wappen.png'),
  'bremen_wappen': require('../../assets/images/wappen/bremen_wappen.png'),
  'hamburg_wappen': require('../../assets/images/wappen/hamburg_wappen.png'),
  'hessen_wappen': require('../../assets/images/wappen/hessen_wappen.png'),
  'mecklenburg-vorpommern_wappen': require('../../assets/images/wappen/mecklenburg-vorpommern_wappen.png'),
  'niedersachsen_wappen': require('../../assets/images/wappen/niedersachsen_wappen.png'),
  'nordrhein-westfalen_wappen': require('../../assets/images/wappen/nordrhein-westfalen_wappen.png'),
  'rheinland-pfalz_wappen': require('../../assets/images/wappen/rheinland-pfalz_wappen.png'),
  'saarland_wappen': require('../../assets/images/wappen/saarland_wappen.png'),
  'sachsen_wappen': require('../../assets/images/wappen/sachsen_wappen.png'),
  'sachsen-anhalt_wappen': require('../../assets/images/wappen/sachsen-anhalt_wappen.png'),
  'schleswig-holstein_wappen': require('../../assets/images/wappen/schleswig-holstein_wappen.png'),
  'thueringen_wappen': require('../../assets/images/wappen/thueringen_wappen.png'),
};

export function getQuestionImage(imageKey: string): ReturnType<typeof require> | null {
  return imageMap[imageKey] ?? null;
}
