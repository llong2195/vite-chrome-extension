# Quickstart Guide: Vite Chrome Extension Template

**Feature**: 001-vite-extension-template  
**Date**: 2025-12-10  
**For**: Developers building Chrome extensions

## Overview

This guide will get you up and running with the Vite Chrome Extension template in under 5 minutes. You'll learn how to set up the development environment, make your first changes, and load the extension into Chrome.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher ([download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **Chrome** browser (or any Chromium-based browser: Edge, Brave)
- **Code editor** (VS Code recommended)
- **Git** (optional, for version control)

**Check your versions**:

```bash
node --version  # Should be v18+
npm --version   # Should be v9+
```

---

## Step 1: Install Dependencies

Clone or download the template and install dependencies:

```bash
# If using Git
git clone <repository-url>
cd vite-chrome-extension

# Install dependencies
npm install
```

**What gets installed**:

- Vite 5+ (build tool)
- React 18+ (UI framework)
- TypeScript 5+ (type safety)
- TailwindCSS (styling)
- Vitest (testing)
- Zod (validation)
- ESLint + Prettier (code quality)

**Installation time**: ~30-60 seconds

---

## Step 2: Start Development Build

Start the development server with hot module replacement:

```bash
npm run dev
```

**What happens**:

- Vite compiles TypeScript to JavaScript
- Separate bundles created for background, content, popup, options
- Source maps generated for debugging
- Watch mode enabled - changes trigger automatic rebuild
- Output written to `dist/` directory

**Expected output**:

```
vite v5.x.x building for production...
✓ built in 2.8s
watching for file changes...
```

**Build time**: <3 seconds (first build may take longer)

**Keep this terminal running** - it watches for file changes and rebuilds automatically.

---

## Step 3: Load Extension in Chrome

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
   - Extension appears in extensions list
   - Extension icon visible in Chrome toolbar
   - Status shows "Enabled"

**Troubleshooting**:

- If icon doesn't appear: Click puzzle icon in toolbar → pin extension
- If errors shown: Check console for build errors, ensure `npm run dev` is running
- If manifest error: Ensure you selected `dist/` folder, not project root

---

## Step 4: Test the Extension

### Test the Popup

1. Click the extension icon in Chrome toolbar
2. Popup window opens showing the extension UI
3. Try interacting with the popup (buttons, inputs, etc.)

**What you should see**:

- Extension name and version
- Example UI components
- Working buttons and interactions
- Theme toggle (light/dark mode)

### Test Content Script

1. Navigate to any webpage (e.g., `https://example.com`)
2. Open Chrome DevTools (F12)
3. Check Console tab for content script log

**What you should see**:

```
[Vite Extension] Content script loaded
```

### Test Options Page

1. Right-click extension icon
2. Select "Options"
3. Options page opens in new tab

**What you should see**:

- Settings page with configuration options
- Working form inputs
- Save button functionality

### Test Background Worker

1. Go to `chrome://extensions/`
2. Find your extension
3. Click "service worker" link (under "Inspect views")
4. DevTools opens for background script

**What you should see**:

- Console logs from background worker
- No errors in console

---

## Step 5: Make Your First Change

Let's modify the popup to see hot module replacement in action:

1. **Open** `src/popup/App.tsx` in your code editor

2. **Find** the main heading (around line 10):

   ```tsx
   <h1>Vite Extension Template</h1>
   ```

3. **Change** it to something else:

   ```tsx
   <h1>My Awesome Extension</h1>
   ```

4. **Save** the file (Ctrl+S / Cmd+S)

5. **Watch** the terminal - Vite rebuilds:

   ```
   ✓ built in 0.8s
   ```

6. **Refresh** the extension:

   - Go to `chrome://extensions/`
   - Click refresh icon on your extension
   - Or use keyboard shortcut: Ctrl+R while extension popup is focused

7. **Click** extension icon again

**Expected result**: Your change appears in the popup (< 3 seconds total)

---

## Project Structure Overview

```
vite-chrome-extension/
├── src/
│   ├── background/       # Background service worker
│   │   └── index.ts     # Entry point
│   ├── content/          # Content scripts (inject into pages)
│   │   └── index.ts     # Entry point
│   ├── popup/            # Popup UI (click extension icon)
│   │   ├── index.tsx    # Entry point
│   │   └── App.tsx      # Main component
│   ├── options/          # Options page (settings)
│   │   ├── index.tsx    # Entry point
│   │   └── OptionsApp.tsx
│   └── shared/           # Shared code
│       ├── types/       # TypeScript types
│       └── constants.ts # Constants
├── public/
│   └── manifest.json    # Extension manifest
├── dist/                 # Build output (load this in Chrome)
├── tests/                # Test files
├── package.json          # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.js   # TailwindCSS configuration
```

