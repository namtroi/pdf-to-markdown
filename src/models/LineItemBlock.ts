import { PageItem } from './PageItem';
import { LineItem } from './LineItem';
import type { BlockTypeValue } from './markdown/BlockType';
import type { Annotation } from './Annotation';
import type { ParsedElements } from './PageItem';

// A block of LineItem[] within a Page
export class LineItemBlock extends PageItem {
  items: LineItem[] = [];

  constructor(options: {
    type?: BlockTypeValue;
    annotation?: Annotation;
    parsedElements?: ParsedElements;
    items?: LineItem[];
  }) {
    super(options);
    this.items = [];
    if (options.items) {
      options.items.forEach((item) => this.addItem(item));
    }
  }

  addItem(item: LineItem): void {
    if (this.type && item.type && this.type !== item.type) {
      throw new Error(`Adding item of type ${item.type?.name} to block of type ${this.type?.name}`);
    }
    if (!this.type) {
      this.type = item.type;
    }
    if (item.parsedElements) {
      if (this.parsedElements) {
        this.parsedElements.add(item.parsedElements);
      } else {
        this.parsedElements = item.parsedElements;
      }
    }
    const copiedItem = new LineItem({ ...item });
    copiedItem.type = undefined;
    this.items.push(copiedItem);
  }
}
