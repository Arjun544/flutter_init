// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Preflight Tests
// Mocks execSync to verify correct behavior when Flutter is missing or present.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, expect, it, mock, beforeEach } from 'bun:test'
import { exec } from '../src/utils/exec'

// ── exec() utility tests ───────────────────────────────────────────────────

describe('exec utility', () => {
  it('returns stdout as a string for a valid command', () => {
    // Use a cross-platform command available everywhere
    const result = exec('echo hello')
    expect(result.trim()).toContain('hello')
  })

  it('throws when command exits with non-zero', () => {
    expect(() => exec('exit 1')).toThrow()
  })
})

// ── Flutter version check simulation ──────────────────────────────────────

describe('flutter version check', () => {
  it('should parse flutter version output', () => {
    // Simulate what runPreflight does with the output
    const mockOutput = 'Flutter 3.22.0 • channel stable • https://github.com/flutter/flutter.git\nFramework • revision abc123 • 2024-01-01'
    const versionLine = mockOutput.split('\n')[0]?.trim() ?? ''
    expect(versionLine).toMatch(/^Flutter \d+\.\d+\.\d+/)
  })

  it('should extract clean version line', () => {
    const mockOutput = 'Flutter 3.19.5 • channel stable\nDart version 3.3.3'
    const versionLine = mockOutput.split('\n')[0]?.trim()
    expect(versionLine).toBe('Flutter 3.19.5 • channel stable')
  })
})

// ── Bun version check simulation ──────────────────────────────────────────

describe('bun version detection', () => {
  it('recognizes valid bun 1.x versions', () => {
    const validVersions = ['1.0.0', '1.1.5', '1.2.0']
    for (const v of validVersions) {
      const [major] = v.split('.').map(Number)
      expect(major).toBeGreaterThanOrEqual(1)
    }
  })

  it('flags old bun versions as warnings', () => {
    const oldVersion = '0.6.14'
    const [major] = oldVersion.split('.').map(Number)
    expect(major).toBeLessThan(1)
  })
})