**Where to edit**:

- **Popup UI**: `src/popup/`
- **Background logic**: `src/background/`
- **Content scripts**: `src/content/`
- **Settings page**: `src/options/`
- **Shared code**: `src/shared/`
- **Extension manifest**: `public/manifest.json`

---

## Available Scripts

### Development

```bash
# Start development build with watch mode
npm run dev

# Type check without building
npm run type-check
```

### Production

```bash
# Build optimized production bundle
npm run build

# Build output goes to dist/
# Ready to zip and upload to Chrome Web Store
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changing files
npm run format:check
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

---

## Common Tasks

### Add a New Popup Component

1. Create component file: `src/popup/components/MyComponent.tsx`

   ```tsx
   export function MyComponent() {
     return <div>Hello from MyComponent!</div>;
   }
   ```

2. Import in `src/popup/App.tsx`:

   ```tsx
   import { MyComponent } from "./components/MyComponent";

   export function App() {
     return (
       <div>
         <h1>My Extension</h1>
         <MyComponent />
       </div>
     );
   }
   ```

3. Save and extension auto-reloads

### Add Chrome API Interaction

Example: Read from Chrome storage in popup

```tsx
import { useEffect, useState } from "react";

export function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get("settings", (result) => {
      setSettings(result.settings);
    });
  }, []);

  return <div>Settings: {JSON.stringify(settings)}</div>;
}
```

### Send Message from Popup to Background

```tsx
// In popup
const response = await chrome.runtime.sendMessage({
  type: "GET_DATA",
  payload: { key: "value" },
});
console.log("Response:", response);

// In background (src/background/index.ts)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_DATA") {
    sendResponse({ data: "some data" });
  }
  return true; // Async response
});
```

### Add Content Script to Specific Sites

Edit `public/manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": ["https://github.com/*"],
      "js": ["content/index.js"],
      "run_at": "document_idle"
    }
  ]
}
```

---

## Debugging Tips

### Popup Not Opening

- **Check**: `npm run dev` is running
- **Check**: Extension enabled in `chrome://extensions/`
- **Check**: No errors in terminal
- **Try**: Reload extension (click refresh icon)

### Content Script Not Injecting

- **Check**: `matches` pattern in manifest.json
- **Check**: Console in DevTools on target webpage
- **Try**: Reload the webpage after extension reload

### Background Worker Errors

- **Find errors**: Click "service worker" link in `chrome://extensions/`
- **Check**: Console in background DevTools
- **Note**: Service workers restart when inactive (this is normal)

### Hot Reload Not Working

- **Check**: `npm run dev` terminal for errors
- **Check**: File saved successfully
- **Try**: Manual extension reload in Chrome
- **Note**: Some changes require full extension reload

### TypeScript Errors

- **Run**: `npm run type-check` to see all type errors
- **Fix**: Address type errors in code
- **Check**: VS Code shows inline type errors

---

## Next Steps

Now that you have the template running, you can:

1. **Read the documentation**:

   - `data-model.md` - Data structures and storage
   - `contracts/message-protocol.md` - Message passing between contexts
   - `research.md` - Technology choices and rationale

2. **Explore the code**:

   - Look at example components in `src/popup/`
   - Check message handling in `src/background/`
   - See DOM manipulation in `src/content/`

3. **Start building**:

   - Replace example code with your extension logic
   - Add new features following the existing patterns
   - Run tests to ensure code quality

4. **Customize**:
   - Update `public/manifest.json` (name, description, permissions)
   - Replace icon files in `src/assets/icons/`
   - Modify TailwindCSS theme in `tailwind.config.js`

---

## Getting Help

### Documentation

- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

### Common Issues

**"Manifest file is missing or unreadable"**
→ Ensure you loaded the `dist/` folder, not the project root

**"Cannot find module '@/shared/types'"**
→ Run `npm install` to ensure dependencies are installed

**"Extension service worker is not available"**
→ Service worker restarted (normal). Click "service worker" link to wake it up

**Build fails with TypeScript errors**
→ Run `npm run type-check` to see all errors, fix them in your code

---

## Summary

You've successfully:

- ✅ Installed dependencies
- ✅ Started development build
- ✅ Loaded extension in Chrome
- ✅ Tested all extension contexts
- ✅ Made your first code change
- ✅ Learned project structure
- ✅ Explored available scripts

**Next**: Start building your extension! The template provides a solid foundation with TypeScript, React, hot reloading, and all best practices baked in.

**Questions?** Check the documentation files in `specs/001-vite-extension-template/` for detailed technical information.

Happy building! 🚀
