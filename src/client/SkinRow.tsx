/**
 * Skin picker row registered into the General section item slot (the same
 * additive seat the built-in Appearance row occupies): a "Default" tile plus
 * one preview-swatch tile per shipped family. Clicking a tile activates that
 * family (light/dark resolved by the current system preference).
 *
 * No CSS module or component library dependency: this file uses inline
 * styles keyed off the same `--dsw-alias-*` custom properties the active
 * theme already publishes, so this row's own chrome follows whichever theme
 * is active — the same approach every settings row in this ecosystem takes.
 */
import type { CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { SKIN_FAMILIES } from './families/index.ts'
import type { SkinKey } from './locales.ts'
import type { createSkinRowStore } from './settings-store.ts'

/** Injected business face: the one write this row makes. */
export interface SkinRowInjected {
  /** Activate a family by id, or `undefined` to defer back to the built-in appearance. */
  selectFamily: (familyId: string | undefined) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type SkinRowComponentProps = PropsRuntime<'settings.general.item'> &
  PropsStore<ReturnType<typeof createSkinRowStore>> &
  PropsLocale<'settings.dsh-tint-theme'> &
  SkinRowInjected

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '16px 0',
  borderBottom: '1px solid var(--dsw-alias-border-l2)',
}

const titleStyle: CSSProperties = {
  color: 'var(--dsw-alias-label-primary)',
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '22px',
}

const gridStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
}

function tileStyle(selected: boolean): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    width: 88,
    padding: 3,
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    boxShadow: selected ? '0 0 0 2px var(--dsw-alias-brand-primary)' : 'none',
    cursor: 'pointer',
    font: 'inherit',
    boxSizing: 'border-box',
  }
}

const swatchStyle: CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 8,
  boxSizing: 'border-box',
  border: '1px solid var(--dsw-alias-border-l2)',
}

const defaultSwatchStyle: CSSProperties = {
  ...swatchStyle,
  display: 'flex',
  overflow: 'hidden',
}

function labelStyle(selected: boolean): CSSProperties {
  return {
    color: selected ? 'var(--dsw-alias-label-primary)' : 'var(--dsw-alias-label-secondary)',
    fontSize: 12,
    lineHeight: '16px',
  }
}

/**
 * Render the skin row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function SkinRow({ t, selectFamily, useStore }: SkinRowComponentProps) {
  const familyId = useStore((s) => s.familyId)

  return (
    <div style={rowStyle}>
      <div style={titleStyle}>{t('skins.title')}</div>
      <div style={gridStyle}>
        <button type="button" style={tileStyle(familyId === undefined)} onClick={() => selectFamily(undefined)}>
          <div style={defaultSwatchStyle}>
            <div style={{ flex: 1, background: '#f4f4f5' }} />
            <div style={{ flex: 1, background: '#1c1c20' }} />
          </div>
          <span style={labelStyle(familyId === undefined)}>{t('skins.default')}</span>
        </button>
        {SKIN_FAMILIES.map((family) => (
          <button
            key={family.id}
            type="button"
            style={tileStyle(familyId === family.id)}
            aria-pressed={familyId === family.id}
            onClick={() => selectFamily(family.id)}
          >
            <div style={{ ...swatchStyle, background: family.dark.preview }} />
            <span style={labelStyle(familyId === family.id)}>{t(family.nameKey as SkinKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
