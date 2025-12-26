import type { PageItem } from './PageItem';

/**
 * Single page in PDF document.
 * Contains items that evolve through transformation pipeline:
 * TextItem -> LineItem -> LineItemBlock -> Markdown string.
 */
export class Page {
  /** 0-based page index in document */
  index: number;
  /** Page content (type changes per transformation stage) */
  items: PageItem[];

  /**
   * Creates page with optional items.
   *
   * @param options - Configuration object
   * @param options.index - 0-based page number
   * @param options.items - Optional page items (default: empty array)
   */
  constructor(options: { index: number; items?: PageItem[] }) {
    this.index = options.index;
    this.items = options.items || [];
  }
}
