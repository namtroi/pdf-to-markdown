import { ToLineItemBlockTransformation } from '../ToLineItemBlockTransformation';
import { ParseResult } from '../../ParseResult';
import { DETECTED_ANNOTATION } from '../../Annotation';
import { BlockType } from '../../markdown/BlockType';
import { minXFromBlocks } from '../../../pageItemFunctions';

//Detect items which are code/quote blocks
export class DetectCodeQuoteBlocks extends ToLineItemBlockTransformation {
  constructor() {
    super('Detect Code/Quote Blocks');
  }

  override transform(parseResult: ParseResult): ParseResult {
    // @ts-ignore - globals not typed
    const { mostUsedHeight } = parseResult.globals;
    let foundCodeItems = 0;
    parseResult.pages.forEach((page) => {
      const minX = minXFromBlocks(page.items);
      page.items.forEach((block: any) => {
        // @ts-ignore
        if (!block.type && looksLikeCodeBlock(minX, block.items, mostUsedHeight)) {
          block.annotation = DETECTED_ANNOTATION;
          block.type = BlockType.CODE;
          foundCodeItems++;
        }
      });
    });

    return new ParseResult({
      ...parseResult,
      messages: ['Detected ' + foundCodeItems + ' code/quote items.'],
    });
  }
}

function looksLikeCodeBlock(minX: number, items: any[], mostUsedHeight: number): boolean {
  if (items.length === 0) {
    return false;
  }
  if (items.length === 1) {
    return items[0].x > minX && items[0].height <= mostUsedHeight + 1;
  }
  for (const item of items) {
    if (item.x === minX) {
      return false;
    }
  }
  return true;
}
