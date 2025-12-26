import type { WordTypeValue } from './markdown/WordType';
import type { WordFormatValue } from './markdown/WordFormat';

/**
 * Single word within a LineItem.
 * Carries word content plus optional markdown formatting/type.
 * Used to preserve word-level formatting through transformation pipeline.
 */
export class Word {
  /** Word text content */
  string: string;
  /** Word type (LINK, FOOTNOTE, etc) */
  type?: WordTypeValue | null;
  /** Word format (BOLD, ITALIC, BOLD_OBLIQUE) */
  format?: WordFormatValue | null;

  /**
   * Creates word with optional type/format metadata.
   *
   * @param options - Configuration object
   * @param options.string - Word text
   * @param options.type - Optional word type for special handling
   * @param options.format - Optional markdown format
   */
  constructor(options: { string: string; type?: WordTypeValue | null; format?: WordFormatValue | null }) {
    this.string = options.string;
    this.type = options.type;
    this.format = options.format;
  }
}
