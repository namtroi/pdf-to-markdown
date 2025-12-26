import { PageItem } from './PageItem';
import type { BlockTypeValue } from './markdown/BlockType';
import type { WordFormatValue } from './markdown/WordFormat';
import type { Annotation } from './Annotation';
import type { ParsedElements } from './PageItem';

// A text item, i.e. a line or a word within a page
export class TextItem extends PageItem {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  font: string;
  lineFormat?: WordFormatValue;
  unopenedFormat?: WordFormatValue;
  unclosedFormat?: WordFormatValue;

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
