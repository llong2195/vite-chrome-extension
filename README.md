# Vite Chrome Extension Template

A production-ready Chrome extension template built with Vite, React, and TypeScript. This template provides a complete starting point for building Manifest V3 extensions with modern tooling, hot module replacement, and comprehensive TypeScript configuration.

## Features

- ⚡️ **Vite 5+** - Lightning-fast dev builds with HMR (<3s rebuild time)
- ⚛️ **React 19** - Latest React with hooks and TypeScript
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS with native CSS features and dark mode support
- 🧩 **shadcn/ui** - Accessible React components built on Radix UI primitives
- 📦 **Manifest V3** - Latest Chrome Extension API
- 🔒 **TypeScript Strict Mode** - Type safety throughout
- ✅ **Vitest** - Fast unit testing with Chrome API mocks
- 🎯 **ESLint + Prettier** - Code quality and formatting
- 📊 **Bundle Analyzer** - Track and optimize bundle sizes

## Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher ([download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **Chrome** browser (or any Chromium-based browser: Edge, Brave)
- **Code editor** (VS Code recommended)

Check your versions:

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

### Installation

```bash
# 1. Clone or download the template
git clone <repository-url>
cd vite-chrome-extension

# 2. Install dependencies (~30-60 seconds)
npm install

# 3. Start development build with HMR
npm run dev
```

Keep the terminal running - it watches for file changes and rebuilds automatically (<3s rebuild time).

### Load Extension in Chrome

1. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" switch in top-right corner

3. **Load the extension**:
   - Click "Load unpacked" button
   - Navigate to your project's `dist/` directory
   - Click "Select Folder"

4. **Verify installation**:
   - Extension appears in extensions list with green "Enabled" status
   - Extension icon visible in Chrome toolbar (click puzzle icon to pin it)

### Test the Extension

**Popup UI**:

- Click the extension icon in Chrome toolbar
- Popup window opens showing extension name, version, and UI components
- Try the theme toggle and other interactive elements

**Content Script**:

- Navigate to any webpage (e.g., `https://example.com`)
- Open Chrome DevTools (F12) → Console tab
- Look for `[Extension] Content script initialized` log

**Options Page**:

- Right-click extension icon → Select "Options"
- Options page opens in new tab with settings UI

**Background Service Worker**:

- Go to `chrome://extensions/`
- Click "service worker" link under your extension
- DevTools console shows `Background service worker initialized`

### Development Commands

```bash
# Development build with watch mode
npm run dev

# Production build (optimized and minified)
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Analyze bundle sizes
npm run build:analyze
```

### Hot Module Replacement (HMR)

The template includes HMR for instant updates during development:

1. Make a change to any file (e.g., edit `src/popup/App.tsx`)
2. Save the file
3. Vite rebuilds in <3 seconds
4. **Refresh the extension context**:
   - Popup: Close and reopen the popup
   - Content script: Reload the webpage
   - Background: Click "Reload" on `chrome://extensions/`
   - Options: Refresh the options page tab

**Note**: Chrome doesn't support true HMR for extensions, so manual refresh is required after rebuild.

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
- **UI Components**: shadcn/ui (Radix UI primitives with Tailwind)
- **Testing**: Vitest with happy-dom
- **Validation**: Zod for runtime type checking
- **Linting**: ESLint with TypeScript, React, and accessibility plugins
- **Formatting**: Prettier

## UI Components (shadcn/ui)

