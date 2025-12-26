import { ToTextItemTransformation } from '../ToTextItemTransformation';
import { ParseResult } from '../../ParseResult';
import { WordFormat } from '../../markdown/WordFormat';
import type { TextItem } from '../../TextItem';
import type { PDFFont } from '../../../types/globals';

// Stage 1: Calculate global statistics about the PDF document
export class CalculateGlobalStats extends ToTextItemTransformation {
  private fontMap: Map<string, PDFFont>;

  constructor(fontMap: Map<string, PDFFont>) {
    super('Calculate Statistics');
    this.fontMap = fontMap;
  }

  override transform(parseResult: ParseResult): ParseResult {
    // Parse heights
    const heightToOccurrence: Record<number, number> = {};
    const fontToOccurrence: Record<string, number> = {};
    let maxHeight = 0;
    let maxHeightFont: string | undefined;

    parseResult.pages.forEach((page) => {
      page.items.forEach((item) => {
        const textItem = item as TextItem;
        heightToOccurrence[textItem.height] = (heightToOccurrence[textItem.height] || 0) + 1;
        fontToOccurrence[textItem.font] = (fontToOccurrence[textItem.font] || 0) + 1;
        if (textItem.height > maxHeight) {
          maxHeight = textItem.height;
          maxHeightFont = textItem.font;
        }
      });
    });

    const mostUsedHeight = parseInt(getMostUsedKey(heightToOccurrence) || '0');
    const mostUsedFont = getMostUsedKey(fontToOccurrence) || '';

    // Parse line distances
    const distanceToOccurrence: Record<number, number> = {};
    parseResult.pages.forEach((page) => {
      let lastItemOfMostUsedHeight: TextItem | null = null;
      page.items.forEach((item) => {
        const textItem = item as TextItem;
        if (textItem.height === mostUsedHeight && textItem.text.trim().length > 0) {
          if (lastItemOfMostUsedHeight && textItem.y !== lastItemOfMostUsedHeight.y) {
            const distance = lastItemOfMostUsedHeight.y - textItem.y;
            if (distance > 0) {
              distanceToOccurrence[distance] = (distanceToOccurrence[distance] || 0) + 1;
            }
          }
          lastItemOfMostUsedHeight = textItem;
        } else {
          lastItemOfMostUsedHeight = null;
        }
      });
    });

    const mostUsedDistance = parseInt(getMostUsedKey(distanceToOccurrence) || '0');

    const fontIdToName: string[] = [];
    const fontToFormats = new Map<string, string>();

    this.fontMap.forEach((value: PDFFont, key: string) => {
      fontIdToName.push(`${key} = ${value.name}`);
      const fontName = value.name.toLowerCase();
      let format;

      if (key === mostUsedFont) {
        format = null;
      } else if (fontName.includes('bold') && (fontName.includes('oblique') || fontName.includes('italic'))) {
        format = WordFormat.BOLD_OBLIQUE;
      } else if (fontName.includes('bold')) {
        format = WordFormat.BOLD;
      } else if (fontName.includes('oblique') || fontName.includes('italic')) {
        format = WordFormat.OBLIQUE;
      } else if (fontName === maxHeightFont) {
        format = WordFormat.BOLD;
      }

      if (format) {
        fontToFormats.set(key, format.name);
      }
    });

    fontIdToName.sort();

    // Make a copy of the originals so all following transformations don't modify them
    const newPages = parseResult.pages.map((page) => {
      return {
        ...page,
        items: page.items.map((textItem) => {
          return {
            ...textItem
          };
        })
      };
    });

    return new ParseResult({
      ...parseResult,
      pages: newPages,
      globals: {
        mostUsedHeight: mostUsedHeight,
        mostUsedFont: mostUsedFont,
        mostUsedDistance: mostUsedDistance,
        maxHeight: maxHeight,
        maxHeightFont: maxHeightFont,
        fontToFormats: fontToFormats
      },
      messages: [
        'Items per height: ' + JSON.stringify(heightToOccurrence),
        'Items per font: ' + JSON.stringify(fontToOccurrence),
        'Items per distance: ' + JSON.stringify(distanceToOccurrence),
        'Fonts:' + JSON.stringify(fontIdToName)
      ]
    });
  }
}

function getMostUsedKey(keyToOccurrence: Record<string | number, number>): string | null {
  let maxOccurrence = 0;
  let maxKey: string | null = null;

  Object.keys(keyToOccurrence).forEach((element) => {
    if (!maxKey || (keyToOccurrence[element] || 0) > maxOccurrence) {
      maxOccurrence = keyToOccurrence[element] || 0;
      maxKey = element;
    }
  });

  return maxKey;
}
