# Tasks: shadcn/ui Integration

**Input**: Design documents from `/specs/002-shadcn-integration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests are NOT explicitly requested in this specification. Tasks focus on implementation and manual verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This project uses Chrome extension structure with `src/` at repository root containing popup, options, background, content, and shared components.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install shadcn/ui and configure project for component integration

- [x] T001 Run `npx shadcn@latest init` to initialize shadcn/ui configuration (choose: Default style, Slate base color, CSS variables, TypeScript, components in src/components, utils in src/lib/utils.ts)
- [x] T002 [P] Install required dependencies: @radix-ui primitives, class-variance-authority, clsx, tailwind-merge (if not auto-installed)
- [x] T003 [P] Create src/lib/utils.ts with cn() utility function for className merging
- [x] T004 Update src/assets/styles/global.css to include shadcn/ui base styles, CSS variables, and theme classes
- [x] T005 Verify build runs successfully and check initial bundle size with `pnpm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shadcn components that will be used across multiple user stories

**⚠️ CRITICAL**: No user story component work can begin until these base components are installed

- [x] T006 [P] Install shadcn/ui button component with `npx shadcn@latest add button` in src/components/ui/button.tsx
- [x] T007 [P] Install shadcn/ui card component with `npx shadcn@latest add card` in src/components/ui/card.tsx
- [x] T008 [P] Install shadcn/ui switch component with `npx shadcn@latest add switch` in src/components/ui/switch.tsx
- [x] T009 [P] Install shadcn/ui select component with `npx shadcn@latest add select` in src/components/ui/select.tsx
- [x] T010 [P] Install shadcn/ui toast component with `npx shadcn@latest add toast` in src/components/ui/toast.tsx and src/components/ui/toaster.tsx (used sonner instead)
- [x] T011 Verify all components compile without TypeScript errors

**Checkpoint**: Foundation ready - component migration can now begin in parallel

---

## Phase 3: User Story 1 - UI Component Migration (Priority: P1) 🎯 MVP

**Goal**: Replace all custom UI components with shadcn/ui equivalents while maintaining exact functionality

**Independent Test**: Open popup and options pages, interact with all controls (buttons, toggles, theme selector, toast notifications), verify all features work identically to before migration

### Implementation for User Story 1

- [x] T012 [P] [US1] Replace popup Button component - update src/popup/components/Button.tsx to use shadcn/ui button
- [x] T013 [P] [US1] Replace popup Card component - update src/popup/components/Card.tsx to use shadcn/ui card
- [x] T014 [P] [US1] Replace options ToggleSwitch component - update src/options/components/ToggleSwitch.tsx to use shadcn/ui switch
- [x] T015 [P] [US1] Replace options ThemeSelector component - update src/options/components/ThemeSelector.tsx to use shadcn/ui select
- [x] T016 [P] [US1] Replace options Toast component - update src/options/components/Toast.tsx to use shadcn/ui toast system
- [x] T017 [US1] Update src/popup/App.tsx to import and use new button and card components
- [x] T018 [US1] Update src/options/OptionsApp.tsx to import and use new switch, select, and toast components
- [x] T019 [US1] Add Toaster provider to src/options/OptionsApp.tsx for toast notifications
- [x] T020 [US1] Update useSettings hook in src/options/hooks/useSettings.ts to use shadcn toast instead of custom Toast
- [x] T021 [US1] Verify all interactive elements have proper ARIA attributes and keyboard navigation support
- [x] T022 [US1] Test all components in popup: click buttons, verify cards display correctly
- [x] T023 [US1] Test all components in options page: toggle switches, change theme selector, trigger toast notifications
- [x] T024 [US1] Run existing test suite with `pnpm test` and ensure all tests pass
- [x] T025 [US1] Check bundle size with `pnpm run build` and verify total size is under 500KB (Result: ~452KB uncompressed, ~137KB gzipped ✓)

**Checkpoint**: At this point, all UI components are migrated and all existing functionality works identically

---

## Phase 4: User Story 2 - Visual Consistency Verification (Priority: P2)

