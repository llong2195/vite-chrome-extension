# Tasks: Vite Chrome Extension Template

**Feature**: 001-vite-extension-template  
**Branch**: `001-vite-extension-template`  
**Input**: Design documents from `/specs/001-vite-extension-template/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/message-protocol.md

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure that ALL user stories depend on

- [x] T001 Initialize Node.js project with package.json (name, version, type: module)
- [x] T002 [P] Create root directory structure (src/, public/, tests/, dist/)
- [x] T003 [P] Create shared types directory in src/shared/types/
- [x] T004 Install core dependencies: typescript@5+, vite@5+, @types/node, @types/chrome
- [x] T005 [P] Create tsconfig.json with strict mode enabled and path aliases
- [x] T006 [P] Create .gitignore (node_modules/, dist/, .DS_Store, \*.log)
- [x] T007 [P] Create README.md with project overview and placeholder sections
- [x] T008 Install React dependencies: react@18+, react-dom@18+, @types/react, @types/react-dom
- [x] T009 [P] Install TailwindCSS: tailwindcss, postcss, autoprefixer
- [x] T010 [P] Create tailwind.config.js with content paths for all contexts
- [x] T011 [P] Create postcss.config.js with tailwindcss and autoprefixer plugins
- [x] T012 Install Zod for runtime validation: zod@3+
- [x] T013 [P] Install ESLint: eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin
- [x] T014 [P] Install ESLint React plugins: eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y
- [x] T015 [P] Create .eslintrc.json with TypeScript and React rules
- [x] T016 [P] Install Prettier: prettier, eslint-config-prettier
- [x] T017 [P] Create .prettierrc with formatting rules
- [x] T018 Install Vitest: vitest, @vitest/ui, happy-dom (for DOM testing)
- [x] T019 [P] Create vitest.config.ts with test environment configuration
- [x] T020 [P] Create VS Code settings in .vscode/settings.json (formatOnSave, linting)
- [x] T021 [P] Create VS Code extensions.json recommending TypeScript, ESLint, Prettier, Tailwind CSS IntelliSense

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T022 Create public/manifest.json with Manifest V3 schema, basic metadata, and permissions
- [x] T023 [P] Create extension icons (16x16, 48x48, 128x128) in src/assets/icons/
- [x] T024 [P] Define base Message type in src/shared/types/messages.ts
- [x] T025 [P] Define Settings schema with Zod in src/shared/types/settings.ts
- [x] T026 [P] Define State schema with Zod in src/shared/types/state.ts
- [x] T027 Create shared constants in src/shared/constants.ts (storage keys, timeouts, defaults)
- [x] T028 [P] Create storage helper functions in src/shared/storage/storageHelpers.ts
- [x] T029 [P] Create message validation utilities in src/shared/utils/messageValidator.ts
- [x] T030 Configure Vite with multi-entry build in vite.config.ts (background, content, popup, options entries)
- [ ] T031 Add Vite plugin for Chrome extension (CRXJS or manual manifest handling)
- [x] T032 Configure build output structure in vite.config.ts (separate bundles per context)
- [x] T033 [P] Add rollup-plugin-visualizer for bundle size analysis
- [x] T034 Create global styles in src/assets/styles/global.css with Tailwind directives
- [x] T035 [P] Create test setup in tests/setup/chromeApiMocks.ts with Chrome API mocks
- [x] T036 Add npm scripts in package.json: dev, build, test, lint, format, type-check
- [ ] T037 [P] Create .env.example for environment variables (if needed)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Initialize New Extension Project (Priority: P1) 🎯 MVP

**Goal**: Developer can run dev build, load extension in Chrome, see popup, and experience hot reload

**Independent Test**: Run `npm run dev`, load dist/ in Chrome, click extension icon → popup opens

### Implementation for User Story 1

- [x] T038 [P] [US1] Create background entry point in src/background/index.ts with service worker registration
- [x] T039 [P] [US1] Create popup entry point in src/popup/index.tsx with React root mounting
- [x] T040 [P] [US1] Create popup HTML template (if needed) or configure Vite to inject script
- [x] T041 [US1] Create main popup App component in src/popup/App.tsx with basic layout
- [x] T042 [P] [US1] Import global styles in popup entry point
- [x] T043 [P] [US1] Create basic UI component in src/popup/components/Button.tsx
- [x] T044 [P] [US1] Create basic UI component in src/popup/components/Card.tsx
- [x] T045 [US1] Add theme toggle functionality in popup App.tsx (reads system preference)
- [x] T046 [US1] Configure manifest.json action field for popup (default_popup, icons)
- [ ] T047 [US1] Test background service worker initializes without errors in chrome://extensions/
- [ ] T048 [US1] Test popup opens when clicking extension icon
- [ ] T049 [US1] Verify hot reload works by making a change to popup and seeing update <3s
- [x] T050 [P] [US1] Add console.log in background worker confirming initialization
- [x] T051 [P] [US1] Add version display in popup UI reading from manifest
- [ ] T052 [US1] Update README.md with setup instructions and dev command usage
- [ ] T053 [US1] Create quickstart section in README.md based on quickstart.md

**Checkpoint**: User Story 1 complete - MVP functional (developer can start building)

---

## Phase 4: User Story 2 - Interact with Web Pages (Priority: P2)

**Goal**: Content scripts inject into pages, can read/modify DOM, and communicate with background

**Independent Test**: Visit any webpage → content script logs to console, can send message to background

### Implementation for User Story 2

- [ ] T054 [P] [US2] Create content script entry point in src/content/index.ts
- [ ] T055 [P] [US2] Create DOM utility functions in src/content/pageModifier.ts
- [ ] T056 [US2] Configure manifest.json content_scripts with matches pattern (e.g., <all_urls>)
- [ ] T057 [US2] Set content script run_at: "document_idle" in manifest
- [ ] T058 [P] [US2] Add console.log in content script confirming injection
- [ ] T059 [P] [US2] Implement example DOM manipulation (e.g., add border to page, insert element)
- [ ] T060 [US2] Implement message sending from content script to background in src/content/index.ts
- [ ] T061 [US2] Implement message handler in background for content script messages
- [ ] T062 [P] [US2] Add TAB_DATA message type in src/shared/types/messages.ts
- [ ] T063 [US2] Test content script injects on webpage navigation
- [ ] T064 [US2] Test content script can send message and receive response from background
- [ ] T065 [US2] Test multiple tabs have independent content script instances
- [ ] T066 [P] [US2] Add error handling for content script injection failures
- [ ] T067 [P] [US2] Create integration test in tests/integration/messaging.test.ts for content-background messages
- [ ] T068 [US2] Document content script usage in README.md

**Checkpoint**: User Story 2 complete - content scripts working with message passing

---

## Phase 5: User Story 3 - Persist Background Tasks (Priority: P3)

**Goal**: Background service worker handles events, manages state, persists data, coordinates contexts

**Independent Test**: Trigger events (tab updates, storage changes) → background responds correctly

### Implementation for User Story 3

- [ ] T069 [P] [US3] Create message handler module in src/background/messageHandler.ts
- [ ] T070 [P] [US3] Create storage manager module in src/background/storageManager.ts
- [ ] T071 [US3] Implement chrome.runtime.onInstalled listener in background
- [ ] T072 [US3] Implement chrome.runtime.onMessage listener with message validation
- [ ] T073 [P] [US3] Implement GET_SETTINGS message handler
- [ ] T074 [P] [US3] Implement UPDATE_SETTINGS message handler
- [ ] T075 [P] [US3] Implement GET_STATE message handler
- [ ] T076 [P] [US3] Implement UPDATE_STATE message handler
- [ ] T077 [US3] Add settings persistence to chrome.storage.sync in storageManager
- [ ] T078 [US3] Add state persistence to chrome.storage.local in storageManager
- [ ] T079 [P] [US3] Implement storage migration logic for schema versioning
- [ ] T080 [P] [US3] Add chrome.storage.onChanged listener to sync state across contexts
- [ ] T081 [US3] Test service worker initializes on browser start
- [ ] T082 [US3] Test service worker receives and responds to messages from popup
- [ ] T083 [US3] Test data persists across browser restarts
- [ ] T084 [P] [US3] Add chrome.alarms example (optional periodic task demo)
- [ ] T085 [P] [US3] Create unit tests in tests/unit/messageHandler.test.ts
- [ ] T086 [P] [US3] Create unit tests in tests/unit/storage.test.ts
- [ ] T087 [US3] Document background worker patterns in README.md
- [ ] T088 [US3] Update popup to read settings from background on mount
- [ ] T089 [US3] Add loading state in popup while fetching settings

**Checkpoint**: User Story 3 complete - background functionality with persistence

---

## Phase 6: User Story 4 - Configure Extension Settings (Priority: P4)

**Goal**: Options page allows users to configure settings, changes persist and apply to all contexts

**Independent Test**: Right-click extension icon → Options → change settings → verify persistence

### Implementation for User Story 4

- [ ] T090 [P] [US4] Create options entry point in src/options/index.tsx with React root
- [ ] T091 [P] [US4] Create options HTML template or configure Vite to generate
- [ ] T092 [P] [US4] Create main OptionsApp component in src/options/OptionsApp.tsx
- [ ] T093 [P] [US4] Create settings form components in src/options/components/SettingsForm.tsx
- [ ] T094 [P] [US4] Create theme selector component in src/options/components/ThemeSelector.tsx
- [ ] T095 [P] [US4] Create notification toggle component in src/options/components/NotificationToggle.tsx
- [ ] T096 [US4] Configure manifest.json options_page field pointing to options.html
- [ ] T097 [US4] Implement settings fetch on options page mount
- [ ] T098 [US4] Implement settings save handler in options page
- [ ] T099 [US4] Add form validation for settings inputs
- [ ] T100 [P] [US4] Add success/error toast notifications after save
- [ ] T101 [P] [US4] Create custom React hook in src/options/hooks/useSettings.ts
- [ ] T102 [US4] Test options page opens from right-click menu
- [ ] T103 [US4] Test settings changes persist after save
- [ ] T104 [US4] Test popup reflects settings changes immediately
- [ ] T105 [P] [US4] Add settings reset button to restore defaults
- [ ] T106 [P] [US4] Style options page with TailwindCSS matching popup design
- [ ] T107 [US4] Document options page usage in README.md

**Checkpoint**: User Story 4 complete - settings configuration working

---

## Phase 7: User Story 5 - Build for Production (Priority: P5)

**Goal**: Production build creates optimized bundles ready for Chrome Web Store submission

**Independent Test**: Run `npm run build` → verify output optimized, load in Chrome → works identically

### Implementation for User Story 5

- [ ] T108 [P] [US5] Configure Vite production build settings (minify, tree-shake)
- [ ] T109 [P] [US5] Configure source maps exclusion for production in vite.config.ts
- [ ] T110 [P] [US5] Add bundle size checks to build script with thresholds
- [ ] T111 [P] [US5] Configure asset optimization (image compression) in vite.config.ts
- [ ] T112 [P] [US5] Add SVG inlining for icons <10KB
- [ ] T113 [US5] Test production build completes in <30 seconds
- [ ] T114 [US5] Verify bundle sizes: background <200KB, content <100KB, popup <150KB (gzipped)
- [ ] T115 [US5] Test production build loads in Chrome without errors
- [ ] T116 [US5] Verify all functionality works identically to dev build
- [ ] T117 [P] [US5] Add build:analyze script to generate bundle visualizer report
- [ ] T118 [P] [US5] Update manifest.json with complete metadata for Chrome Web Store
- [ ] T119 [P] [US5] Add package script to create zip file for submission
- [ ] T120 [US5] Document production build process in README.md
- [ ] T121 [US5] Document Chrome Web Store submission steps in README.md

**Checkpoint**: User Story 5 complete - production build ready for distribution

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches, documentation, testing completeness, accessibility

- [ ] T122 [P] Add accessibility improvements: ARIA labels, keyboard navigation in popup
- [ ] T123 [P] Add accessibility improvements: ARIA labels, focus management in options page
- [ ] T124 [P] Test keyboard navigation: Tab order, Enter/Space on buttons, Esc to close popup
- [ ] T125 [P] Add dark mode styles throughout popup and options using Tailwind dark: variants
- [ ] T126 [P] Implement prefers-color-scheme detection and apply theme automatically
- [ ] T127 Create comprehensive integration test in tests/integration/fullFlow.test.ts
- [ ] T128 [P] Add error boundary component in src/popup/components/ErrorBoundary.tsx
- [ ] T129 [P] Add error boundary component in src/options/components/ErrorBoundary.tsx
- [ ] T130 [P] Implement global error handling in background worker
- [ ] T131 [P] Add logging utility in src/shared/utils/logger.ts with log levels
- [ ] T132 Update README.md with complete API documentation (all exported functions)
- [ ] T133 [P] Update README.md with troubleshooting section
- [ ] T134 [P] Update README.md with contribution guidelines
- [ ] T135 [P] Create CHANGELOG.md with version 1.0.0 initial release notes
- [ ] T136 [P] Create LICENSE file (MIT or appropriate license)
- [ ] T137 Run full linting pass and fix all errors: `npm run lint`
- [ ] T138 Run formatting pass: `npm run format`
- [ ] T139 Run type check and ensure zero errors: `npm run type-check`
- [ ] T140 Run all tests and ensure 100% pass: `npm test`
- [ ] T141 [P] Add pre-commit hook with husky to run lint + type-check
- [ ] T142 Verify bundle sizes are within limits using bundle analyzer
- [ ] T143 Test extension in Chrome Incognito mode (with permission)
- [ ] T144 Test extension handles storage quota exceeded gracefully
- [ ] T145 [P] Add example custom React hook in src/popup/hooks/useExtensionState.ts
- [ ] T146 [P] Add example utility function in src/shared/utils/formatters.ts
- [ ] T147 Update all inline code comments for clarity and completeness
- [ ] T148 Generate bundle analyzer report and save to docs/bundle-analysis.html
- [ ] T149 Create architectural diagram (optional) showing context relationships
- [ ] T150 Final manual testing checklist: Load extension → test all 5 user stories → verify MVP

---

## Dependencies

### User Story Completion Order

```
Phase 1 (Setup) & Phase 2 (Foundational)
         ↓
