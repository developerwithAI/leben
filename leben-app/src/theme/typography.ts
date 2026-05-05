export const fontSizes = {
  small: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
  },
  medium: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  large: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 21,
    xl: 25,
    xxl: 32,
  },
} as const;

export type FontSizeKey = keyof typeof fontSizes;
