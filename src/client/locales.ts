/** `settings.tint-theme` namespace dictionaries (this plugin's settings row copy). */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'palette.title': '色调主题',
  'palette.off': '关闭',
  'palette.light': '浅色',
  'palette.dark': '深色',
  'accent.title': '强调色',
  'accent.none': '无',
}

/** The settings.tint-theme namespace key union. */
export type TintThemeKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en: Record<TintThemeKey, string> = {
  'palette.title': 'Tint Theme',
  'palette.off': 'Off',
  'palette.light': 'Light',
  'palette.dark': 'Dark',
  'accent.title': 'Accent tint',
  'accent.none': 'None',
}
