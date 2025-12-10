# Implementation Plan: Vite Chrome Extension Template

**Branch**: `001-vite-extension-template` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-vite-extension-template/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a production-ready Chrome extension template using Vite, React, and TypeScript that provides developers with a complete starting point for building Manifest V3 extensions. The template includes all major extension contexts (popup, background service worker, content scripts, options page), modern build tooling with hot module replacement, comprehensive TypeScript configuration, and example code demonstrating cross-context communication. The template must comply with all constitution requirements including strict type safety, performance budgets (background <200KB, content <100KB, popup <150KB gzipped), and build time targets (<3s dev, <30s production).

## Technical Context

**Language/Version**: TypeScript 5.0+ with strict mode enabled
**Primary Dependencies**: Vite 5+, React 18+, @types/chrome, TailwindCSS, Vitest, Zod
**Storage**: Chrome Storage API (chrome.storage.sync and chrome.storage.local)
**Testing**: Vitest for unit tests, mock Chrome APIs for integration tests
**Target Platform**: Chromium-based browsers (Chrome, Edge, Brave) with Manifest V3
**Project Type**: Chrome Extension (hybrid - multiple contexts with separate bundles)
**Performance Goals**: Extension load <100ms, content script injection <50ms, dev rebuild <3s, production build <30s, React render <16ms (60fps)
**Constraints**: Bundle sizes (background <200KB, content <100KB, popup <150KB gzipped), memory footprint <50MB total, CSP compliant (no inline scripts/eval), service worker lifecycle (may be terminated after 30s inactivity)
**Scale/Scope**: Template project for developers to bootstrap extensions, ~15-20 source files, 4 extension contexts (popup, background, content, options), complete build configuration

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Type Safety & Code Quality

- ✅ **TypeScript Strict Mode**: tsconfig.json will include `strict: true`
- ✅ **Explicit Return Types**: All template functions will have explicit return types
- ✅ **Type Validation**: Zod will be used for runtime validation at API boundaries
- ✅ **Linting**: ESLint configuration included with zero-error policy
- ✅ **Formatting**: Prettier configuration included
- ✅ **Complexity Limits**: Template code will follow cyclomatic complexity ≤10, file length ≤300 lines
- ✅ **No @ts-ignore**: Zero type suppressions without justification

**Status**: ✅ PASS - All requirements will be met in template

### Principle II: User Experience Consistency

- ✅ **Design System**: Shared component library using TailwindCSS for consistent styling
- ✅ **Accessibility**: All interactive elements will meet WCAG 2.1 Level AA (keyboard nav, ARIA labels)
- ✅ **Visual Consistency**: Design tokens via Tailwind config (colors, spacing, typography)
- ✅ **State Handling**: Loading, error, and empty states demonstrated in example components
- ✅ **Dark/Light Mode**: System preference detection using prefers-color-scheme
- ✅ **i18n Structure**: Text organized for future internationalization (even if single language initially)

**Status**: ✅ PASS - All UX consistency requirements addressed

### Principle III: Performance Requirements (NON-NEGOTIABLE)

- ✅ **Extension Load Time**: <100ms target (minimal initialization in background worker)
- ✅ **Content Script Injection**: <50ms target (lightweight injection, lazy loading)
- ✅ **Memory Footprint**: <50MB total (monitoring via Chrome task manager)
- ✅ **Bundle Sizes**: Background <200KB, content <100KB, popup <150KB (gzipped) - enforced by bundle analyzer
- ✅ **React Render**: <16ms for 60fps (lightweight components, minimal re-renders)
- ✅ **Message Handling**: <200ms from message to UI update
- ✅ **Bundle Analyzer**: Included in build pipeline with size alerts
- ⚠️ **Lighthouse CI**: Will document setup but not enforce in template (developers add per project)
- ✅ **Memory Profiling**: Documentation included for profiling background scripts

**Status**: ✅ PASS - All mandatory metrics targeted, enforcement mechanisms included

### Principle IV: Build & Bundle Optimization

- ✅ **Vite HMR**: Configured for all contexts (popup, options, content scripts)
- ✅ **Code Splitting**: Separate entry points and bundles per context
- ✅ **Tree-Shaking**: Enabled via Vite, side-effects declared in package.json
- ✅ **Dynamic Imports**: Demonstrated for heavy dependencies
- ✅ **Asset Optimization**: Images compressed, SVG inlining for <10KB files
- ✅ **Source Maps**: Dev builds only (excluded from production)
- ✅ **Build Time**: <3s dev, <30s production targets

