// ─────────────────────────────────────────────────────────────────────────────
// FlutterInit CLI — Generator Unit Tests
// Tests the fs utilities and template rendering logic independently.
// Integration tests (actual flutter create) require Flutter installed.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, expect, it, beforeAll, afterAll } from 'bun:test'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { writeFile, createGitkeep, removeDir, isDirNonEmpty, copyDir } from '../src/utils/fs'
import { renderTemplate, buildTemplateContext } from '../src/templates'
import type { FlutterInitConfig } from '../src/config'

// ── Test fixture config ────────────────────────────────────────────────────

const FIXTURE_CONFIG: FlutterInitConfig = {
  projectName: 'test_app',
  orgName: 'com.example',
  description: 'Test project',
  architecture: 'clean',
  stateManager: 'riverpod',
  backend: 'firebase',
  navigation: 'gorouter',
  themeMode: 'both',
  primaryColor: '#027DFD',
  outputDir: path.join(os.tmpdir(), 'flutterinit_test_output'),

  // Icons
  usesIconsaxPlus: true,
  usesFlutterRemix: false,
  usesHugeicons: false,

  // Networking
  usesDio: true,
  usesHttp: false,
  usesCachedNetworkImage: true,

  // Persistence
  usesHive: false,
  usesSharedPreferences: true,
  usesSecureStorage: true,

  // Media & Assets
  usesFlutterSvg: true,
  usesImagePicker: true,
  usesFilePicker: true,
  usesFlutterNativeSplash: true,

  // Essential Utilities
  usesUrlLauncher: true,
  usesPathProvider: true,
  usesSharePlus: true,
  usesPermissionHandler: true,
  usesGeolocator: true,
  useLocalization: true,

  // Device & System
  usesDeviceInfoPlus: true,
  usesAppVersionUpdate: true,

  // Advanced Features
  usesFlutterHooks: false,
  usesSkeletonizer: true,
  usesScreenutil: true,
  usesDotenv: true,
  usesLogger: true,
  useMaterial3: true,
}

// ── FS utility tests ───────────────────────────────────────────────────────

describe('FS utilities', () => {
  const tmpDir = path.join(os.tmpdir(), 'flutterinit_fs_test_' + Date.now())

  afterAll(() => removeDir(tmpDir))

  it('writeFile creates file and parent directories', () => {
    const filePath = path.join(tmpDir, 'nested', 'dir', 'test.txt')
    writeFile(filePath, 'hello world')
    expect(fs.existsSync(filePath)).toBe(true)
    expect(fs.readFileSync(filePath, 'utf-8')).toBe('hello world')
  })

  it('createGitkeep creates dir with .gitkeep', () => {
    const dirPath = path.join(tmpDir, 'gitkeep_test')
    createGitkeep(dirPath)
    expect(fs.existsSync(path.join(dirPath, '.gitkeep'))).toBe(true)
  })

  it('isDirNonEmpty returns false for non-existent dir', () => {
    expect(isDirNonEmpty(path.join(tmpDir, 'does_not_exist'))).toBe(false)
  })

  it('isDirNonEmpty returns true for non-empty dir', () => {
    const nonEmpty = path.join(tmpDir, 'non_empty')
    fs.mkdirSync(nonEmpty, { recursive: true })
    fs.writeFileSync(path.join(nonEmpty, 'file.txt'), 'data')
    expect(isDirNonEmpty(nonEmpty)).toBe(true)
  })

  it('isDirNonEmpty returns false for empty dir', () => {
    const emptyDir = path.join(tmpDir, 'empty')
    fs.mkdirSync(emptyDir, { recursive: true })
    expect(isDirNonEmpty(emptyDir)).toBe(false)
  })

  it('removeDir silently handles non-existent dirs', () => {
    expect(() => removeDir(path.join(tmpDir, 'non_existent'))).not.toThrow()
  })

  it('removeDir removes existing directory', () => {
    const toRemove = path.join(tmpDir, 'to_remove')
    fs.mkdirSync(toRemove, { recursive: true })
    fs.writeFileSync(path.join(toRemove, 'file.txt'), 'data')
    removeDir(toRemove)
    expect(fs.existsSync(toRemove)).toBe(false)
  })

  it('copyDir copies files and subdirectories', () => {
    const src = path.join(tmpDir, 'copy_src')
    const dest = path.join(tmpDir, 'copy_dest')
    fs.mkdirSync(path.join(src, 'subdir'), { recursive: true })
    fs.writeFileSync(path.join(src, 'file.txt'), 'hello')
    fs.writeFileSync(path.join(src, 'subdir', 'nested.txt'), 'nested')
    copyDir(src, dest)
    expect(fs.existsSync(path.join(dest, 'file.txt'))).toBe(true)
    expect(fs.existsSync(path.join(dest, 'subdir', 'nested.txt'))).toBe(true)
  })
})