Phase 3 (US1 - Initialize) ← MVP - Must complete first
         ↓
    ┌────┴────┐
    ↓         ↓
Phase 4    Phase 5
(US2)      (US3)
Content    Background
         ↓
Phase 6 (US4 - Options)
         ↓
Phase 7 (US5 - Production Build)
         ↓
Phase 8 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (US1)  
**Parallelizable**: US2 and US3 can be worked on simultaneously after US1  
**Sequential**: US4 depends on US3 (needs settings infrastructure)  
**Final**: US5 and Phase 8 are last

### Parallel Execution Examples Per Story

**Phase 3 (US1) - Parallelizable Tasks**:

- T038 (background entry) + T039 (popup entry) + T042 (styles) can run together
- T043 (Button) + T044 (Card) can run together
- T050 (console.log) + T051 (version display) can run together

**Phase 4 (US2) - Parallelizable Tasks**:

- T054 (content entry) + T055 (DOM utils) + T059 (DOM manipulation) together
- T062 (message type) + T066 (error handling) + T067 (test) together

**Phase 5 (US3) - Parallelizable Tasks**:

- T069 (message handler) + T070 (storage manager) together
- T073-T076 (all GET/UPDATE handlers) can be built in parallel
- T079 (migration) + T080 (storage listener) + T084 (alarms) together
- T085 + T086 (all tests) together

