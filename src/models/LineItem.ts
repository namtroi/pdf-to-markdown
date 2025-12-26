import { PageItem } from './PageItem';
import { Word } from './Word';
import type { BlockTypeValue } from './markdown/BlockType';
import type { Annotation } from './Annotation';
import type { ParsedElements } from './PageItem';

/**
 * Single line of text within a page.
 * Created by grouping TextItems with similar y-coordinates.
 * Contains words with positioning/formatting metadata.
 */
export class LineItem extends PageItem {
  /** Left edge x-coordinate */
  x: number;
  /** Top edge y-coordinate (PDF uses bottom-up coordinates) */
  y: number;
  /** Line width */
  width: number;
  /** Line height (font size) */
  height: number;
  /** Words in reading order with formatting */
  words: Word[];

  /**
   * Creates line item from words or text string.
   * If text provided without words, splits on whitespace.
   *
   * @param options - Configuration object
   * @param options.x - Left x-coordinate
   * @param options.y - Top y-coordinate
   * @param options.width - Line width
   * @param options.height - Line height
   * @param options.words - Optional word array
   * @param options.text - Optional text (converted to words if words not provided)
   * @param options.type - Optional block type (H1, LIST, CODE, etc)
   * @param options.annotation - Optional annotation (DETECTED, REMOVED, etc)
   * @param options.parsedElements - Optional parsed markdown elements
   */
  constructor(options: {
    x: number;
    y: number;
    width: number;
    height: number;
    words?: Word[];
    text?: string;
    type?: BlockTypeValue;
    annotation?: Annotation;
    parsedElements?: ParsedElements;
  }) {
    super(options);
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.words = options.words || [];
    if (options.text && !options.words) {
      this.words = options.text
        .split(' ')
        .filter((string: string) => string.trim().length > 0)
        .map((wordAsString: string) => new Word({ string: wordAsString }));
    }
  }

  /**
   * Joins words with spaces to form line text.
   *
   * @returns Line text as single string
   */
  text(): string {
    return this.wordStrings().join(' ');
  }

  /**
   * Extracts word strings from Word objects.
   *
   * @returns Array of word strings
   */
  wordStrings(): string[] {
    return this.words.map((word: Word) => word.string);
  }
}
