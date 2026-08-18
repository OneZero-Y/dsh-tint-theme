import { Context } from '@deepseek-ai/cordis'
import { SettingsProvider, settingsNamespace } from '@deepseek-ai/dsh-settings'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.ts'
import { SKIN_SETTINGS_NAMESPACE } from '../src/skin-settings.ts'

/** Minimal in-memory settings provider, mirroring the official test doubles' shape. */
class MemorySettingsProvider extends SettingsProvider {
  readonly writable = true
  private doc: Record<string, unknown> = {}
  protected load(): Promise<Record<string, unknown>> {
    return Promise.resolve(this.doc)
  }
  protected persist(ns: SettingsNamespace, section: Record<string, unknown>): Promise<void> {
    this.doc = { ...this.doc, [ns]: structuredClone(section) }
    return Promise.resolve()
  }
}

describe('host plugin activation and disposal', () => {
  it('mounts through a real Context and disposes cleanly (no settings service composed)', async () => {
    const ctx = new Context()
    const fiber = await ctx.plugin(plugin)
    // Without a settings service composed, this plugin's `ctx.inject(['settings'], ...)`
    // callback never runs — this test proves apply() still round-trips
    // through the real Loader-shape and Fiber lifecycle without throwing.
    expect(fiber.uid).not.toBeNull()
    await fiber.dispose()
    // Fiber.uid: "0 for the root fiber, null once disposed" (cordis' own doc
    // comment) — the one public, version-stable signal that dispose really
    // ran and this plugin's fiber (not the root) tore down.
    expect(fiber.uid).toBeNull()
  })

  it('registers its own settings namespace when a settings service is composed', async () => {
    const ctx = new Context()
    await ctx.plugin(MemorySettingsProvider)
    await ctx.plugin(plugin)
    const descriptor = ctx.settings.describe().find((entry) => entry.ns === settingsNamespace(SKIN_SETTINGS_NAMESPACE))
    expect(descriptor).toBeDefined()
  })
})
