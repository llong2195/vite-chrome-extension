# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-10

### Added

**Core Infrastructure**

- Initial release of Vite Chrome Extension Template
- Vite 5+ build system with hot module replacement (<3s rebuild)
- React 19 with TypeScript 5+ (strict mode)
- Tailwind CSS v4 with @tailwindcss/postcss plugin
- Manifest V3 compliance

**Extension Contexts**

- Background service worker with chrome.runtime event handlers
- Popup UI with React components and theme toggle
- Content scripts with DOM manipulation utilities
- Options page with complete settings management

**Features**

- Settings persistence using chrome.storage.sync (cross-device sync)
- State management using chrome.storage.local
- Message passing protocol with 8 message types
- Theme selector (light/dark/system)
- Notification toggles and auto-sync settings
- Chrome alarms API example for periodic tasks

**Developer Experience**

- Complete TypeScript types with @types/chrome
- ESLint + Prettier configuration
- Vitest testing framework with Chrome API mocks
- Bundle size checker with automated thresholds
- Bundle analyzer (npm run build:analyze)
- Comprehensive README with troubleshooting guide

**Testing**

- Unit tests for message handler (14 tests)
- Unit tests for storage manager (12 tests)
- Integration tests for messaging (8 tests)
- Chrome API mocks for all contexts

**Performance**

- Bundle sizes well under limits:
  - Background: 1.6KB gzipped (limit: 200KB)
  - Content: 1.3KB gzipped (limit: 100KB)
  - Popup: 1.4KB gzipped (limit: 150KB)
  - Options: 2.5KB gzipped (limit: 150KB)
- Extension load time: <100ms
- Content script injection: <50ms
- Dev rebuild: ~3s
- Production build: ~3.5s

**Documentation**

- Complete README with setup instructions
- Architecture documentation
- Troubleshooting guide
- Chrome Web Store submission guide
- API documentation for all shared utilities

### Security

- Content Security Policy (CSP) compliant
- No inline scripts or eval usage
- Minimum required permissions
- Storage data validation with Zod schemas

---

## Future Releases

### [1.1.0] - Planned

- Internationalization (i18n) support
- Additional theme options
- Enhanced keyboard navigation
- More example patterns

### [1.2.0] - Planned

- React DevTools integration guide
- Performance monitoring utilities
- Advanced error tracking
- CI/CD pipeline examples

---

**Template Maintainers**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

**License**: MIT - see [LICENSE](./LICENSE) file for details.