**Phase 6 (US4) - Parallelizable Tasks**:

- T090-T095 (all options components) can be built in parallel
- T105 (reset) + T106 (styling) together

**Phase 8 (Polish) - Parallelizable Tasks**:

- T122-T126 (all accessibility and styling) together
- T128-T131 (all error handling and logging) together
- T132-T136 (all documentation) together
- T145-T146 (example utilities) together

---

## Implementation Strategy

### MVP First (Phase 3 - US1)

**Minimum Viable Product** delivers:

- ✅ Working dev build with HMR
- ✅ Extension loads in Chrome
- ✅ Popup opens and displays UI
- ✅ Basic React component structure
- ✅ TypeScript strict mode enforced
- ✅ Developer can start customizing

**Timeline**: After Phase 3 completion, template is usable for basic extension development

### Incremental Delivery

Each phase delivers independently testable functionality:

- **Phase 3**: Developer experience (MVP)
- **Phase 4**: Page interaction capability
- **Phase 5**: State management and persistence
- **Phase 6**: User configuration
- **Phase 7**: Production readiness
- **Phase 8**: Production quality and polish

### Testing Strategy

**Test-first for critical paths**:

- Message validation (T029, T085)
- Storage operations (T028, T086)
- Settings persistence (T103, T104)

**Test-after for UI**:

