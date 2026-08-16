import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.ts'

/**
 * Per dsh-forge-verify (in the dsh-plugin-kit submodule): a hand-built
 * `ctx.plugin({ name, inject, apply })` call cannot catch a stray default
 * export, because the test itself supplies `inject` instead of going
 * through the module's real exports. This asserts the shape directly.
 */
describe('host module export shape (function form)', () => {
  it('has no default export', () => {
    expect('default' in plugin).toBe(false)
  })

  it('exports the Loader-facing named contract', () => {
    expect(plugin.name).toBe('dsh-tint-theme')
    expect(plugin.inject).toEqual([])
    expect(typeof plugin.apply).toBe('function')
  })
})