// ── Template context tests ─────────────────────────────────────────────────

describe('Template context', () => {
  it('spreads all config fields onto context', () => {
    const ctx = buildTemplateContext(FIXTURE_CONFIG)
    expect(ctx.projectName).toBe('test_app')
    expect(ctx.primaryColor).toBe('#027DFD')
    expect(ctx.useMaterial3).toBe(true)
    expect(ctx.useLocalization).toBe(true)
  })

  it('has no undefined derived booleans', () => {
    const ctx = buildTemplateContext(FIXTURE_CONFIG)
    const boolFields = [
      'isRiverpod', 'isBloc', 'isProvider', 'isMobX', 'isGetX',
      'isCleanArch', 'isMvvm', 'isFeatureFirst', 'isMvc', 'isLayerFirst',
      'hasFirebase', 'hasSupabase', 'hasAppwrite', 'hasBackend',
      'hasGoRouter', 'hasAutoRoute', 'hasNavigation',
      'hasDarkMode', 'hasLightMode', 'hasBothModes',
    ]
    for (const field of boolFields) {
      expect(ctx[field as keyof typeof ctx]).not.toBeUndefined()
    }
  })
})

// ── Template rendering tests ───────────────────────────────────────────────

describe('Template rendering', () => {
  it('renders pubspec.yaml.hbs without throwing', () => {
    expect(() =>
      renderTemplate('base/pubspec.yaml.hbs', FIXTURE_CONFIG)
    ).not.toThrow()
  })

  it('rendered pubspec contains project name', () => {
    const output = renderTemplate('base/pubspec.yaml.hbs', FIXTURE_CONFIG)
    expect(output).toContain('test_app')
  })

  it('renders main.dart.hbs without throwing', () => {
    expect(() =>
      renderTemplate('base/lib/main.dart.hbs', FIXTURE_CONFIG)
    ).not.toThrow()
  })

  it('renders AGENTS.md.hbs without throwing', () => {
    expect(() =>
      renderTemplate('base/AGENTS.md.hbs', FIXTURE_CONFIG)
    ).not.toThrow()
  })

  it('renders DESIGN.md.hbs without throwing', () => {
    expect(() =>
      renderTemplate('base/DESIGN.md.hbs', FIXTURE_CONFIG)
    ).not.toThrow()
  })

  it('does not throw for all 5 architecture configs', () => {
    const architectures = ['clean', 'mvvm', 'feature-first', 'mvc', 'layer-first'] as const
    for (const arch of architectures) {
      expect(() =>
        renderTemplate('base/pubspec.yaml.hbs', { ...FIXTURE_CONFIG, architecture: arch })
      ).not.toThrow()
    }
  })

  it('does not throw for all 5 state managers', () => {
    const managers = ['riverpod', 'bloc', 'provider', 'mobx', 'getx'] as const
    for (const sm of managers) {
      expect(() =>
        renderTemplate('base/lib/main.dart.hbs', { ...FIXTURE_CONFIG, stateManager: sm })
      ).not.toThrow()
    }
  })
})
