<!--
SYNC IMPACT REPORT
Version: 0.0.0 → 1.0.0
Changes: Initial constitution ratification
Principles Added:
  - I. Type Safety & Code Quality
  - II. User Experience Consistency
  - III. Performance Requirements (NON-NEGOTIABLE)
  - IV. Build & Bundle Optimization
  - V. Chrome Extension Standards
Sections Added:
  - Technical Standards
  - Development Workflow
Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with all principles
  ✅ spec-template.md - Requirements and testing sections compatible
  ✅ tasks-template.md - Phase structure supports all principle-driven tasks
Follow-up: None - all placeholders resolved
-->

# Vite Chrome Extension Constitution

## Core Principles

### I. Type Safety & Code Quality

All code MUST be written in TypeScript with strict mode enabled. Type safety is non-negotiable.

**Requirements**:

- `strict: true` in tsconfig.json with no `@ts-ignore` without documented justification
- ESLint and Prettier configured and enforced in pre-commit hooks
- Zero linting errors or warnings allowed in committed code
- All functions MUST have explicit return types
- All API boundaries MUST have validated type schemas (Zod, io-ts, or similar)
- Code complexity metrics tracked: cyclomatic complexity ≤10 per function, file length ≤300 lines

**Rationale**: Chrome extensions run in user browsers with limited debugging capabilities. Type
safety catches errors at compile time, reduces runtime failures, and provides self-documenting
code that improves maintainability.

### II. User Experience Consistency

UI/UX MUST be consistent, accessible, and follow Chrome extension best practices.

**Requirements**:

- Design system enforced: shared component library with documented usage patterns
- All interactive elements MUST meet WCAG 2.1 Level AA accessibility standards
- Keyboard navigation MUST work for all features (tab order, shortcuts, focus management)
- Visual consistency: unified color palette, typography, spacing (design tokens required)
- Loading states, error states, and empty states MUST be designed for every user interaction
- Dark/light mode support MUST be implemented using system preferences
- All user-facing text MUST be internationalization-ready (i18n structure even if single language)

**Rationale**: Extensions are part of the user's browser environment. Inconsistent or inaccessible
UX breaks user trust and creates friction. Accessibility is not optional—it's a baseline requirement
for inclusive software.

### III. Performance Requirements (NON-NEGOTIABLE)

Extensions MUST be performant and resource-efficient. User browser resources are precious.

**Mandatory Metrics**:

- **Extension load time**: <100ms from installation to ready state
- **Content script injection**: <50ms to inject and initialize on page load
- **Memory footprint**: <50MB total memory usage (background + content scripts + popup)
- **Bundle size**: Background script <200KB, content scripts <100KB each, popup <150KB (gzipped)
- **React render time**: <16ms (60fps) for all UI interactions in popup/options pages
- **API response handling**: <200ms from message received to UI update

**Enforcement**:

- Bundle analyzer MUST run on every build with size regression alerts
- Lighthouse CI performance checks required for popup/options pages (score ≥90)
- Memory profiling MUST be performed for any feature touching background scripts
- Performance regression tests block merges if metrics degrade >10%

**Rationale**: Poor performance drains battery, slows browsing, and leads to extension uninstalls.
Chrome Web Store reviews punish slow extensions. Performance is a feature, not an optimization task.

### IV. Build & Bundle Optimization

Build process MUST prioritize fast development cycles and optimized production bundles.

**Requirements**:

- Vite HMR (Hot Module Replacement) MUST work for all contexts (popup, options, content scripts)
- Code splitting by context: separate bundles for background, content, popup, options
- Tree-shaking enabled with side-effects tracking in package.json
- Dynamic imports for heavy dependencies (load on demand, not on extension start)
- Asset optimization: images compressed, SVGs inlined when <10KB
- Source maps generated for development builds only (excluded from production)
- Build time for development: <3s, production: <30s

**Rationale**: Developer productivity depends on fast feedback loops. Users benefit from minimal
bundle sizes. Clear separation of concerns by context prevents unnecessary code loading.

### V. Chrome Extension Standards

Extension MUST comply with Chrome Web Store policies and Manifest V3 requirements.

**Requirements**:

- Manifest V3 ONLY (no V2 compatibility shims)
- Service worker background script (no persistent background pages)
- Permissions MUST follow principle of least privilege (request minimal permissions)
- Content Security Policy (CSP) enforced: no inline scripts, no eval, no unsafe-eval
- External API calls MUST be declared in manifest host_permissions
- Chrome extension APIs used correctly: message passing for cross-context communication
- Extension updates MUST NOT break user data (migration strategy required for breaking changes)

