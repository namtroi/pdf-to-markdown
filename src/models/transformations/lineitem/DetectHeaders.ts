import { ToLineItemTransformation } from '../ToLineItemTransformation';
import { ParseResult } from '../../ParseResult';
import { DETECTED_ANNOTATION } from '../../Annotation';
import { BlockType, headlineByLevel } from '../../markdown/BlockType';
import { isListItem } from '../../../utils/stringFunctions';
import { Page } from '../../Page';

const TITLE_PAGE_HEADER_DIVISOR = 4;
const TITLE_PAGE_SECOND_LEVEL_OFFSET = 2;
const MAX_HEADLINE_LEVEL = 6;
const SPACING_MULTIPLIER_FOR_UPPERCASE_HEADERS = 2;

/**
 * Detects headers using multi-strategy approach:
 * 1. Title pages: Largest fonts = H1, secondary large fonts = H2
 * 2. TOC-based: Use TOC height ranges to find matching headers
 * 3. Height-based: Categorize by decreasing font sizes (no TOC)
 * 4. Font-based: Detect uppercase text in different font as headers
 *
 * Strategy chosen based on available data (TOC presence, font variations).
 */
export class DetectHeaders extends ToLineItemTransformation {
  constructor() {
    super('Detect Headers');
  }

  /**
   * Detects and annotates header lines based on font size, spacing, and TOC hints.
   *
   * @param parseResult - Line items from previous transformation
   * @returns ParseResult with header types assigned
   */
  override transform(parseResult: ParseResult): ParseResult {
    if (!parseResult.globals) {
      throw new Error('DetectHeaders requires globals from CalculateGlobalStats');
    }
    const { tocPages, headlineTypeToHeightRange, mostUsedHeight, mostUsedDistance, mostUsedFont, maxHeight } =
      parseResult.globals;
    const hasToc = tocPages && tocPages.length > 0;
    let detectedHeaders = 0;

    // Handle title pages
    const pagesWithMaxHeight = findPagesWithMaxHeight(parseResult.pages, maxHeight);
    const min2ndLevelHeaderHeigthOnMaxPage = mostUsedHeight + (maxHeight - mostUsedHeight) / TITLE_PAGE_HEADER_DIVISOR;
    pagesWithMaxHeight.forEach((titlePage) => {
      titlePage.items.forEach((item: any) => {
        const height = item.height;
        if (!item.type && height > min2ndLevelHeaderHeigthOnMaxPage) {
          if (height === maxHeight) {
            item.type = BlockType.H1;
          } else {
            item.type = BlockType.H2;
          }
          item.annotation = DETECTED_ANNOTATION;
          detectedHeaders++;
        }
      });
    });

    if (hasToc && headlineTypeToHeightRange) {
      //Use existing headline heights to find additional headlines
      const headlineTypes = Object.keys(headlineTypeToHeightRange);
      headlineTypes.forEach((headlineType) => {
        const range = headlineTypeToHeightRange[headlineType];
        if (range && range.max > mostUsedHeight) {
          //use only very clear headlines, only use max
          parseResult.pages.forEach((page) => {
            page.items.forEach((item: any) => {
              if (!item.type && item.height === range.max) {
                item.annotation = DETECTED_ANNOTATION;
                item.type = headlineByLevel(parseInt(headlineType.substring(1), 10));
                detectedHeaders++;
              }
            });
          });
        }
      });
    } else {
      //Categorize headlines by the text heights
      const heights: number[] = [];
      let lastHeight: number | undefined;
      parseResult.pages.forEach((page) => {
        page.items.forEach((item: any) => {
          if (!item.type && item.height > mostUsedHeight && !isListItem(item.text())) {
            if (!heights.includes(item.height) && (!lastHeight || lastHeight > item.height)) {
              heights.push(item.height);
            }
          }
        });
      });
      heights.sort((a, b) => b - a);

      heights.forEach((height, i) => {
        const headlineLevel = i + TITLE_PAGE_SECOND_LEVEL_OFFSET;
        if (headlineLevel <= MAX_HEADLINE_LEVEL) {
          const headlineType = headlineByLevel(TITLE_PAGE_SECOND_LEVEL_OFFSET + i);
          parseResult.pages.forEach((page) => {
            page.items.forEach((item: any) => {
              if (!item.type && item.height === height && !isListItem(item.text())) {
                detectedHeaders++;
                item.annotation = DETECTED_ANNOTATION;
                item.type = headlineType;
              }
            });
          });
        }
      });
    }

    //find headlines which have paragraph height
    let smallesHeadlineLevel = 1;
    parseResult.pages.forEach((page) => {
      page.items.forEach((item: any) => {
        if (item.type && (item.type as any).headline) {
          smallesHeadlineLevel = Math.max(smallesHeadlineLevel, (item.type as any).headlineLevel);
        }
      });
    });
    if (smallesHeadlineLevel < MAX_HEADLINE_LEVEL) {
      const nextHeadlineType = headlineByLevel(smallesHeadlineLevel + 1);
      parseResult.pages.forEach((page) => {
        let lastItem: any;
        page.items.forEach((item: any) => {
          if (
            !item.type &&
            item.height === mostUsedHeight &&
            item.font !== mostUsedFont &&
            (!lastItem || lastItem.y < item.y || (lastItem.type && (lastItem.type as any).headline) || lastItem.y - item.y > mostUsedDistance * SPACING_MULTIPLIER_FOR_UPPERCASE_HEADERS) &&
            item.text() === item.text().toUpperCase()
          ) {
            detectedHeaders++;
            item.annotation = DETECTED_ANNOTATION;
            item.type = nextHeadlineType;
          }
          lastItem = item;
        });
      });
    }

    return new ParseResult({
      ...parseResult,
      messages: ['Detected ' + detectedHeaders + ' headlines.'],
    });
  }
}

/**
 * Finds pages containing text at maximum height (likely title pages).
 *
 * @param pages - All pages to search
 * @param maxHeight - Maximum font height in document
 * @returns Set of pages containing max-height text
 */
function findPagesWithMaxHeight(pages: Page[], maxHeight: number): Set<Page> {
  const maxHeaderPagesSet = new Set<Page>();
  pages.forEach((page) => {
    page.items.forEach((item: any) => {
      if (!item.type && item.height === maxHeight) {
        maxHeaderPagesSet.add(page);
      }
    });
  });
  return maxHeaderPagesSet;
}
