import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { lightColors, darkColors, type Colors } from '../theme/colors';
import { fontSizes, type FontSizeKey } from '../theme/typography';

export function useTheme(): { colors: Colors; fs: (typeof fontSizes)[FontSizeKey]; isDark: boolean } {
  const systemScheme = useColorScheme();
  const { theme, fontSize } = useSettingsStore();

  const isDark =
    theme === 'dark' || (theme === 'system' && systemScheme === 'dark');

  return {
    colors: isDark ? darkColors : lightColors,
    fs: fontSizes[fontSize as FontSizeKey],
    isDark,
  };
}
