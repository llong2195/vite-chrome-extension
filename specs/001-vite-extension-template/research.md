# Research: Vite Chrome Extension Template

**Feature**: 001-vite-extension-template  
**Date**: 2025-12-10  
**Status**: Complete

## Overview

This document captures the research and decision-making process for technology choices in the Vite Chrome Extension template. Since this is a template project designed to demonstrate best practices, all technology selections are made upfront based on the constitution requirements and current industry standards.

## Technology Stack Decisions

### Build Tool: Vite 5+

**Decision**: Use Vite as the build tool for the Chrome extension template.

**Rationale**:

- **Fast HMR**: Vite's ESM-based HMR provides sub-second updates during development, meeting the <3s rebuild requirement
- **Multi-entry support**: Vite's `build.rollupOptions.input` allows separate entry points for each extension context (background, content, popup, options)
- **Code splitting**: Built-in support for code splitting and tree-shaking, essential for meeting bundle size requirements
- **Modern ESM**: Native ES modules support aligns with modern JavaScript practices
- **Plugin ecosystem**: Rich plugin ecosystem including Chrome extension-specific plugins (CRXJS, vite-plugin-web-extension)
- **Zero config**: Sensible defaults reduce configuration complexity
- **TypeScript support**: First-class TypeScript support with no additional tooling

**Alternatives Considered**:

- **Webpack**: More mature but slower build times, complex configuration, and overkill for extension needs
- **Rollup**: Closer to Vite but lacks HMR and dev server capabilities
- **esbuild**: Fast but minimal plugin ecosystem and limited support for Chrome extension specifics
- **Parcel**: Good defaults but less control over output structure needed for extensions

**References**:

- Vite documentation: https://vitejs.dev/
- CRXJS Vite Plugin: https://crxjs.dev/vite-plugin/

---

### UI Framework: React 18+

**Decision**: Use React for popup and options page UI components.

**Rationale**:

- **Constitution requirement**: React 18+ specified in Technical Standards
- **Wide adoption**: Largest developer community and ecosystem in the UI framework space
- **Component model**: Clear separation of concerns with reusable components
- **Hooks**: Modern hooks API simplifies state management and side effects
- **TypeScript support**: Excellent TypeScript definitions and type inference
- **Performance**: React 18's concurrent rendering and automatic batching support <16ms render requirement
- **Accessibility**: Strong accessibility primitives and testing tools (jest-axe)
- **Developer experience**: Rich dev tools and debugging capabilities

**Alternatives Considered**:

- **Vue**: Smaller bundle size but smaller community and less TypeScript focus
- **Svelte**: Excellent performance and small bundles but less mature ecosystem
- **Preact**: React-compatible but smaller, but lacks some React 18 features
- **Vanilla JS**: Minimal but loses component abstraction and developer productivity

**Note**: React is NOT used for content scripts or background workers to minimize bundle sizes in those contexts.

---

### Type System: TypeScript 5.0+ (Strict Mode)

**Decision**: Use TypeScript with strict mode enabled throughout the entire codebase.

**Rationale**:

- **Constitution requirement**: TypeScript strict mode is non-negotiable (Principle I)
- **Compile-time safety**: Catches errors before runtime, crucial for browser extensions with limited debugging
- **Self-documenting**: Types serve as inline documentation for APIs and data structures
- **IDE support**: Superior autocomplete and refactoring capabilities
- **Chrome API types**: @types/chrome provides complete type definitions for extension APIs
- **Reduced runtime errors**: Strict null checks and type guards prevent common bugs
- **Ecosystem**: All modern tooling (Vite, React, Vitest) has first-class TypeScript support

**Alternatives Considered**:

- **JavaScript with JSDoc**: Less enforcement, no compile-time checking
- **TypeScript non-strict**: Defeats the purpose of type safety
- **Flow**: Declining usage, inferior tooling compared to TypeScript

**Configuration**:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

### Styling: TailwindCSS

**Decision**: Use TailwindCSS for styling popup and options pages.

**Rationale**:

- **Constitution requirement**: TailwindCSS specified as approved styling solution
- **Design system**: Utility-first approach enforces consistency through design tokens
- **Performance**: Purges unused styles in production, minimizing CSS bundle size
- **Dark mode**: Built-in dark mode support via `prefers-color-scheme`
- **Accessibility**: Built-in focus styles and contrast utilities
- **Developer productivity**: No context switching between HTML and CSS files
- **Tree-shakable**: Only used utilities are included in final bundle
- **Customizable**: Easy to configure custom color palettes and spacing scales

**Alternatives Considered**:

- **CSS Modules**: More boilerplate, less design system enforcement
- **Styled Components**: Runtime overhead unacceptable for extension popup
- **Vanilla CSS**: No design system, harder to maintain consistency
- **Bootstrap**: Heavier bundle size, less customizable

---

### Runtime Validation: Zod

**Decision**: Use Zod for runtime type validation at API boundaries.

**Rationale**:

- **Constitution requirement**: Runtime validation required at API boundaries
- **TypeScript integration**: Generates TypeScript types from schemas (single source of truth)
- **Chrome message validation**: Validate messages between extension contexts (popup ↔ background ↔ content)
- **Storage validation**: Validate data read from chrome.storage to handle schema migrations
- **Composability**: Easy to build complex schemas from simple primitives
- **Error messages**: Clear validation errors for debugging
- **Zero dependencies**: Lightweight (<10KB gzipped)

**Alternatives Considered**:

- **io-ts**: More complex API, larger bundle size
- **Yup**: Primarily for form validation, less TypeScript integration
- **AJV**: JSON Schema based, verbose and less TypeScript-friendly
- **Manual validation**: Error-prone and doesn't generate types

**Example Usage**:

```typescript
import { z } from "zod";

const MessageSchema = z.object({
  type: z.enum(["GET_DATA", "SET_DATA"]),
  payload: z.unknown(),
});

type Message = z.infer<typeof MessageSchema>;
```

---

### Testing: Vitest

**Decision**: Use Vitest for unit and integration testing.

**Rationale**:

- **Constitution requirement**: Vitest specified in Technical Standards
- **Vite integration**: Shares Vite configuration, no duplication
- **TypeScript support**: Native TypeScript support without ts-node
- **Fast**: Uses Vite's transformation pipeline, instant feedback
- **Jest compatible**: Familiar API for developers with Jest experience
- **ESM support**: Native ES modules unlike Jest
- **Chrome API mocking**: Easy to mock chrome.\* APIs using vi.mock()
- **Watch mode**: Fast re-runs on file changes

**Alternatives Considered**:

- **Jest**: Slower, requires complex ESM configuration
- **Mocha/Chai**: More setup required, less integrated experience
- **uvu**: Minimal but less feature-complete

---

### Code Quality: ESLint + Prettier

**Decision**: Use ESLint for linting and Prettier for code formatting.

**Rationale**:

- **Constitution requirement**: ESLint and Prettier enforced in pre-commit hooks
- **ESLint**: Catches potential bugs, enforces best practices, TypeScript-aware
- **Prettier**: Eliminates formatting debates, ensures consistency
- **Integration**: eslint-config-prettier prevents conflicts between tools
- **Pre-commit hooks**: Enforce quality gates before code is committed
- **Editor integration**: Real-time feedback in VS Code and other editors

**ESLint Configuration**:

- `@typescript-eslint/recommended`: TypeScript-specific rules
- `eslint-plugin-react`: React best practices
- `eslint-plugin-react-hooks`: Enforces rules of hooks
- `eslint-plugin-jsx-a11y`: Accessibility linting

---

### Chrome Extension Manifest: V3

**Decision**: Use Manifest V3 exclusively, no V2 compatibility.

**Rationale**:

- **Constitution requirement**: Manifest V3 ONLY (Principle V)
- **Chrome requirement**: V2 is deprecated, will be removed from Chrome Web Store
- **Security**: Service workers are more secure than persistent background pages
- **Modern APIs**: V3 provides newer APIs (declarativeNetRequest, scripting)
- **Future-proof**: Template should prepare developers for the current standard

**Key V3 Changes**:

- Background pages → Service workers
- webRequest → declarativeNetRequest (not used in template)
- Execution isolated from web pages (CSP enforcement)
- Host permissions separated from regular permissions

---

### State Management: Chrome Storage API + React Context

**Decision**: Use Chrome Storage API for persistence, React Context for UI state.

**Rationale**:

- **Chrome Storage API**: Native extension storage, syncs across devices (chrome.storage.sync)
- **Quota limits**: 100KB per item, 8KB per item (sync), adequate for most extensions
- **Type safety**: Wrap storage operations with Zod validation
- **React Context**: Sufficient for popup/options UI state, no Redux/MobX overhead
- **Message passing**: Use chrome.runtime.sendMessage for cross-context communication
- **No external state library**: Avoids bundle bloat and complexity

**Alternatives Considered**:

- **Redux**: Overkill for extension UI, large bundle size
- **Zustand**: Simpler than Redux but still unnecessary for extension scope
- **LocalStorage**: Not synced across devices, no Chrome API integration
- **IndexedDB**: More complex than needed for simple extension storage