**Rationale**: Chrome Web Store enforces Manifest V3 and will remove non-compliant extensions.
Security vulnerabilities expose users to risk. Following standards ensures long-term viability.

## Technical Standards

### Technology Stack

**Core Technologies** (MUST use these versions or newer):

- TypeScript 5.0+
- React 18+ (for UI components)
- Vite 5+ (build tool)
- Manifest V3
- Chrome Extension API with @types/chrome

**Required Dependencies**:

- Zod or io-ts for runtime type validation
- TailwindCSS or CSS Modules for styling (no inline styles)
- React Query or SWR for state management and caching
- Vitest for unit testing
- Playwright or Puppeteer for E2E extension testing

**Prohibited**:

- Any Manifest V2 APIs or polyfills
- jQuery or other DOM manipulation libraries (use React)
- Inline event handlers (use React event system)
- eval(), Function constructor, or unsafe-eval CSP violations

### Security Requirements

**All code MUST**:

- Sanitize user inputs before rendering (XSS prevention)
- Validate all external API responses with type schemas
- Store sensitive data in chrome.storage with encryption when needed
- Never expose API keys or secrets in bundled code (use environment variables properly)
- Implement Content Security Policy with no unsafe directives
- Use HTTPS for all external requests declared in host_permissions

### Storage & State

**State Management**:

- Chrome storage API (chrome.storage.sync or chrome.storage.local) for persistent data
- React state/context for UI-only transient state
- Message passing for cross-context state synchronization
- Storage schema versioning MUST be implemented for data migrations

## Development Workflow

### Pre-Development

**Before implementing any feature**:

1. Specification document created in `/specs/[###-feature-name]/spec.md`
2. Implementation plan documented in `/specs/[###-feature-name]/plan.md`
3. Constitution check passed (verify compliance with all principles)
4. User stories defined with independent testability criteria
5. Performance budget allocated (which metrics will this feature impact?)

### Development Cycle

**TDD Encouraged** (Test-Driven Development):

- Write tests first when implementing complex logic or critical paths
- Red-Green-Refactor cycle for core features
- Integration tests MUST cover cross-context communication (background ↔ content ↔ popup)

**Code Review Gates**:

- All PRs MUST pass automated checks: linting, type checking, tests, bundle size analysis
- At least one reviewer approval required
- Constitution compliance verified by reviewer
- No commented-out code, debug logs, or TODO comments without linked issues

### Quality Gates

**Pre-Merge Checklist**:

- ✅ TypeScript compiles with zero errors
- ✅ All tests pass (unit + integration)
- ✅ ESLint/Prettier pass with zero errors
- ✅ Bundle size within limits (no regressions >5%)
- ✅ Manual testing in Chrome browser completed
- ✅ Accessibility audit passed (keyboard nav, screen reader compatible)
- ✅ Performance metrics within thresholds
- ✅ No console errors or warnings in extension contexts

### Testing Requirements

**Required Test Coverage**:

- Unit tests for business logic, utilities, and pure functions
- Integration tests for Chrome API interactions and message passing
- E2E tests for critical user flows (extension install → feature use)
- Accessibility tests using jest-axe or similar tools

**Test Organization**:

- Tests colocated with source files or in parallel `__tests__` directories
- Test data factories for complex objects
- Mock Chrome APIs using chrome.storage.\* mocks in tests

## Governance

This constitution supersedes all other development practices and guidelines. All team members,
contributors, and reviewers MUST enforce these principles.

**Amendment Process**:

1. Propose amendment with justification and impact analysis
2. Document version bump rationale (MAJOR/MINOR/PATCH)
3. Update affected templates and documentation
4. Get approval from project maintainers
5. Implement constitution version increment

**Version Semantics**:

- **MAJOR**: Principle removal/redefinition, backward-incompatible governance changes
- **MINOR**: New principle added, section expansions, new requirements
- **PATCH**: Clarifications, wording improvements, typo fixes

**Compliance Verification**:

- All PRs MUST reference this constitution in review checklist
- Violations MUST be documented and justified before merge
- Complexity exceptions require explicit approval with mitigation plan
- Regular audits (quarterly) to verify ongoing compliance

**Constitution supersedes convenience** - if a practice conflicts with these principles, the
constitution wins. No exceptions without documented amendment.

**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
