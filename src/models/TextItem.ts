import { PageItem } from './PageItem';
import type { BlockTypeValue } from './markdown/BlockType';
import type { WordFormatValue } from './markdown/WordFormat';
import type { Annotation } from './Annotation';
import type { ParsedElements } from './PageItem';

/**
 * Raw text fragment from PDF.js extraction.
 * Represents single word/phrase with positioning and font metadata.
 * Later grouped into LineItems by y-coordinate proximity.
 */
export class TextItem extends PageItem {
  /** Left edge x-coordinate */
  x: number;
  /** Top edge y-coordinate */
  y: number;
  /** Item width */
  width: number;
  /** Item height (font size) */
  height: number;
  /** Text content */
  text: string;
  /** Font ID from PDF.js */
  font: string;
  /** Markdown format for entire line (bold, italic, etc) */
  lineFormat?: WordFormatValue;
  /** Format that starts mid-line (opening tag missing) */
  unopenedFormat?: WordFormatValue;
  /** Format continuing to next line (closing tag missing) */
  unclosedFormat?: WordFormatValue;

  /**
   * Creates text item from PDF.js extraction data.
   *
   * @param options - Configuration object
   * @param options.x - Left x-coordinate
   * @param options.y - Top y-coordinate
   * @param options.width - Item width
   * @param options.height - Item height (font size)
   * @param options.text - Text content
   * @param options.font - Font ID
   * @param options.type - Optional block type
   * @param options.annotation - Optional annotation
   * @param options.parsedElements - Optional parsed markdown elements
   * @param options.lineFormat - Optional line-level formatting
   * @param options.unopenedFormat - Optional format starting mid-line
   * @param options.unclosedFormat - Optional format continuing to next line
   */
  constructor(options: {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    font: string;
    type?: BlockTypeValue;
    annotation?: Annotation;
    parsedElements?: ParsedElements;
    lineFormat?: WordFormatValue;
    unopenedFormat?: WordFormatValue;
    unclosedFormat?: WordFormatValue;
  }) {
    super(options);
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.text = options.text;
    this.font = options.font;
    this.lineFormat = options.lineFormat;
    this.unopenedFormat = options.unopenedFormat;
    this.unclosedFormat = options.unclosedFormat;
  }
}
