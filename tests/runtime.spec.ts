import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.ts'

describe('host plugin activation and disposal', () => {
  it('mounts through a real Context and disposes cleanly (no-op host body)', async () => {
    const ctx = new Context()
    const fiber = await ctx.plugin(plugin)
    // The host half genuinely does nothing (see src/index.ts) — this test
    // exists to prove the empty apply() still round-trips through the real
    // Loader-shape and Fiber lifecycle without throwing.
    expect(fiber.uid).not.toBeNull()
    await fiber.dispose()
    // Fiber.uid: "0 for the root fiber, null once disposed" (cordis' own doc
    // comment) — the one public, version-stable signal that dispose really
    // ran and this plugin's fiber (not the root) tore down.
    expect(fiber.uid).toBeNull()
  })
})
