// @ts-ignore - pageItemFunctions not typed
import { sortByX } from '../utils/pageItemFunctions';
import { TextItem } from './TextItem';

/**
 * Groups text items by vertical position to form lines.
 * Items with similar y-coordinates (within tolerance) are grouped together.
 * Critical for reconstructing reading order from PDF's unordered text items.
 */
export class TextItemLineGrouper {
  /** Vertical threshold for grouping items (usually line height from stats) */
  mostUsedDistance: number;

  /**
   * Creates grouper with vertical tolerance.
   *
   * @param options - Configuration object
   * @param options.mostUsedDistance - Vertical distance threshold (default: 12)
   */
  constructor(options: { mostUsedDistance?: number }) {
    this.mostUsedDistance = options.mostUsedDistance || 12;
  }

  /**
   * Groups text items into lines based on y-coordinate.
   * Items within mostUsedDistance/2 of each other are considered same line.
   * Sorts each line left-to-right after grouping.
   *
   * @param textItems - Text items to group (assumed sorted by y)
   * @returns Array of lines, each containing text items sorted left-to-right
   */
  group(textItems: TextItem[]): TextItem[][] {
    return this.groupItemsByLine(textItems);
  }

  /**
   * Internal grouping logic. Splits items into lines when y-distance exceeds threshold.
   *
   * @param textItems - Text items to group
   * @returns Array of lines with items sorted horizontally
   */
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
