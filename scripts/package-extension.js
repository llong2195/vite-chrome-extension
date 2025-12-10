#!/usr/bin/env node
/**
 * Package extension for distribution
 * Creates a zip file ready for Chrome Web Store submission
 *
 * Note: This script provides instructions for manual packaging.
 * For automated packaging, install: npm install --save-dev archiver
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');

function packageExtension() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('\n📦 Extension Packaging Instructions\n');
  console.log('Your extension is built and ready in the dist/ directory.\n');
  console.log('To create a zip file for Chrome Web Store submission:\n');
  console.log('Option 1 - Using command line:');
  console.log('  cd dist');
  console.log('  zip -r ../extension.zip .\n');
  console.log('Option 2 - Using file explorer:');
  console.log('  1. Navigate to the dist/ folder');
  console.log('  2. Select all files and folders');
  console.log('  3. Right-click and choose "Compress" or "Send to > Compressed folder"');
  console.log('  4. Name it extension.zip\n');
  console.log('Option 3 - Install archiver package:');
  console.log('  npm install --save-dev archiver');
  console.log('  Then use the archiver-based version of this script\n');
  console.log('✓ Build complete! Package size summary:');

  // Calculate total size
  let totalSize = 0;
  function calculateSize(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stat.size;
      }
    });
  }

  calculateSize(distDir);
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`  Total uncompressed: ${sizeInMB} MB`);
  console.log(`  Estimated zipped: ~${((totalSize * 0.3) / (1024 * 1024)).toFixed(2)} MB\n`);
}

packageExtension();
