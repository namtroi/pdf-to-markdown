import { ToLineItemBlockTransformation } from '../ToLineItemBlockTransformation';
import { ParseResult } from '../../ParseResult';
import { LineItemBlock } from '../../LineItemBlock';
import { LineItem } from '../../LineItem';
import { DETECTED_ANNOTATION } from '../../Annotation';
import { minXFromPageItems } from '../../../utils/pageItemFunctions';

const NEGATIVE_DISTANCE_TOLERANCE_DIVISOR = 2;
const BASE_DISTANCE_TOLERANCE = 1;

// Gathers lines to blocks
export class GatherBlocks extends ToLineItemBlockTransformation {
  constructor() {
    super('Gather Blocks');
  }

  override transform(parseResult: ParseResult): ParseResult {
    if (!parseResult.globals) {
      throw new Error('GatherBlocks requires globals from CalculateGlobalStats');
    }
    const { mostUsedDistance } = parseResult.globals;
    let createdBlocks = 0;
    let lineItemCount = 0;
    parseResult.pages.map((page) => {
      lineItemCount += page.items.length;
      const blocks: any[] = [];
      let stashedBlock = new LineItemBlock({});
      const flushStashedItems = () => {
        if (stashedBlock.items.length > 1) {
          stashedBlock.annotation = DETECTED_ANNOTATION;
        }

        blocks.push(stashedBlock);
        stashedBlock = new LineItemBlock({});
        createdBlocks++;
      };

      const minX = minXFromPageItems(page.items as LineItem[]);
      page.items.forEach((item: any) => {
        if (stashedBlock.items.length > 0 && minX !== null && shouldFlushBlock(stashedBlock, item, minX, mostUsedDistance)) {
          flushStashedItems();
        }
        stashedBlock.addItem(item);
      });
      if (stashedBlock.items.length > 0) {
        flushStashedItems();
      }
      page.items = blocks;
    });

    return new ParseResult({
      ...parseResult,
      messages: ['Gathered ' + createdBlocks + ' blocks out of ' + lineItemCount + ' line items'],
    });
  }
}

function shouldFlushBlock(stashedBlock: LineItemBlock, item: any, minX: number, mostUsedDistance: number): boolean {
  if (stashedBlock.type && (stashedBlock.type as any).mergeFollowingNonTypedItems && !item.type) {
    return false;
  }
  const lastItem = stashedBlock.items[stashedBlock.items.length - 1];
  const hasBigDistance = bigDistance(lastItem, item, minX, mostUsedDistance);
  if (stashedBlock.type && (stashedBlock.type as any).mergeFollowingNonTypedItemsWithSmallDistance && !item.type && !hasBigDistance) {
    return false;
  }
  if (item.type !== stashedBlock.type) {
    return true;
  }
  if (item.type) {
    return !(item.type as any).mergeToBlock;
  } else {
    return hasBigDistance;
  }
}

function bigDistance(lastItem: any, item: any, minX: number, mostUsedDistance: number): boolean {
  const distance = lastItem.y - item.y;
  if (distance < 0 - mostUsedDistance / NEGATIVE_DISTANCE_TOLERANCE_DIVISOR) {
    //distance is negative - and not only a bit
    return true;
  }
  let allowedDisctance = mostUsedDistance + BASE_DISTANCE_TOLERANCE;
  if (lastItem.x > minX && item.x > minX) {
    //intended elements like lists often have greater spacing
    allowedDisctance = mostUsedDistance + mostUsedDistance / NEGATIVE_DISTANCE_TOLERANCE_DIVISOR;
  }
  if (distance > allowedDisctance) {
    return true;
  }
  return false;
}
