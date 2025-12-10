# Vite Chrome Extension Template

A production-ready Chrome extension template built with Vite, React, and TypeScript. This template provides a complete starting point for building Manifest V3 extensions with modern tooling, hot module replacement, and comprehensive TypeScript configuration.

## Features

- ⚡️ **Vite 5+** - Lightning-fast dev builds with HMR (<3s rebuild time)
- ⚛️ **React 19** - Latest React with hooks and TypeScript
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS with native CSS features and dark mode support
- 📦 **Manifest V3** - Latest Chrome Extension API
- 🔒 **TypeScript Strict Mode** - Type safety throughout
- ✅ **Vitest** - Fast unit testing with Chrome API mocks
- 🎯 **ESLint + Prettier** - Code quality and formatting
- 📊 **Bundle Analyzer** - Track and optimize bundle sizes

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Chrome, Edge, or other Chromium-based browser

### Installation

```bash
# Install dependencies
npm install

# Start development build with HMR
npm run dev

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

### Development

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build

# Run tests
npm test

# Run tests with UI
npm test:ui

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Analyze bundle sizes
npm run build:analyze
```

## Project Structure

```
vite-chrome-extension/
├── src/
│   ├── background/          # Service worker background script
│   ├── content/             # Content scripts for web pages
│   ├── popup/               # Extension popup UI
│   │   ├── components/      # React components
│   │   └── hooks/           # Custom React hooks
│   ├── options/             # Extension options page
│   │   ├── components/      # React components
│   │   └── hooks/           # Custom React hooks
│   ├── shared/              # Shared utilities and types
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── storage/         # Storage helpers
│   └── assets/              # Icons, styles, images
├── public/                  # Static assets (manifest.json, icons)
├── tests/                   # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── setup/               # Test configuration
└── dist/                    # Build output (generated)
```

## Extension Contexts

This template includes all major Chrome extension contexts:

- **Popup** - UI shown when clicking the extension icon
- **Background** - Service worker for event handling and state management
- **Content Script** - Scripts injected into web pages
- **Options Page** - Settings and configuration UI

## Performance Targets

- Extension load: <100ms
- Content script injection: <50ms
- Dev rebuild: <3s
- Production build: <30s
- Bundle sizes (gzipped):
  - Background: <200KB
  - Content: <100KB
  - Popup: <150KB

## Tech Stack

- **Build Tool**: Vite 5+
- **Framework**: React 19 (latest)
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Testing**: Vitest with happy-dom
- **Validation**: Zod for runtime type checking
- **Linting**: ESLint with TypeScript, React, and accessibility plugins
- **Formatting**: Prettier

## License

MIT

---

**Note**: This template is ready for development. Follow the setup instructions above to get started!