---

### Bundle Analysis: rollup-plugin-visualizer

**Decision**: Include bundle visualization in build pipeline.

**Rationale**:

- **Constitution requirement**: Bundle analyzer must run on every build
- **Size awareness**: Developers see bundle composition immediately
- **Optimization guide**: Identify large dependencies for optimization
- **Regression detection**: Compare bundle sizes across builds
- **Vite compatible**: Works with Rollup under the hood

---

## Architecture Patterns

### Message Passing Protocol

**Decision**: Define typed message protocol for cross-context communication.

**Rationale**:

- Type safety for messages between popup, background, and content scripts
- Centralized message type definitions in `/src/shared/messageTypes.ts`
- Zod validation for runtime safety
- Clear contract between contexts

**Pattern**:

```typescript
// Define message types
type Message =
  | { type: "GET_SETTINGS" }
  | { type: "UPDATE_SETTING"; key: string; value: unknown };

// Send with type safety
chrome.runtime.sendMessage<Message>({ type: "GET_SETTINGS" });
```

---

### Storage Schema Versioning

**Decision**: Implement storage schema versioning pattern.

**Rationale**:

- **Constitution requirement**: Extension updates must not break user data
- Handle schema changes gracefully
- Migrate user data across extension versions
- Version field in storage schema

**Pattern**:

```typescript
interface StorageSchema {
  version: number;
  settings: UserSettings;
}

// Migration function
function migrateStorage(old: StorageSchema): StorageSchema {
  if (old.version < 2) {
    // Migrate from v1 to v2
  }
  return { ...old, version: 2 };
}
```

---

### Lazy Loading

**Decision**: Use dynamic imports for heavy dependencies.

**Rationale**:

- Reduce initial load time
- Split large libraries into separate chunks
- Load on demand when features are used

**Example**:

```typescript
// Lazy load a heavy library
async function handleExport() {
  const { exportData } = await import("./exportUtils");
  exportData();
}
```

---

## Performance Optimizations

### Code Splitting by Context

Each extension context gets its own bundle:

- `background.js` - Service worker only code
- `content.js` - DOM manipulation only code
- `popup.js` - React + popup UI
- `options.js` - React + options UI

Shared code goes in each bundle only when needed (tree-shaking).

### Asset Optimization

- Icons: Multiple sizes (16px, 48px, 128px) optimized with imagemin
- SVGs: Inline for icons <10KB, external for larger assets
- Fonts: Subset to Latin characters only (if custom fonts used)

### React Optimization

- Use `React.memo()` for expensive components
- `useMemo()` and `useCallback()` for expensive computations
- Virtual scrolling for long lists (if needed)
- Lazy load routes with `React.lazy()` (options page tabs)

---

## Development Workflow

### Hot Module Replacement (HMR)

Vite HMR configured for all contexts:

- Popup/Options: React Fast Refresh (instant UI updates)
- Content scripts: Auto-reload content scripts on save
- Background: Service worker restarts on changes
- Extension reload helper for Chrome

### Build Scripts

```json
{
  "scripts": {
    "dev": "vite build --watch --mode development",
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Security Considerations

### Content Security Policy

Strict CSP in manifest.json:

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

No inline scripts, no eval, no unsafe-eval.

### Input Sanitization

- Sanitize all user inputs before rendering (XSS prevention)
- Use React's built-in XSS protection (escaped by default)
- Validate external API responses with Zod before using

### Permissions

Minimal permissions requested:

- `storage`: For chrome.storage API
- `activeTab`: For content script injection (only when needed)
- No broad `<all_urls>` permission unless specifically required

---

## Accessibility

- Keyboard navigation: Tab order, focus management, arrow keys
- ARIA labels: All interactive elements have accessible names
- Color contrast: WCAG AA compliant (4.5:1 for text)
- Focus indicators: Visible focus styles (TailwindCSS defaults)
- Screen reader: Semantic HTML, proper heading hierarchy

---

## Documentation

Template includes:

- **README.md**: Setup instructions, build commands, project structure
- **Inline comments**: Explain Chrome extension-specific patterns
- **Example code**: Each context has working examples
- **Type documentation**: JSDoc comments for public APIs

---

## Conclusion

All technology choices align with the constitution requirements and provide a solid foundation for building modern Chrome extensions. The template balances developer productivity (fast HMR, TypeScript, React) with performance requirements (code splitting, bundle analysis, CSP compliance).

**Next Phase**: Phase 1 - Design & Contracts (data-model.md, contracts/, quickstart.md)
