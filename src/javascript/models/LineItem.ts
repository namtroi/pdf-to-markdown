import { PageItem } from './PageItem';
import { Word } from './Word';
import type { BlockTypeValue } from './markdown/BlockType';
import type { Annotation } from './Annotation';
import type { ParsedElements } from './PageItem';

// A line within a page
export class LineItem extends PageItem {
  x: number;
  y: number;
  width: number;
  height: number;
  words: Word[];

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

  text(): string {
    return this.wordStrings().join(' ');
  }

  wordStrings(): string[] {
    return this.words.map((word: Word) => word.string);
  }
}
