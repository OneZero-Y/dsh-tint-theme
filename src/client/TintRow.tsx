/**
 * Tint-theme preference row registered into the General section item slot
 * (`settings.general.item`, the same additive seat the installed
 * `dsh-client-ui-theme`/`dsh-client-locale` packages' own Appearance/Language
 * rows occupy — see the contract reference's client-half section: "a
 * feature owns its own settings surface"). Two independent controls: which
 * of this plugin's own registered themes is active (or "off", deferring to
 * whatever else last set the theme), and which accent tint overlay is
 * applied — matching the design record's "one row with two controls" choice.
 *
 * No CSS module or component library dependency: this file uses inline
 * styles keyed off the same `--dsw-alias-*` custom properties the active
 * theme already publishes (so the row's own chrome — borders, text color —
 * follows whatever theme is active, exactly like the rest of the settings
 * panel), rather than pulling in a build step or a third-party design
 * system this plugin has no license to depend on visually.
 */
import type { CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { ACCENT_SWATCHES } from './accents.ts'
import { TINT_THEME_DARK_ID, TINT_THEME_LIGHT_ID } from './palette.ts'
import type { createTintRowStore } from './settings-store.ts'

/** Injected business face: the two preference writes (t rides the standard locale seat). */
export interface TintRowInjected {
  /** Switch which of this plugin's registered themes is active, or clear it. */
  setPalette: (choice: 'off' | 'light' | 'dark') => void
  /** Switch the accent tint overlay, or clear it. */
  setAccent: (choice: string | 'none') => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type TintRowComponentProps = PropsRuntime<'settings.general.item'> &
  PropsStore<ReturnType<typeof createTintRowStore>> &
  PropsLocale<'settings.tint-theme'> &
  TintRowInjected

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: '16px 0',
  borderBottom: '1px solid var(--dsw-alias-border-l2)',
}

const titleStyle: CSSProperties = {
  color: 'var(--dsw-alias-label-primary)',
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '22px',
}

const groupStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
}

function optionStyle(selected: boolean): CSSProperties {
  return {
    boxSizing: 'border-box',
    border: `1px solid ${selected ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'}`,
    color: 'var(--dsw-alias-label-primary)',
    background: selected ? 'var(--dsw-alias-bg-module-platform)' : 'transparent',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    lineHeight: '20px',
    cursor: 'pointer',
  }
}

function swatchStyle(color: string, selected: boolean): CSSProperties {
  return {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: color,
    border: selected ? '2px solid var(--dsw-alias-label-primary)' : '1px solid var(--dsw-alias-border-l2)',
    cursor: 'pointer',
    padding: 0,
  }
}

/**
 * Render the tint-theme row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function TintRow({ t, setPalette, setAccent, useStore }: TintRowComponentProps) {
  const themeId = useStore((s) => s.themeId)
  const accent = useStore((s) => s.accent)

  const paletteChoice: 'off' | 'light' | 'dark' =
    themeId === TINT_THEME_LIGHT_ID ? 'light' : themeId === TINT_THEME_DARK_ID ? 'dark' : 'off'

  return (
    <div style={rowStyle}>
      <div>
        <div style={titleStyle}>{t('palette.title')}</div>
        <div style={groupStyle}>
          {(['off', 'light', 'dark'] as const).map((choice) => (
            <button
              key={choice}
              type="button"
              style={optionStyle(paletteChoice === choice)}
              aria-pressed={paletteChoice === choice}
              onClick={() => setPalette(choice)}
            >
              {t(`palette.${choice}`)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={titleStyle}>{t('accent.title')}</div>
        <div style={groupStyle}>
          <button
            type="button"
            style={{
              ...optionStyle(accent === undefined),
              borderRadius: '50%',
              width: 24,
              height: 24,
              padding: 0,
            }}
            aria-pressed={accent === undefined}
            aria-label={t('accent.none')}
            onClick={() => setAccent('none')}
          />
          {ACCENT_SWATCHES.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              style={swatchStyle(swatch.color, accent === swatch.id)}
              aria-pressed={accent === swatch.id}
              aria-label={swatch.id}
              onClick={() => setAccent(swatch.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