- Component rendering (after T041, T092)
- User interactions (after T045, T098)

**Integration tests**:

- Cross-context messaging (T067, T127)
- End-to-end flows (T150)

---

## Task Summary

**Total Tasks**: 150  
**Setup Phase**: 21 tasks (T001-T021)  
**Foundational Phase**: 16 tasks (T022-T037)  
**User Story 1 (P1)**: 16 tasks (T038-T053) 🎯 MVP  
**User Story 2 (P2)**: 15 tasks (T054-T068)  
**User Story 3 (P3)**: 21 tasks (T069-T089)  
**User Story 4 (P4)**: 18 tasks (T090-T107)  
**User Story 5 (P5)**: 14 tasks (T108-T121)  
**Polish Phase**: 29 tasks (T122-T150)

**Parallelizable Tasks**: 71 marked with [P] (47% of tasks)  
**Sequential Tasks**: 79 tasks require completion of dependencies

**Estimated Effort**:

- Phase 1-2 (Foundation): ~2-3 hours
- Phase 3 (US1 MVP): ~2-3 hours
- Phase 4 (US2): ~2-3 hours
- Phase 5 (US3): ~3-4 hours
- Phase 6 (US4): ~2-3 hours
- Phase 7 (US5): ~1-2 hours
- Phase 8 (Polish): ~3-4 hours
- **Total**: ~15-22 hours for complete implementation

---

## Success Criteria Mapping

Tasks map to success criteria from spec.md:

- **SC-001** (5 min setup): T001-T053 enable quick start
- **SC-002** (3s dev build): T030-T032 configure fast Vite HMR
- **SC-003** (30s prod build): T108-T111 optimize production
- **SC-004-SC-006** (TypeScript, linting, bundle sizes): T005, T013-T017, T033, T114
- **SC-007-SC-010** (functionality): All US1-US4 tasks
- **SC-011-SC-013** (dev experience): T052-T053, T132-T134
- **SC-014-SC-016** (compliance): T022, T108-T109
- **SC-017-SC-019** (testing): T018-T019, T035, T085-T086, T067, T127
- **SC-020-SC-022** (documentation): T132-T134, T147

All 22 success criteria covered by task implementation.

---

**Ready to implement!** Start with Phase 1 & 2 to establish foundation, then proceed to Phase 3 (US1) for MVP delivery.
