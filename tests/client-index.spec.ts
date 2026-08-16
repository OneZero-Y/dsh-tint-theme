import { describe, expect, it, vi } from 'vitest'

// See tests/support/fake-runtime-client.ts: the real `/client` subpath is a
// loader-wrapped browser bundle that cannot run under plain Node.
vi.mock('@deepseek-ai/dsh-client-runtime/client', () => import('./support/fake-runtime-client.ts'))

const clientPlugin = await import('../src/client/index.ts')

/**
 * Same rationale as tests/index.spec.ts, applied to the client half: a
 * hand-built `ctx.plugin({ name, inject, apply })` call cannot catch a
 * stray default export, because the test itself would be supplying
 * `inject` instead of going through the module's real exports.
 */
describe('client module export shape (function form)', () => {
  it('has no default export', () => {
    expect('default' in clientPlugin).toBe(false)
  })

  it('exports the Loader-facing named contract', () => {
    expect(clientPlugin.name).toBe('dsh-tint-theme-client')
    expect(clientPlugin.inject).toEqual(['theme', 'slots', 'locale', 'connection', 'remote', 'settingsScope'])
    expect(typeof clientPlugin.apply).toBe('function')
  })
})