**Goal**: Ensure all UI elements maintain visual consistency across light, dark, and system theme modes

**Independent Test**: Switch between light, dark, and system themes in options page, verify all components in both popup and options render correctly in each mode without visual glitches

### Implementation for User Story 2

- [ ] T026 [US2] Update theme application logic to ensure `dark` class is applied to root element when dark theme is active
- [ ] T027 [US2] Verify CSS variables in src/assets/styles/global.css properly define colors for both light and dark modes
- [ ] T028 [US2] Test light theme: Open popup and options page, verify all components use appropriate light theme colors and contrast
- [ ] T029 [US2] Test dark theme: Switch to dark mode, open popup and options page, verify all components use appropriate dark theme colors and contrast
- [ ] T030 [US2] Test system theme: Set theme to system preference, change system theme (light ↔ dark), verify extension UI updates automatically
- [ ] T031 [US2] Verify smooth visual transitions when switching themes (no jarring flashes or layout shifts)
- [ ] T032 [US2] Check color contrast meets accessibility standards in both themes using browser DevTools
- [ ] T033 [US2] Verify typography and spacing remain consistent across all theme modes

**Checkpoint**: All theme modes work correctly with consistent visual appearance

---

## Phase 5: User Story 3 - Functional Stability Testing (Priority: P1)

**Goal**: Verify all existing features continue to work exactly as before: settings persistence, message passing, background communication, data storage

**Independent Test**: Perform all user actions (changing settings, toggling features, saving preferences), close and reopen extension, verify data persists correctly across browser sessions

### Implementation for User Story 3

- [ ] T034 [US3] Test settings persistence: Change multiple settings in options page, close options page, reopen, verify all settings persisted correctly
- [ ] T035 [US3] Test theme persistence: Change theme in popup, close popup, reopen, verify theme preference is maintained
- [ ] T036 [US3] Test settings persistence across browser sessions: Change settings, close browser, reopen browser, verify settings are still correct
- [ ] T037 [US3] Test message passing: Verify popup can communicate with background service worker (check console for successful message responses)
- [ ] T038 [US3] Test background service communication: Trigger actions that involve background script, verify they complete successfully
- [ ] T039 [US3] Test data storage integration: Verify chrome.storage.sync and chrome.storage.local APIs work correctly with new components
- [ ] T040 [US3] Monitor browser developer tools console during all interactions, verify zero errors and zero warnings appear
- [ ] T041 [US3] Test rapid theme switching: Switch themes quickly multiple times, verify no race conditions or visual glitches occur
- [ ] T042 [US3] Test edge case: Interact with components while theme is being changed, verify components remain functional
- [ ] T043 [US3] Run full existing test suite again with `pnpm test`, ensure 100% pass rate

**Checkpoint**: All existing functionality works identically to pre-migration state

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final optimizations and documentation updates

- [ ] T044 [P] Update README.md to mention shadcn/ui integration and component usage
- [ ] T045 [P] Add code comments documenting shadcn/ui component usage patterns in key files
- [ ] T046 Review and remove any unused imports or dead code from component files
- [ ] T047 Run final bundle size check and document total size (target: <500KB)
- [ ] T048 Verify extension loads in browser within 2 seconds after installation
- [ ] T049 Verify all interactive components respond to user input within 50ms
- [ ] T050 Final smoke test: Install extension in fresh browser profile, test all features end-to-end
- [ ] T051 Create migration notes documenting the shadcn/ui integration for future reference

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1 - UI Migration): Must complete first as it provides the foundation
  - User Story 2 (P2 - Visual Consistency): Can start after US1 components are migrated
  - User Story 3 (P1 - Functional Stability): Can start after US1 components are migrated
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - UI Migration)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2 - Visual Consistency)**: Depends on User Story 1 completion - needs migrated components to verify themes
- **User Story 3 (P1 - Functional Stability)**: Depends on User Story 1 completion - needs migrated components to test functionality

**Note**: While US1 is P1 and US3 is also P1, US3 tests the result of US1, so US1 must complete first. US2 (P2) can run in parallel with US3 after US1 completes.