This template uses [shadcn/ui](https://ui.shadcn.com/) for accessible, customizable React components built on Radix UI primitives.

### Available Components

Pre-installed components in `src/components/ui/`:

- **Button** - Buttons with variants (default, secondary, outline, ghost)
- **Card** - Container component for grouping content
- **Switch** - Toggle switch for boolean settings
- **Select** - Dropdown select with keyboard navigation
- **Sonner** - Toast notifications (using sonner library)

### Adding New Components

```bash
# Add individual components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form

# List all available components
npx shadcn@latest add
```

### Component Usage

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

function MyComponent() {
  return (
    <Card>
      <Button variant="default">Click me</Button>
      <Switch
        checked={true}
        onCheckedChange={(checked) => console.log(checked)}
      />
    </Card>
  );
}
```

### Theme System

The template includes automatic dark mode support:

- **Light mode**: Default theme with high contrast
- **Dark mode**: Activated via `.dark` class on root element
- **System mode**: Follows OS preference using `prefers-color-scheme`

Theme is managed in `src/shared/utils/themeManager.ts` and automatically syncs across popup, options, and content scripts.

## Architecture & Message Passing

The extension uses Chrome's message passing API for cross-context communication:

### Message Types

- `GET_SETTINGS` - Retrieve current settings from storage
- `UPDATE_SETTINGS` - Update settings and sync across contexts
- `GET_STATE` - Retrieve runtime state
- `UPDATE_STATE` - Update runtime state
- `EXECUTE_ACTION` - Trigger background actions (sync-data, clear-cache, export-data)
- `TAB_DATA` - Send page metadata from content script to background
- `NOTIFY` - Display notifications
- `SETTINGS_UPDATED` - Broadcast settings changes to all contexts

### Example: Popup → Background Communication

```typescript
// In popup/App.tsx
import { createGetSettingsMessage } from '@shared/utils/messageValidator';

async function loadSettings() {
  const message = createGetSettingsMessage();
  const response = await chrome.runtime.sendMessage(message);

  if (response.success) {
    console.log('Settings:', response.data);
  }
}
```

### Example: Content Script → Background Communication

```typescript
// In content/index.ts
import { createTabDataMessage } from '@shared/utils/messageValidator';

async function sendPageInfo() {
  const message = createTabDataMessage({
    tabId: 1,
    url: window.location.href,
    title: document.title,
    isProcessed: true,
  });

  await chrome.runtime.sendMessage(message);
}
```

## Storage

The extension uses two storage areas:

- **chrome.storage.sync** - User settings (synced across devices, 100KB limit)
- **chrome.storage.local** - Runtime state (device-specific, 10MB limit)

Storage includes versioning and automatic migrations for schema changes.

## Customization

### Adding New Components

```bash
# Popup component
src/popup/components/MyComponent.tsx

# Options component
src/options/components/MyComponent.tsx

# Shared component
src/shared/components/MyComponent.tsx
```

### Adding New Message Types

1. Add type to `src/shared/types/messages.ts`:

```typescript
export const MyMessageSchema = BaseMessageSchema.extend({
  type: z.literal('MY_MESSAGE'),
  payload: z.object({
    data: z.string(),
  }),
});
```

2. Add to discriminated union in `MessageSchema`
3. Add handler in `src/background/messageHandler.ts`
4. Create helper in `src/shared/utils/messageValidator.ts`

### Modifying Settings Schema

Edit `src/shared/types/settings.ts`:

```typescript
export const SettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.boolean(),
  autoSync: z.boolean(),
  language: z.string(),
  myNewSetting: z.string().default('value'), // Add new field
});
```

Update storage version in `src/background/storageManager.ts` and add migration.

## Troubleshooting

### Build Errors

**Problem**: TypeScript errors during build
**Solution**: Run `npm run type-check` to see all type errors. Fix them or temporarily disable strict mode in `tsconfig.json` (not recommended).

**Problem**: "Cannot find module" errors
**Solution**: Check path aliases in `tsconfig.json` and `vite.config.ts` match. Restart VS Code TypeScript server.

**Problem**: Build takes >3 seconds
**Solution**: Run `npm run build:analyze` to identify large dependencies. Consider code splitting or lazy loading.

### Extension Loading Errors

**Problem**: "Manifest file is missing or unreadable"
**Solution**: Ensure you selected the `dist/` folder, not the project root. Verify `dist/manifest.json` exists.

**Problem**: "Service worker registration failed"
**Solution**: Check background script console for errors. Ensure no syntax errors in `src/background/index.ts`.

**Problem**: Content script not injecting
**Solution**: Check `matches` pattern in `manifest.json`. Reload the extension and refresh the webpage.

### Runtime Errors

**Problem**: "Extension context invalidated"
**Solution**: This happens when reloading the extension. Reload affected pages and reopen popup/options.

**Problem**: Storage quota exceeded
**Solution**: Chrome storage limits are 100KB (sync) and 10MB (local). Reduce stored data or use chrome.storage.local.

**Problem**: Messages not received
**Solution**: Ensure message type is in `MessageSchema`. Check sender/receiver context is correct. Verify `chrome.runtime.onMessage` listener is registered.

## Performance Tips

- **Bundle Sizes**: Run `npm run build:analyze` regularly to track bundle growth
- **Memory Usage**: Check Chrome Task Manager (Shift+Esc) to monitor memory footprint
- **React Rendering**: Use React DevTools Profiler to identify slow components
- **Background Worker**: Keep initialization minimal - service worker may be terminated after 30s inactivity
- **Content Scripts**: Inject only on necessary pages using specific `matches` patterns

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm test -- --watch

# Run with UI
npm run test:ui

# Run specific test file
npm test -- messageHandler.test.ts

# Run with coverage
npm test -- --coverage
```

### Integration Tests

Tests use mocked Chrome APIs (see `tests/setup/chromeApiMocks.ts`). To test with real Chrome APIs, load the extension in Chrome and test manually.

### Manual Testing Checklist

- [ ] Load extension in Chrome without errors
- [ ] Popup opens and displays correctly
- [ ] Theme toggle works (light/dark mode)
- [ ] Options page opens and saves settings
- [ ] Content script injects on web pages
- [ ] Background service worker initializes
- [ ] Message passing works between all contexts
- [ ] Settings persist across browser restarts
- [ ] Extension works in Incognito mode (if permission granted)
- [ ] No console errors in any context

## Production Build

### Building for Production

```bash
# Create optimized production build
npm run build

# Verify bundle sizes
npm run build:analyze
```

**Build outputs** (in `dist/`):

- `background.js` - Background service worker
- `content.js` - Content script
- `popup/` - Popup UI assets
- `options/` - Options page assets
- `manifest.json` - Extension manifest

**Bundle size limits** (gzipped):

- Background: <200KB ✓
- Content: <100KB ✓
- Popup: <150KB ✓

### Chrome Web Store Submission

1. **Prepare manifest**:
   - Update version in `public/manifest.json`
   - Add description, icons, screenshots
   - Set homepage_url and update_url

2. **Create distribution package**:

   ```bash
   npm run build
   cd dist
   zip -r ../extension.zip .
   ```

3. **Submit to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload `extension.zip`
   - Fill in store listing details
   - Submit for review

4. **Review checklist**:
   - [ ] All permissions justified
   - [ ] Privacy policy provided (if collecting data)
   - [ ] Screenshots and promotional images added
   - [ ] Tested on Chrome, Edge, Brave
   - [ ] No console errors or warnings

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT

---

**Built with ❤️ using Vite, React, and TypeScript**
