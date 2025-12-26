import { ToLineItemBlockTransformation } from '../ToLineItemBlockTransformation';
import { ParseResult } from '../../ParseResult';
import { DETECTED_ANNOTATION } from '../../Annotation';
import { BlockType } from '../../markdown/BlockType';
import { minXFromBlocks } from '../../../utils/pageItemFunctions';
import type { Block } from '../../../types/globals';

/**
 * Detects code/quote blocks by indentation analysis.
 * Blocks where ALL lines are indented beyond page margin are marked as code.
 * Uses simple heuristic: if every line has x > minX, it's indented content.
 */
export class DetectCodeQuoteBlocks extends ToLineItemBlockTransformation {
  constructor() {
    super('Detect Code/Quote Blocks');
  }

  /**
   * Scans blocks for consistent indentation, marks as code blocks.
   *
   * @param parseResult - Blocks from previous transformation
   * @returns ParseResult with code blocks annotated
   */
  override transform(parseResult: ParseResult): ParseResult {
    // @ts-ignore - globals not typed
    const { mostUsedHeight } = parseResult.globals;
    let foundCodeItems = 0;
    parseResult.pages.forEach((page) => {
      const minX = minXFromBlocks(page.items as Block[]);
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

/**
 * Checks if block is consistently indented (likely code/quote).
 * Single-line blocks: Must be indented and normal-sized font.
 * Multi-line blocks: ALL lines must be indented beyond page margin.
 *
 * @param minX - Leftmost x-coordinate on page (margin)
 * @param items - Line items in block
 * @param mostUsedHeight - Normal paragraph font size
 * @returns true if block appears to be code/quote
 */
function looksLikeCodeBlock(minX: number | null, items: any[], mostUsedHeight: number): boolean {
  if (items.length === 0 || minX === null) {
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