### Within Each User Story

**User Story 1 (UI Migration)**:

- Tasks T012-T016 (component replacements) can run in parallel - different files
- Tasks T017-T020 (integration) must run sequentially after component replacements
- Tasks T021-T025 (testing) must run after all implementations complete

**User Story 2 (Visual Consistency)**:

- Task T026-T027 (theme setup) must complete first
- Tasks T028-T030 (theme testing) can run in parallel - independent tests
- Tasks T031-T033 (verification) run after theme tests

**User Story 3 (Functional Stability)**:

- All tasks T034-T043 are sequential tests that build on each other

### Parallel Opportunities

- All Setup tasks (T001-T005): T002 and T003 can run in parallel
- All Foundational tasks (T006-T010): Can all run in parallel - installing different components
- User Story 1 component replacements (T012-T016): Can all run in parallel - different files
- User Story 2 theme tests (T028-T030): Can run in parallel - independent verification
- Polish tasks (T044-T045): Can run in parallel - different files

---

## Parallel Example: User Story 1

```bash
# Launch all component replacements together (Phase 3 start):
Task: "Replace popup Button component - update src/popup/components/Button.tsx"
Task: "Replace popup Card component - update src/popup/components/Card.tsx"
Task: "Replace options ToggleSwitch component - update src/options/components/ToggleSwitch.tsx"
Task: "Replace options ThemeSelector component - update src/options/components/ThemeSelector.tsx"
Task: "Replace options Toast component - update src/options/components/Toast.tsx"

# After component replacements complete, run integrations sequentially
# After integrations complete, run all verifications
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011) - CRITICAL blocks all stories
3. Complete Phase 3: User Story 1 (T012-T025)
4. **STOP and VALIDATE**: Test all components in popup and options page
5. Demo migrated UI components

This gives you a complete working migration of all UI components with maintained functionality.

### Incremental Delivery

1. Complete Setup (Phase 1) → shadcn/ui configured
2. Complete Foundational (Phase 2) → Base components installed
3. Complete User Story 1 (Phase 3) → All components migrated → **Deploy/Demo MVP!**
4. Complete User Story 2 (Phase 4) → Theme consistency verified → **Deploy/Demo**
5. Complete User Story 3 (Phase 5) → Functional stability confirmed → **Deploy/Demo**
6. Complete Polish (Phase 6) → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T011)
2. Once Foundational is done:
   - Developer A focuses on User Story 1: Component migrations (T012-T025)
3. Once User Story 1 completes:
   - Developer B: User Story 2 (theme verification - T026-T033)
   - Developer C: User Story 3 (functional testing - T034-T043)
4. Polish work can be split across team (T044-T051)

**Note**: This feature is relatively linear due to the nature of UI migration. Most parallelization happens within phases (multiple components at once) rather than across user stories.

---

## Notes

- [P] tasks = different files, no dependencies, can execute simultaneously
- [US1]/[US2]/[US3] labels map tasks to specific user stories for traceability
- User Story 1 must complete before US2 and US3 can begin (they test US1's output)
- Each user story has clear independent test criteria defined in spec.md
- Stop at any checkpoint to validate story independently before proceeding
- Bundle size monitoring is critical - check after Phase 1, Phase 2, and Phase 3
- Manual testing is primary validation method (no automated tests requested)
- Verify zero console errors throughout all phases

---

## Summary

- **Total Tasks**: 51 tasks
- **Setup Phase**: 5 tasks (T001-T005)
- **Foundational Phase**: 6 tasks (T006-T011)
- **User Story 1 (P1)**: 14 tasks (T012-T025) - Core UI migration
- **User Story 2 (P2)**: 8 tasks (T026-T033) - Theme verification
- **User Story 3 (P1)**: 10 tasks (T034-T043) - Functional testing
- **Polish**: 8 tasks (T044-T051)
- **Parallel Opportunities**: 15 tasks can run in parallel within their phases
- **MVP Scope**: Phases 1-3 (Tasks T001-T025) = 25 tasks for complete UI migration
