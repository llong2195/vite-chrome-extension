/**
 * DOM Utilities for Content Scripts
 * Helper functions for safely manipulating the page DOM
 */

/**
 * Add a visual indicator to the page
 */
export function addPageIndicator(message: string, duration: number = 2000): void {
  const indicator = document.createElement('div');
  indicator.textContent = message;
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3b82f6;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(indicator);

  setTimeout(() => {
    indicator.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      indicator.remove();
      style.remove();
    }, 300);
  }, duration);
}

/**
 * Get page metadata
 */
export function getPageMetadata(): {
  title: string;
  url: string;
  description: string;
  keywords: string[];
  headings: string[];
} {
  const metaDescription =
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content || '';
  const metaKeywords =
    document.querySelector<HTMLMetaElement>('meta[name="keywords"]')?.content || '';

  const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
    .map((h) => h.textContent?.trim())
    .filter(Boolean) as string[];

  return {
    title: document.title,
    url: window.location.href,
    description: metaDescription,
    keywords: metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean),
    headings: headings.slice(0, 10), // Limit to first 10
  };
}

/**
 * Highlight elements matching a selector
 */
export function highlightElements(
  selector: string,
  color: string = '#3b82f6',
  duration: number = 2000
): number {
  const elements = document.querySelectorAll(selector);
  const originalStyles = new Map<Element, string>();

  elements.forEach((el) => {
    if (el instanceof HTMLElement) {
      originalStyles.set(el, el.style.outline);
      el.style.outline = `2px solid ${color}`;
      el.style.outlineOffset = '2px';
    }
  });

  setTimeout(() => {
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.outline = originalStyles.get(el) || '';
        el.style.outlineOffset = '';
      }
    });
  }, duration);

  return elements.length;
}

/**
 * Count elements by selector
 */
export function countElements(selector: string): number {
  return document.querySelectorAll(selector).length;
}

/**
 * Check if page has loaded completely
 */
export function isPageReady(): boolean {
  return document.readyState === 'complete';
}

/**
 * Wait for DOM to be ready
 */
export function waitForDOMReady(): Promise<void> {
  return new Promise((resolve) => {
    if (isPageReady()) {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve());
    }
  });
}
