import { ToLineItemTransformation } from '../ToLineItemTransformation';
import { ParseResult } from '../../ParseResult';
import { REMOVED_ANNOTATION } from '../../Annotation';
// @ts-ignore - stringFunctions not typed
import { isDigit } from '../../../utils/stringFunctions';

const SPACE_CHAR_CODE = 32;
const NON_BREAKING_SPACE_CHAR_CODE = 160;
const HASH_SHIFT_BITS = 5;
const INITIAL_MAX_Y = 0;
const INITIAL_MIN_Y = 999;
const MIN_REPETITIONS = 3;
const REPETITION_THRESHOLD_NUMERATOR = 2;
const REPETITION_THRESHOLD_DENOMINATOR = 3;

function hashCodeIgnoringSpacesAndNumbers(string: string): number {
  let hash = 0;
  if (string.trim().length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i);
    if (!isDigit(charCode) && charCode !== SPACE_CHAR_CODE && charCode !== NON_BREAKING_SPACE_CHAR_CODE) {
      hash = (hash << HASH_SHIFT_BITS) - hash + charCode;
      hash |= 0; // Convert to 32bit integer
    }
  }
  return hash;
}

// Remove elements with similar content on same page positions, like page numbers, licenes information, etc...
export class RemoveRepetitiveElements extends ToLineItemTransformation {
  constructor() {
    super('Remove Repetitive Elements');
  }

  // The idea is the following:
  // - For each page, collect all items of the first, and all items of the last line
  // - Calculate how often these items occur accros all pages (hash ignoring numbers, whitespace, upper/lowercase)
  // - Delete items occuring on more then 2/3 of all pages
  override transform(parseResult: ParseResult): ParseResult {
    // find first and last lines per page
    const pageStore: any[] = [];
    const minLineHashRepetitions: Record<number, number> = {};
    const maxLineHashRepetitions: Record<number, number> = {};
    parseResult.pages.forEach((page) => {
      const minMaxItems = page.items.reduce(
        (itemStore: any, item: any) => {
          if (item.y < itemStore.minY) {
            itemStore.minElements = [item];
            itemStore.minY = item.y;
          } else if (item.y === itemStore.minY) {
            itemStore.minElements.push(item);
          }
          if (item.y > itemStore.maxY) {
            itemStore.maxElements = [item];
            itemStore.maxY = item.y;
          } else if (item.y === itemStore.maxY) {
            itemStore.maxElements.push(item);
          }
          return itemStore;
        },
        {
          minY: INITIAL_MIN_Y,
          maxY: INITIAL_MAX_Y,
          minElements: [],
          maxElements: [],
        }
      );

      const minLineHash = hashCodeIgnoringSpacesAndNumbers(
        minMaxItems.minElements.reduce((combinedString: string, item: any) => combinedString + item.text().toUpperCase(), '')
      );
      const maxLineHash = hashCodeIgnoringSpacesAndNumbers(
        minMaxItems.maxElements.reduce((combinedString: string, item: any) => combinedString + item.text().toUpperCase(), '')
      );
      pageStore.push({
        minElements: minMaxItems.minElements,
        maxElements: minMaxItems.maxElements,
        minLineHash: minLineHash,
        maxLineHash: maxLineHash,
      });
      minLineHashRepetitions[minLineHash] = minLineHashRepetitions[minLineHash] ? minLineHashRepetitions[minLineHash] + 1 : 1;
      maxLineHashRepetitions[maxLineHash] = maxLineHashRepetitions[maxLineHash] ? maxLineHashRepetitions[maxLineHash] + 1 : 1;
    });

    // now annoate all removed items
    let removedHeader = 0;
    let removedFooter = 0;
    parseResult.pages.forEach((_page, i) => {
      if ((minLineHashRepetitions[pageStore[i]!.minLineHash] || 0) >= Math.max(MIN_REPETITIONS, (parseResult.pages.length * REPETITION_THRESHOLD_NUMERATOR) / REPETITION_THRESHOLD_DENOMINATOR)) {
        pageStore[i]!.minElements.forEach((item: any) => {
          item.annotation = REMOVED_ANNOTATION;
        });
        removedFooter++;
      }
      if ((maxLineHashRepetitions[pageStore[i]!.maxLineHash] || 0) >= Math.max(MIN_REPETITIONS, (parseResult.pages.length * REPETITION_THRESHOLD_NUMERATOR) / REPETITION_THRESHOLD_DENOMINATOR)) {
        pageStore[i]!.maxElements.forEach((item: any) => {
          item.annotation = REMOVED_ANNOTATION;
        });
        removedHeader++;
      }
    });

    return new ParseResult({
      ...parseResult,
      messages: ['Removed Header: ' + removedHeader, 'Removed Footers: ' + removedFooter],
    });
  }
}
