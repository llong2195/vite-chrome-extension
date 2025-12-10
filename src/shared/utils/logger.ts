/**
 * Logger utility with configurable log levels
 * Provides structured logging for Chrome extension contexts
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LogConfig {
  level: LogLevel;
  prefix: string;
  timestamp: boolean;
  context: string;
}

class Logger {
  private config: LogConfig = {
    level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
    prefix: '[Extension]',
    timestamp: true,
    context: 'unknown',
  };

  /**
   * Configure the logger
   */
  configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set the log level threshold
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Set the context for log messages
   */
  setContext(context: string): void {
    this.config.context = context;
  }

  /**
   * Format log message with timestamp and context
   */
  private format(level: string, ...args: unknown[]): unknown[] {
    const parts: string[] = [this.config.prefix];

    if (this.config.timestamp) {
      const now = new Date();
      const time = now.toISOString().split('T')[1].split('.')[0];
      parts.push(`[${time}]`);
    }

    parts.push(`[${level}]`);

    if (this.config.context) {
      parts.push(`[${this.config.context}]`);
    }

    return [parts.join(' '), ...args];
  }

  /**
   * Log debug messages (only in development or when explicitly enabled)
   */
  debug(...args: unknown[]): void {
    if (this.config.level <= LogLevel.DEBUG) {
      console.debug(...this.format('DEBUG', ...args));
    }
  }

  /**
   * Log informational messages
   */
  info(...args: unknown[]): void {
    if (this.config.level <= LogLevel.INFO) {
      console.info(...this.format('INFO', ...args));
    }
  }

  /**
   * Log warning messages
   */
  warn(...args: unknown[]): void {
    if (this.config.level <= LogLevel.WARN) {
      console.warn(...this.format('WARN', ...args));
    }
  }

  /**
   * Log error messages
   */
  error(...args: unknown[]): void {
    if (this.config.level <= LogLevel.ERROR) {
      console.error(...this.format('ERROR', ...args));
    }
  }

  /**
   * Log with a custom level
   */
  log(level: LogLevel, ...args: unknown[]): void {
    switch (level) {
      case LogLevel.DEBUG:
        this.debug(...args);
        break;
      case LogLevel.INFO:
        this.info(...args);
        break;
      case LogLevel.WARN:
        this.warn(...args);
        break;
      case LogLevel.ERROR:
        this.error(...args);
        break;
    }
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): Logger {
    const childLogger = new Logger();
    childLogger.configure({ ...this.config, context });
    return childLogger;
  }

  /**
   * Group related log messages
   */
  group(label: string, collapsed = false): void {
    if (this.config.level <= LogLevel.DEBUG) {
      if (collapsed) {
        console.groupCollapsed(...this.format('GROUP', label));
      } else {
        console.group(...this.format('GROUP', label));
      }
    }
  }

  /**
   * End a log group
   */
  groupEnd(): void {
    if (this.config.level <= LogLevel.DEBUG) {
      console.groupEnd();
    }
  }

  /**
   * Log an object or value with a label
   */
  table(data: unknown, label?: string): void {
    if (this.config.level <= LogLevel.DEBUG) {
      if (label) {
        console.log(...this.format('TABLE', label));
      }
      console.table(data);
    }
  }

  /**
   * Start a performance timer
   */
  time(label: string): void {
    if (this.config.level <= LogLevel.DEBUG) {
      console.time(`${this.config.prefix} [${this.config.context}] ${label}`);
    }
  }

  /**
   * End a performance timer
   */
  timeEnd(label: string): void {
    if (this.config.level <= LogLevel.DEBUG) {
      console.timeEnd(
        `${this.config.prefix} [${this.config.context}] ${label}`,
      );
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export context-specific loggers
export const backgroundLogger = logger.child('Background');
export const contentLogger = logger.child('Content');
export const popupLogger = logger.child('Popup');
export const optionsLogger = logger.child('Options');

// Export for custom contexts
export { Logger };

// Usage examples:
//
// // Basic logging
// logger.info('Extension initialized');
// logger.warn('Storage quota at 80%');
// logger.error('Failed to fetch data', error);
//
// // Context-specific logging
// backgroundLogger.info('Service worker started');
// contentLogger.debug('DOM mutation observed');
// popupLogger.info('Popup opened');
//
// // Performance tracking
// logger.time('data-fetch');
// await fetchData();
// logger.timeEnd('data-fetch');
//
// // Grouped logs
// logger.group('Processing items');
// items.forEach(item => logger.debug('Processing', item));
// logger.groupEnd();
//
// // Configuration
// logger.setLevel(LogLevel.WARN); // Only show warnings and errors
// logger.configure({ prefix: '[MyExtension]', timestamp: false });
