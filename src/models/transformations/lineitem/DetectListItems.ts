import { ToLineItemTransformation } from '../ToLineItemTransformation';
import { ParseResult } from '../../ParseResult';
import { LineItem } from '../../LineItem';
import { Word } from '../../Word';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION, DETECTED_ANNOTATION } from '../../Annotation';
import { BlockType } from '../../markdown/BlockType';
// @ts-ignore - stringFunctions not typed
import { isListItemCharacter, isNumberedListItem } from '../../../utils/stringFunctions';

/**
 * Detects list items by analyzing first word of each line.
 * Handles both bullet lists (-, •, –) and numbered lists (1., 2., etc).
 * Normalizes bullet characters to standard '-' for consistent markdown output.
 */
export class DetectListItems extends ToLineItemTransformation {
  constructor() {
    super('Detect List Items');
  }

  /**
   * Scans lines for list patterns, normalizes bullets, annotates types.
   * Creates duplicate lines when normalizing non-standard bullets.
   *
   * @param parseResult - Line items to analyze
   * @returns ParseResult with list items annotated
   */
  override transform(parseResult: ParseResult): ParseResult {
    let foundListItems = 0;
    let foundNumberedItems = 0;
    parseResult.pages.forEach((page) => {
      const newItems: any[] = [];
      page.items.forEach((item: any) => {
        newItems.push(item);
        if (!item.type) {
          const text = item.text();
          if (isListItemCharacter(item.words[0].string)) {
            foundListItems++;
            if (item.words[0].string === '-') {
              item.annotation = DETECTED_ANNOTATION;
              item.type = BlockType.LIST;
            } else {
              item.annotation = REMOVED_ANNOTATION;
              const newWords = item.words.map((word: any) => new Word({ ...word }));
              newWords[0].string = '-';
              newItems.push(
                new LineItem({
                  ...item,
                  words: newWords,
                  annotation: ADDED_ANNOTATION,
                  type: BlockType.LIST,
                } as any)
              );
            }
          } else if (isNumberedListItem(text)) {
            //TODO check that starts with 1 (kala chakra)
            foundNumberedItems++;
            item.annotation = DETECTED_ANNOTATION;
            item.type = BlockType.LIST;
          }
        }
      });
      page.items = newItems;
    });

    return new ParseResult({
      ...parseResult,
      messages: ['Detected ' + foundListItems + ' plain list items.', 'Detected ' + foundNumberedItems + ' numbered list items.'],
    });
  }
}
