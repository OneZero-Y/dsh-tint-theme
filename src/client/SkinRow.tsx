/**
 * Skin picker page, registered as its own `settings.section` nav entry (a
 * peer of Models/Agent Presets/Plugins — not a row inside General): a
 * "Default" tile plus one preview-swatch tile per shipped family. Clicking a
 * tile activates that family (light/dark resolved by the current system
 * preference). 25+ skins read poorly as one more row squeezed into General;
 * a dedicated page gives the grid room and matches how every other
 * multi-item settings surface in this ecosystem (Models, Agent Presets,
 * Plugins) is organized.
 *
 * No CSS module or component library dependency: this file uses inline
 * styles keyed off the same `--dsw-alias-*` custom properties the active
 * theme already publishes, so this page's own chrome follows whichever
 * theme is active — the same approach every settings row in this ecosystem
 * takes.
 */
import type { CSSProperties } from 'react'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import { SKIN_FAMILIES } from './families/index.ts'
import type { SkinKey } from './locales.ts'
import type { createSkinRowStore } from './settings-store.ts'

/** Injected business face: the one write this page makes. */
export interface SkinRowInjected {
  /** Activate a family by id, or `undefined` to defer back to the built-in appearance. */
  selectFamily: (familyId: string | undefined) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type SkinRowComponentProps = PropsRuntime<'settings.section'> &
  PropsStore<ReturnType<typeof createSkinRowStore>> &
  PropsLocale<'settings.dsh-tint-theme'> &
  SkinRowInjected

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 760,
  color: 'var(--dsw-alias-label-primary)',
}

const headingStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
}

const introStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'var(--dsw-alias-label-tertiary)',
}

const gridStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginTop: 4,
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
 * Render the skin picker page.
 * @param props - composed slot props.
 * @returns the page element tree.
 */
export function SkinRow({ t, selectFamily, useStore }: SkinRowComponentProps) {
  const familyId = useStore((s) => s.familyId)

  return (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>{t('skins.title')}</h2>
      <p style={introStyle}>{t('skins.intro')}</p>
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
