# Implementation Plan: shadcn/ui Integration

**Branch**: `002-shadcn-integration` | **Date**: December 12, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-shadcn-integration/spec.md`

## Summary

Replace all custom UI components in the Chrome extension with shadcn/ui components to provide better accessibility, consistency, and maintainability while preserving all existing functionality. This includes migrating buttons, cards, toggle switches, theme selectors, and toast notifications across popup and options pages. The migration maintains 100% functional compatibility, respects existing bundle size constraints (<500KB total), and ensures all three theme modes (light/dark/system) work consistently.

## Technical Context

**Language/Version**: TypeScript 5.0+ (already configured)
**Primary Dependencies**:

- Existing: React 18+, Vite 5+, TailwindCSS, @types/chrome
- New: shadcn/ui components, @radix-ui primitives, class-variance-authority, clsx, tailwind-merge
  **Storage**: Chrome Storage API (existing - no changes)
  **Testing**: Vitest (existing tests must pass without modification)
  **Target Platform**: Chromium-based browsers with Manifest V3 (existing)
  **Project Type**: Chrome Extension (existing structure maintained)
  **Performance Goals**: Maintain existing targets (extension load <100ms, renders <16ms), bundle size must stay <500KB total
  **Constraints**:
- Cannot break existing functionality or data storage
- Must maintain bundle size under 500KB total
- Must work within extension CSP restrictions
- All existing automated tests must pass unchanged
  **Scale/Scope**: ~8-10 UI components to migrate across popup and options pages

## Project Structure

### Documentation (this feature)

```text
specs/002-shadcn-integration/
├── plan.md              # This file
├── spec.md              # Feature specification (existing)
└── checklists/
    └── requirements.md  # Requirements checklist (existing)
```

### Source Code (repository root)

Existing structure (maintained, only component implementations change):

```text
src/
├── assets/
│   └── styles/
│       └── global.css           # Add shadcn base styles here
├── components/                   # NEW: shadcn component files
│   └── ui/                      # shadcn components live here
│       ├── button.tsx
│       ├── card.tsx
│       ├── switch.tsx
│       ├── select.tsx
│       ├── toast.tsx
│       └── toaster.tsx
├── lib/                         # NEW: utility functions
│   └── utils.ts                 # cn() helper for className merging
├── popup/
│   ├── App.tsx                  # Update to use shadcn components
│   ├── components/
│   │   ├── Button.tsx          # Replace with shadcn/ui button
│   │   └── Card.tsx            # Replace with shadcn/ui card
│   └── hooks/
├── options/
│   ├── OptionsApp.tsx           # Update to use shadcn components
│   └── components/
│       ├── ThemeSelector.tsx    # Replace with shadcn/ui select
│       ├── Toast.tsx            # Replace with shadcn/ui toast
│       └── ToggleSwitch.tsx     # Replace with shadcn/ui switch
├── shared/
│   └── components/
│       └── ErrorBoundary.tsx    # Keep as-is
└── background/                  # No changes
    content/                     # No changes
    tests/                       # No changes to test logic
```

**Structure Decision**: Use standard shadcn/ui conventions with components in `src/components/ui/` and utilities in `src/lib/`. This follows shadcn/ui documentation and makes future component additions straightforward. Existing feature structure (popup, options, background, content) remains unchanged.

## Technical Decisions

### shadcn/ui Setup

- Use CLI installation: `npx shadcn@latest init`
- Configuration choices:
  - Style: Default (already using Tailwind)
  - Base color: Slate (neutral, works well with existing design)
  - CSS variables: Yes (for theming support)
  - TypeScript: Yes (already configured)
  - Tailwind config location: `tailwind.config.js` (existing)
  - Components location: `src/components`
  - Utils location: `src/lib/utils.ts`
  - React Server Components: No (not applicable for Chrome extension)

### Component Mapping

| Current Component | shadcn/ui Component | Command                        |
| ----------------- | ------------------- | ------------------------------ |
| Button.tsx        | button              | `npx shadcn@latest add button` |
| Card.tsx          | card                | `npx shadcn@latest add card`   |
| ToggleSwitch.tsx  | switch              | `npx shadcn@latest add switch` |
| ThemeSelector.tsx | select              | `npx shadcn@latest add select` |
| Toast.tsx         | toast + toaster     | `npx shadcn@latest add toast`  |

### Theme Integration

Current implementation uses CSS classes for theme switching (light/dark/system). shadcn/ui uses CSS variables with class-based theme switching, which is compatible. Update theme implementation to:

1. Keep existing theme storage logic in `useSettings.ts`
2. Update theme application to set `dark` class on root element
3. Ensure shadcn CSS variables respect theme class
4. Test all three modes: light, dark, system

### Bundle Size Strategy

To maintain <500KB total constraint:

- Use tree-shaking (Vite handles automatically)
- Import only needed components
- Monitor bundle size with `pnpm run build` after each component addition
- If size increases significantly, consider:
  - Removing unused Radix UI features
  - Optimizing Tailwind purge configuration
  - Lazy loading heavy components

## Implementation Strategy

### Phase 1: Setup & Configuration

1. Install shadcn/ui CLI and initialize configuration
2. Add required dependencies (@radix-ui, class-variance-authority, etc.)
3. Update global.css with shadcn base styles
4. Create utils.ts with cn() helper
5. Verify build still works and check initial bundle size impact

### Phase 2: Component Migration (Story 1 - P1)

Migrate components one at a time to minimize risk:

1. Button → test popup interactions
2. Card → test popup layout
3. Switch → test options page toggles
4. Select → test theme selector
5. Toast → test notification system

After each migration:

- Run existing tests
- Manually verify functionality in extension
- Check bundle size

### Phase 3: Theme Verification (Story 2 - P2)

1. Test light mode across all pages
2. Test dark mode across all pages
3. Test system mode and automatic switching
4. Verify transitions are smooth
5. Check accessibility in each mode

### Phase 4: Functional Testing (Story 3 - P1)

1. Verify settings persistence
2. Test message passing between components
3. Verify background service communication
4. Test across browser sessions
5. Monitor console for errors

### Phase 5: Final Validation

1. Run full test suite
2. Verify bundle size <500KB
3. Check load times meet targets
4. Verify no console errors/warnings
5. Document any deviations or notes

## Dependencies

- **shadcn/ui**: Component collection (will be installed)
- **@radix-ui primitives**: Underlying accessible components (installed with shadcn)
- **class-variance-authority**: Component variant management (installed with shadcn)
- **clsx + tailwind-merge**: Utility for className merging (installed with shadcn)
- **React 18+**: Already in project
- **TailwindCSS**: Already in project
- **TypeScript**: Already in project

## Risk Mitigation

| Risk                         | Impact   | Mitigation                                                                      |
| ---------------------------- | -------- | ------------------------------------------------------------------------------- |
| Bundle size exceeds 500KB    | High     | Monitor after each component, optimize imports, consider selective installation |
| Theme system incompatibility | Medium   | Test early, shadcn uses CSS variables which should work with existing approach  |
| Breaking existing tests      | High     | Run tests after each component migration, fix any breaking changes immediately  |
| CSP violations from Radix UI | High     | Test in extension context early, ensure all styles are properly bundled         |
| Breaking data persistence    | Critical | Do not modify storage logic, only UI components                                 |

## Success Criteria

- All 8-10 components successfully migrated
- All existing tests pass (100%)
- Bundle size remains <500KB
- All three theme modes work correctly
- Zero console errors during operation
- Extension loads in <2 seconds
- UI interactions respond in <50ms
- Settings persist correctly across sessions
