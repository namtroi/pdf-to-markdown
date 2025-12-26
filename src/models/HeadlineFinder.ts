import { normalizedCharCodeArray } from '../utils/stringFunctions';
import { LineItem } from './LineItem';

/**
 * Finds headlines that match TOC entries across multiple lines.
 * Uses character-by-character matching with normalization (case-insensitive,
 * ignores whitespace/dots). Accumulates partial matches across lines.
 *
 * @example
 * // TOC entry: "Introduction"
 * // Line 1: "Intro-"
 * // Line 2: "duction"
 * // HeadlineFinder will match both lines as single headline
 */
export class HeadlineFinder {
  /** Normalized char codes of target headline from TOC */
  headlineCharCodes: number[];
  /** Line items accumulated during partial match */
  stackedLineItems: LineItem[];
  /** Number of chars matched so far */
  stackedChars: number;

  /**
   * Creates headline finder for specific TOC entry.
   *
   * @param options - Configuration object
   * @param options.headline - Target headline text from TOC
   */
  constructor(options: { headline: string }) {
    this.headlineCharCodes = normalizedCharCodeArray(options.headline);
    this.stackedLineItems = [];
    this.stackedChars = 0;
  }

  /**
   * Tests if lineItem continues/completes the headline match.
   * Accumulates matches across multiple lines. Resets on mismatch.
   *
   * @param lineItem - Current line to test
   * @returns Array of matched lines if complete match, null if incomplete/no match
   */
  consume(lineItem: LineItem): LineItem[] | null {
    //TODO avoid join
    const normalizedCharCodes = normalizedCharCodeArray(lineItem.text());
    const matchAll = this.matchAll(normalizedCharCodes);
    if (matchAll) {
      this.stackedLineItems.push(lineItem);
      this.stackedChars += normalizedCharCodes.length;
      if (this.stackedChars === this.headlineCharCodes.length) {
        return this.stackedLineItems;
      }
    } else {
      if (this.stackedChars > 0) {
        this.stackedChars = 0;
        this.stackedLineItems = [];
        this.consume(lineItem); // test again without stack
      }
    }
    return null;
  }

  /**
   * Checks if normalizedCharCodes continue the headline match from current position.
   *
   * @param normalizedCharCodes - Character codes from current line
   * @returns true if all chars match continuation of headline
   */
  private matchAll(normalizedCharCodes: number[]): boolean {
    for (let i = 0; i < normalizedCharCodes.length; i++) {
      const headlineChar = this.headlineCharCodes[this.stackedChars + i];
      const textItemChar = normalizedCharCodes[i];
      if (textItemChar !== headlineChar) {
        return false;
      }
    }
    return true;
  }
}
