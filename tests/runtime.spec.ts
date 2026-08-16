import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.ts'

describe('host plugin activation and disposal', () => {
  it('mounts through a real Context and disposes cleanly without a settings provider', async () => {
    const ctx = new Context()
    const fiber = await ctx.plugin(plugin)
    // No settings service is composed on this bare Context, so apply()'s
    // ctx.inject(['settings'], ...) call never fires its callback — the
    // fiber still reaches ACTIVE and disposes cleanly either way (see
    // src/index.ts: the settings registration is optional).
    expect(fiber.uid).not.toBeNull()
    await fiber.dispose()
    // Fiber.uid: "0 for the root fiber, null once disposed" (cordis' own doc
    // comment) — the one public, version-stable signal that dispose really
    // ran and this plugin's fiber (not the root) tore down.
    expect(fiber.uid).toBeNull()
  })
})
