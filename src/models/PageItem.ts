import type { BlockTypeValue } from './markdown/BlockType';
import type { Annotation } from './Annotation';

// A abstract PageItem class, can be TextItem, LineItem or LineItemBlock
export abstract class PageItem {
  type?: BlockTypeValue;
  annotation?: Annotation;
  parsedElements?: ParsedElements;

  constructor(options: { type?: BlockTypeValue; annotation?: Annotation; parsedElements?: ParsedElements }) {
    if (new.target === PageItem) {
      throw new TypeError('Can not construct abstract class.');
    }
    this.type = options.type;
    this.annotation = options.annotation;
    this.parsedElements = options.parsedElements;
  }
}

export class ParsedElements {
  footnoteLinks: (string | number)[];
  footnotes: (string | number)[];
  containLinks: boolean;
  formattedWords: number;

  constructor(options: {
    footnoteLinks?: (string | number)[];
    footnotes?: (string | number)[];
    containLinks?: boolean;
    formattedWords?: number;
  }) {
    this.footnoteLinks = options.footnoteLinks || [];
    this.footnotes = options.footnotes || [];
    this.containLinks = options.containLinks || false;
    this.formattedWords = options.formattedWords || 0;
  }

  add(parsedElements: ParsedElements): void {
    this.footnoteLinks = this.footnoteLinks.concat(parsedElements.footnoteLinks);
    this.footnotes = this.footnotes.concat(parsedElements.footnotes);
    this.containLinks = this.containLinks || parsedElements.containLinks;
    this.formattedWords += parsedElements.formattedWords;
  }
}
