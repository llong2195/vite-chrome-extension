#!/usr/bin/env node
/**
 * Bundle size checker
 * Validates that production bundles meet size requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIMITS = {
  background: 200 * 1024, // 200KB
  content: 100 * 1024, // 100KB
  popup: 150 * 1024, // 150KB
  options: 150 * 1024, // 150KB
};

function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath);
  const gzipped = zlib.gzipSync(content);
  return gzipped.length;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function checkBundleSize() {
  const distDir = path.join(__dirname, '..', 'dist');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('\n📦 Bundle Size Check\n');
  console.log('Checking gzipped bundle sizes against limits...\n');

  let allPassed = true;

  // Check background.js
  const backgroundPath = path.join(distDir, 'background.js');
  if (fs.existsSync(backgroundPath)) {
    const size = getGzipSize(backgroundPath);
    const limit = LIMITS.background;
    const passed = size <= limit;
    allPassed = allPassed && passed;

    console.log(
      `${passed ? '✓' : '✗'} background.js: ${formatBytes(size)} / ${formatBytes(limit)} ${passed ? 'PASS' : 'FAIL'}`
    );
  }

  // Check content.js
  const contentPath = path.join(distDir, 'content.js');
  if (fs.existsSync(contentPath)) {
    const size = getGzipSize(contentPath);
    const limit = LIMITS.content;
    const passed = size <= limit;
    allPassed = allPassed && passed;

    console.log(
      `${passed ? '✓' : '✗'} content.js: ${formatBytes(size)} / ${formatBytes(limit)} ${passed ? 'PASS' : 'FAIL'}`
    );
  }

  // Check popup bundle
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    const popupFiles = fs
      .readdirSync(assetsDir)
      .filter((f) => f.startsWith('popup-') && f.endsWith('.js'));
    if (popupFiles.length > 0) {
      const size = getGzipSize(path.join(assetsDir, popupFiles[0]));
      const limit = LIMITS.popup;
      const passed = size <= limit;
      allPassed = allPassed && passed;

      console.log(
        `${passed ? '✓' : '✗'} popup bundle: ${formatBytes(size)} / ${formatBytes(limit)} ${passed ? 'PASS' : 'FAIL'}`
      );
    }

    // Check options bundle
    const optionsFiles = fs
      .readdirSync(assetsDir)
      .filter((f) => f.startsWith('options-') && f.endsWith('.js'));
    if (optionsFiles.length > 0) {
      const size = getGzipSize(path.join(assetsDir, optionsFiles[0]));
      const limit = LIMITS.options;
      const passed = size <= limit;
      allPassed = allPassed && passed;

      console.log(
        `${passed ? '✓' : '✗'} options bundle: ${formatBytes(size)} / ${formatBytes(limit)} ${passed ? 'PASS' : 'FAIL'}`
      );
    }
  }

  console.log(
    '\n' +
      (allPassed ? '✓ All bundles within size limits!' : '✗ Some bundles exceed size limits!') +
      '\n'
  );

  process.exit(allPassed ? 0 : 1);
}

checkBundleSize();
