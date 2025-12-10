/**
 * Content Script
 * Runs in the context of web pages
 */

console.log('Content script loaded');

// Simple example: Add a border to the page
function highlightPage(): void {
  document.body.style.outline = '2px solid #3b82f6';
  document.body.style.outlineOffset = '-2px';

  // Remove after 2 seconds
  setTimeout(() => {
    document.body.style.outline = '';
    document.body.style.outlineOffset = '';
  }, 2000);
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightPage);
} else {
  highlightPage();
}

// Export for testing
export { highlightPage };
