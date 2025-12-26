import type { Page } from './Page';
import type { GlobalStats } from '../types/globals';

/**
 * Result of PDF parsing or transformation step.
 * Encapsulates document pages, global statistics, and debug messages.
 * Immutable pattern: Each transformation returns new ParseResult.
 */
export class ParseResult {
  /** Document pages with items at current transformation stage */
  pages: Page[];
  /** Global statistics (font sizes, spacing, TOC info) shared across transformations */
  globals?: GlobalStats;
  /** Debug messages for current transformation (visible in debug mode) */
  messages?: string[];

  /**
   * Creates parse result for transformation pipeline.
   *
   * @param options - Configuration object
   * @param options.pages - Pages with items
   * @param options.globals - Optional global stats from CalculateGlobalStats
   * @param options.messages - Optional debug messages
   */
  constructor(options: { pages: Page[]; globals?: GlobalStats; messages?: string[] }) {
    this.pages = options.pages;
    this.globals = options.globals;
    this.messages = options.messages;
  }
}
