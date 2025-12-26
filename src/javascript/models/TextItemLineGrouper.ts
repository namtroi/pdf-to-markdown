// @ts-ignore - pageItemFunctions not typed
import { sortByX } from '../pageItemFunctions';
import { TextItem } from './TextItem';

//Groups all text items which are on the same y line
export class TextItemLineGrouper {
  mostUsedDistance: number;

  constructor(options: { mostUsedDistance?: number }) {
    this.mostUsedDistance = options.mostUsedDistance || 12;
  }

  // returns a CombineResult
  group(textItems: TextItem[]): TextItem[][] {
    return this.groupItemsByLine(textItems);
  }

  private groupItemsByLine(textItems: TextItem[]): TextItem[][] {
    const lines: TextItem[][] = [];
    let currentLine: TextItem[] = [];
    textItems.forEach((item) => {
      if (currentLine.length > 0 && currentLine[0] && Math.abs(currentLine[0].y - item.y) >= this.mostUsedDistance / 2) {
        lines.push(currentLine);
        currentLine = [];
      }
      currentLine.push(item);
    });
    lines.push(currentLine);

    lines.forEach((lineItems) => {
      // we can't trust order of occurence, esp. footnoteLinks like to come last
      sortByX(lineItems);
    });
    return lines;
  }
}