**Status**: ✅ PASS - All optimization requirements met

### Principle V: Chrome Extension Standards

- ✅ **Manifest V3**: Exclusive use, no V2 compatibility
- ✅ **Service Worker**: Background script implemented as service worker
- ✅ **Least Privilege**: Minimal permissions in manifest
- ✅ **CSP**: Strict CSP with no inline scripts, no eval
- ✅ **Host Permissions**: Properly declared in manifest
- ✅ **Message Passing**: Correct chrome.runtime.sendMessage API usage
- ✅ **Data Migration**: Storage schema versioning pattern demonstrated

**Status**: ✅ PASS - Full Manifest V3 compliance

### Overall Gate Status: ✅ PASS

All five core principles are satisfied with no violations. Template is designed from the ground up to meet constitution requirements. No complexity justifications needed.

### Post-Design Re-evaluation (Phase 1 Complete)

**Date**: 2025-12-10  
**Artifacts Reviewed**: research.md, data-model.md, contracts/message-protocol.md, quickstart.md

**Re-evaluation Results**:

- ✅ **Type Safety**: Zod schemas defined for all messages, settings, and state. TypeScript strict mode enforced throughout.
- ✅ **UX Consistency**: TailwindCSS design system established. Accessibility patterns documented. Dark/light mode support defined.
- ✅ **Performance**: Bundle splitting strategy confirmed. Code splitting by context (background/content/popup/options). Lazy loading patterns defined.
- ✅ **Build Optimization**: Vite configuration documented with HMR for all contexts. Asset optimization strategies defined.
- ✅ **Chrome Standards**: Message protocol follows Manifest V3 patterns. Service worker architecture confirmed. CSP compliance enforced.

**Conclusion**: All constitution gates remain PASS after design phase. Architecture and contracts align with all five core principles. Ready for implementation (Phase 2: Tasks).

## Project Structure

### Documentation (this feature)

```text
specs/001-vite-extension-template/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── message-protocol.md
├── checklists/          # Quality validation checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
vite-chrome-extension/
├── src/
│   ├── background/              # Service worker background script
│   │   ├── index.ts            # Background entry point
│   │   ├── messageHandler.ts   # Cross-context message handling
│   │   └── storageManager.ts   # Chrome storage operations
│   ├── content/                 # Content scripts injected into pages
│   │   ├── index.ts            # Content script entry point
│   │   └── pageModifier.ts     # DOM manipulation examples
│   ├── popup/                   # Popup UI (browser action)
│   │   ├── index.tsx           # Popup entry point
│   │   ├── App.tsx             # Main popup component
│   │   ├── components/         # Reusable UI components
│   │   └── hooks/              # Custom React hooks
│   ├── options/                 # Options/settings page
│   │   ├── index.tsx           # Options entry point
│   │   ├── OptionsApp.tsx      # Main options component
│   │   └── components/         # Settings-specific components
│   ├── shared/                  # Shared code across contexts
│   │   ├── types/              # TypeScript type definitions
│   │   ├── constants.ts        # Shared constants
│   │   ├── messageTypes.ts     # Message protocol definitions
│   │   └── storage/            # Storage schema and helpers
│   └── assets/                  # Static assets
│       ├── icons/              # Extension icons (16, 48, 128)
│       └── styles/             # Global styles
├── public/                      # Static files copied to dist
│   └── manifest.json           # Chrome extension manifest
├── tests/
│   ├── unit/                   # Unit tests for pure functions
│   │   ├── storage.test.ts
│   │   └── messageHandler.test.ts
│   ├── integration/            # Integration tests for Chrome APIs
│   │   ├── messaging.test.ts
│   │   └── storage.test.ts
│   └── setup/                  # Test configuration
│       └── chromeApiMocks.ts   # Mock Chrome APIs
├── dist/                        # Build output (gitignored)
│   ├── background/
│   ├── content/
│   ├── popup/
│   ├── options/
│   └── manifest.json
├── .vscode/                     # VS Code settings
│   ├── settings.json
│   └── extensions.json
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── vitest.config.ts            # Vitest test configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Setup and usage documentation
```

**Structure Decision**: Chrome Extension multi-context architecture selected. Each extension context (background, content, popup, options) has a dedicated entry point and directory structure. Shared code is centralized in `/src/shared/` to avoid duplication. Build system produces separate optimized bundles for each context, enabling code splitting and minimizing unnecessary code loading. This structure aligns with Vite's multi-page app pattern and satisfies the constitution's bundle size requirements.

## Complexity Tracking

No complexity violations - constitution check passed all gates.
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
