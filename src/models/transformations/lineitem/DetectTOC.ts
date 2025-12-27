import { ToLineItemTransformation } from '../ToLineItemTransformation';
import { ParseResult } from '../../ParseResult';
import { LineItem } from '../../LineItem';
import { Word } from '../../Word';
import { HeadlineFinder } from '../../HeadlineFinder';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation';
import { BlockType, headlineByLevel } from '../../markdown/BlockType';
import type { Page } from '../../Page';
import type { HeightRange } from '../../../types/globals';
import { isDigit, isNumber, calculateWordMatchScore, hasOnlyCharacter } from '../../../utils/stringFunctions';

/**
 * Detects Table of Contents pages and links them to actual headers.
 * Multi-phase algorithm:
 * 1. Identify TOC pages (>75% lines end with page numbers)
 * 2. Extract TOC entries with hierarchy (indentation/font-based)
 * 3. Find corresponding headers in document using HeadlineFinder
 * 4. Build height ranges for header levels from TOC matches
 * 5. Use height ranges to find headers not matched by text
 *
 * Critical for establishing document structure and header hierarchy.
 */
export class DetectTOC extends ToLineItemTransformation {
  constructor() {
    super('Detect TOC');
  }

  /**
   * Detects TOC pages, extracts entries, links to headers, builds hierarchy.
   *
   * @param parseResult - Line items to analyze
   * @returns ParseResult with TOC detected, headers linked, globals updated
   */
  override transform(parseResult: ParseResult): ParseResult {
    const tocPages: number[] = [];
    const maxPagesToEvaluate = Math.min(20, parseResult.pages.length);
    const linkLeveler = new LinkLeveler();

    const tocLinks: TocLink[] = [];
    let lastTocPage: typeof parseResult.pages[0] | undefined;
    let headlineItem: LineItem | undefined;
    parseResult.pages.slice(0, maxPagesToEvaluate).forEach((page) => {
      let lineItemsWithDigits = 0;
      const unknownLines = new Set<LineItem>();
      const pageTocLinks: TocLink[] = [];
      let lastWordsWithoutNumber: Word[] | null = null;
      let lastLine: LineItem | undefined;
      //find lines ending with a number per page
      page.items.forEach((item) => {
        const line = item as LineItem;
        const words = line.words.filter((word) => !hasOnlyCharacter(word.string, '.'));
        const digits: string[] = [];
        while (words.length > 0 && isNumber(words[words.length - 1]!.string)) {
          const lastWord = words.pop();
          if (lastWord) digits.unshift(lastWord.string);
        }

        if (digits.length === 0 && words.length > 0) {
          const lastWord = words[words.length - 1];
          if (lastWord) {
            while (isDigit(lastWord.string.charCodeAt(lastWord.string.length - 1))) {
              digits.unshift(lastWord.string.charAt(lastWord.string.length - 1));
              lastWord.string = lastWord.string.substring(0, lastWord.string.length - 1);
            }
          }
        }
        const endsWithDigit = digits.length > 0;
        if (endsWithDigit) {
          if (lastWordsWithoutNumber) {
            // 2-line item ?
            words.push(...lastWordsWithoutNumber);
            lastWordsWithoutNumber = null;
          }
          pageTocLinks.push(
            new TocLink({
              pageNumber: parseInt(digits.join('')),
              lineItem: new LineItem({
                x: line.x,
                y: line.y,
                width: line.width,
                height: line.height,
                words: words,
              }),
            })
          );
          lineItemsWithDigits++;
        } else {
          if (!headlineItem) {
            headlineItem = line;
          } else {
            if (lastWordsWithoutNumber && lastLine) {
              unknownLines.add(lastLine);
            }
            lastWordsWithoutNumber = words;
            lastLine = line;
          }
        }
      });

      // page has been processed
      if ((lineItemsWithDigits * 100) / page.items.length > 75) {
        tocPages.push(page.index + 1);
        lastTocPage = page;
        linkLeveler.levelPageItems(pageTocLinks);
        tocLinks.push(...pageTocLinks);

        const newBlocks: LineItem[] = [];
        page.items.forEach((item) => {
          const line = item as LineItem;
          if (!unknownLines.has(line)) {
            line.annotation = REMOVED_ANNOTATION;
          }
          newBlocks.push(line);
          if (line === headlineItem) {
            newBlocks.push(
              new LineItem({
                x: line.x,
                y: line.y,
                width: line.width,
                height: line.height,
                words: line.words,
                type: BlockType.H2,
                annotation: ADDED_ANNOTATION,
              })
            );
          }
        });
        page.items = newBlocks;
      } else {
        headlineItem = undefined;
      }
    });

    //all  pages have been processed
    const foundHeadlines = tocLinks.length;
    const notFoundHeadlines: TocLink[] = [];
    const foundBySize: TocLink[] = [];
    const headlineTypeToHeightRange: Record<string, HeightRange> = {}; //H1={min:23, max:25}

    if (tocPages.length > 0 && lastTocPage) {
      // Add TOC items
      tocLinks.forEach((tocLink) => {
        lastTocPage!.items.push(
          new LineItem({
            x: tocLink.lineItem.x,
            y: tocLink.lineItem.y,
            width: tocLink.lineItem.width,
            height: tocLink.lineItem.height,
            words: [new Word({ string: ' '.repeat(tocLink.level * 3) + '-' })].concat(tocLink.lineItem.words),
            type: BlockType.TOC,
            annotation: ADDED_ANNOTATION,
          })
        );
      });

      // Add linked headers
      const pageMapping = detectPageMappingNumber(parseResult.pages.filter((page) => page.index > lastTocPage!.index), tocLinks);
      tocLinks.forEach((tocLink) => {
        let linkedPage = parseResult.pages[tocLink.pageNumber + pageMapping];
        let foundHealineItems;
        if (linkedPage) {
          foundHealineItems = findHeadlineItems(linkedPage, tocLink.lineItem.text());
          if (!foundHealineItems) {
            // pages are off by 1 ?
            linkedPage = parseResult.pages[tocLink.pageNumber + pageMapping + 1];
            if (linkedPage) {
              foundHealineItems = findHeadlineItems(linkedPage, tocLink.lineItem.text());
            }
          }
        }
        if (foundHealineItems && linkedPage) {
          addHeadlineItems(linkedPage, tocLink, foundHealineItems, headlineTypeToHeightRange);
        } else {
          notFoundHeadlines.push(tocLink);
        }
      });

      // Try to find linked headers by height
      let fromPage = lastTocPage!.index + 2;
      let lastNotFound: TocLink[] = [];
      const rollupLastNotFound = (currentPageNumber: number) => {
        if (lastNotFound.length > 0) {
          lastNotFound.forEach((notFoundTocLink) => {
            const headlineType = headlineByLevel(Math.min(notFoundTocLink.level + 2, 6));
            const heightRange = headlineTypeToHeightRange[headlineType.name];
            if (heightRange) {
              const [pageIndex, lineIndex] = findPageAndLineFromHeadline(
                parseResult.pages,
                notFoundTocLink,
                heightRange,
                fromPage,
                currentPageNumber
              );
              if (lineIndex > -1) {
                const page = parseResult.pages[pageIndex];
                if (page && page.items[lineIndex]) {
                  page.items[lineIndex]!.annotation = REMOVED_ANNOTATION;
                  page.items.splice(
                    lineIndex + 1,
                    0,
                    new LineItem({
                      x: notFoundTocLink.lineItem.x,
                      y: notFoundTocLink.lineItem.y,
                      width: notFoundTocLink.lineItem.width,
                      height: notFoundTocLink.lineItem.height,
                      words: notFoundTocLink.lineItem.words,
                      type: headlineType,
                      annotation: ADDED_ANNOTATION,
                    })
                  );
                  foundBySize.push(notFoundTocLink);
                }
              }
            }
          });
          lastNotFound = [];
        }
      };
      if (notFoundHeadlines.length > 0) {
        tocLinks.forEach((tocLink) => {
          if (notFoundHeadlines.includes(tocLink)) {
            lastNotFound.push(tocLink);
          } else {
            rollupLastNotFound(tocLink.pageNumber);
            fromPage = tocLink.pageNumber;
          }
        });
        if (lastNotFound.length > 0) {
          rollupLastNotFound(parseResult.pages.length);
        }
      }
    }

    const messages = [];
    messages.push('Detected ' + tocPages.length + ' table of content pages');
    if (tocPages.length > 0) {
      messages.push('TOC headline heights: ' + JSON.stringify(headlineTypeToHeightRange));
      messages.push('Found TOC headlines: ' + (foundHeadlines - notFoundHeadlines.length + foundBySize.length) + '/' + foundHeadlines);
    }
    if (notFoundHeadlines.length > 0) {
      messages.push('Found TOC headlines (by size): ' + foundBySize.map((tocLink) => tocLink.lineItem.text()));
      messages.push(
        'Missing TOC headlines: ' +
          notFoundHeadlines
            .filter((fTocLink) => !foundBySize.includes(fTocLink))
            .map((tocLink) => tocLink.lineItem.text() + '=>' + tocLink.pageNumber)
      );
    }
    return new ParseResult({
      ...parseResult,
      globals: parseResult.globals ? {
        ...parseResult.globals,
        tocPages: tocPages,
        headlineTypeToHeightRange: headlineTypeToHeightRange,
      } : undefined,
      messages: messages,
    });
  }
}

/**
 * Detects offset between TOC page numbers and actual page indices.
 * PDFs may have front matter, causing TOC "page 1" to be at index 5.
 *
 * @param pages - Pages after TOC to search
 * @param tocLinks - TOC entries with page numbers
 * @returns Offset to add to TOC page numbers to get actual index
 */
function detectPageMappingNumber(pages: Page[], tocLinks: TocLink[]): number {
  for (const tocLink of tocLinks) {
    const page = findPageWithHeadline(pages, tocLink.lineItem.text());
    if (page) {
      return page.index - tocLink.pageNumber;
    }
  }
  return 0;
}

/**
 * Searches pages for one containing specific headline text.
 *
 * @param pages - Pages to search
 * @param headline - Headline text from TOC
 * @returns Page containing headline, or null
 */
function findPageWithHeadline(pages: Page[], headline: string): Page | null {
  for (const page of pages) {
    if (findHeadlineItems(page, headline)) {
      return page;
    }
  }
  return null;
}

/**
 * Result of finding headline on a page.
 */
interface HeadlineItemsResult {
  lineIndex: number;
  headlineItems: LineItem[];
}

/**
 * Finds headline matching TOC entry on page, handling multi-line headlines.
 * Uses HeadlineFinder for fuzzy character-by-character matching.
 *
 * @param page - Page to search
 * @param headline - Headline text from TOC
 * @returns Line index and matched items, or null
 */
function findHeadlineItems(page: Page, headline: string): HeadlineItemsResult | null {
  const headlineFinder = new HeadlineFinder({
    headline: headline,
  });
  let lineIndex = 0;
  for (const item of page.items) {
    const line = item as LineItem;
    const headlineItems = headlineFinder.consume(line);
    if (headlineItems) {
      return {
        lineIndex: lineIndex,
        headlineItems: headlineItems,
      };
    }
    lineIndex++;
  }
  return null;
}

/**
 * Adds found headline to page, removes original lines, updates height range.
 * Builds mapping of header level -> font height range for later detection.
 *
 * @param page - Page containing headline
 * @param tocLink - TOC entry with level info
 * @param foundItems - Located headline lines
 * @param headlineTypeToHeightRange - Accumulator for height ranges by level
 */
function addHeadlineItems(page: Page, tocLink: TocLink, foundItems: HeadlineItemsResult, headlineTypeToHeightRange: Record<string, HeightRange>) {
  foundItems.headlineItems.forEach((item) => (item.annotation = REMOVED_ANNOTATION));
  const headlineType = headlineByLevel(tocLink.level + 2);
  const headlineHeight = foundItems.headlineItems.reduce((max: number, item) => Math.max(max, item.height), 0);
  const firstItem = foundItems.headlineItems[0];

  if (!firstItem) return;

  page.items.splice(
    foundItems.lineIndex + 1,
    0,
    new LineItem({
      x: firstItem.x,
      y: firstItem.y,
      width: firstItem.width,
      height: headlineHeight,
      words: tocLink.lineItem.words,
      type: headlineType,
      annotation: ADDED_ANNOTATION,
    })
  );
  let range = headlineTypeToHeightRange[headlineType.name];
  if (range) {
    range.min = Math.min(range.min, headlineHeight);
    range.max = Math.max(range.max, headlineHeight);
  } else {
    range = {
      min: headlineHeight,
      max: headlineHeight,
    };
    headlineTypeToHeightRange[headlineType.name] = range;
  }
}

/**
 * Finds headline by height and word match within page range.
 * Fallback when text-based matching fails. Uses height ranges from TOC.
 *
 * @param pages - All pages
 * @param tocLink - TOC entry to find
 * @param heightRange - Valid height range for this header level
 * @param fromPage - Start page (1-indexed)
 * @param toPage - End page (1-indexed)
 * @returns [pageIndex, lineIndex] or [-1, -1] if not found
 */
function findPageAndLineFromHeadline(pages: Page[], tocLink: TocLink, heightRange: HeightRange, fromPage: number, toPage: number): [number, number] {
  const linkText = tocLink.lineItem.text().toUpperCase();
  for (let i = fromPage; i <= toPage; i++) {
    const page = pages[i - 1];
    if (!page) continue;
    const lineIndex = page.items.findIndex((item) => {
      const line = item as LineItem;
      if (!line.type && !line.annotation && line.height >= heightRange.min && line.height <= heightRange.max) {
        const match = calculateWordMatchScore(linkText, line.text());
        return match >= 0.5;
      }
      return false;
    });
    if (lineIndex > -1) return [i - 1, lineIndex];
  }
  return [-1, -1];
}

/**
 * Determines hierarchy level of TOC entries.
 * Uses indentation (x-position) or font variation to establish levels.
 * Critical for mapping TOC structure to markdown header levels.
 */
class LinkLeveler {
  levelByMethod: ((tocLinks: TocLink[]) => void) | null;
  uniqueFonts: string[];

  constructor() {
    this.levelByMethod = null;
    this.uniqueFonts = [];
  }

  /**
   * Assigns hierarchy levels to TOC links.
   * Auto-detects method: indentation (x-diff) > font > flat.
   * Method chosen once, applied to all subsequent pages.
   *
   * @param tocLinks - TOC entries to level
   */
  levelPageItems(tocLinks: TocLink[]) {
    if (!this.levelByMethod) {
      const uniqueX = this.calculateUniqueX(tocLinks);
      if (uniqueX.length > 1) {
        this.levelByMethod = this.levelByXDiff.bind(this);
      } else {
        const uniqueFonts = this.calculateUniqueFonts(tocLinks);
        if (uniqueFonts.length > 1) {
          this.uniqueFonts = uniqueFonts;
          this.levelByMethod = this.levelByFont.bind(this);
        } else {
          this.levelByMethod = this.levelToZero.bind(this);
        }
      }
    }
    this.levelByMethod(tocLinks);
  }

  /**
   * Levels by x-position (indentation). Leftmost = level 0.
   */
  levelByXDiff(tocLinks: TocLink[]) {
    const uniqueX = this.calculateUniqueX(tocLinks);
    tocLinks.forEach((link) => {
      link.level = uniqueX.indexOf(link.lineItem.x);
    });
  }

  /**
   * Levels by font. Order of font appearance = level order.
   */
  levelByFont(tocLinks: TocLink[]) {
    tocLinks.forEach((link) => {
      const font = (link.lineItem as any).font as string;
      link.level = this.uniqueFonts.indexOf(font);
    });
  }

  /**
   * Fallback: All entries at level 0 (flat hierarchy).
   */
  levelToZero(tocLinks: TocLink[]) {
    tocLinks.forEach((link) => {
      link.level = 0;
    });
  }

  /**
   * Extracts unique x-positions from TOC links, sorted left-to-right.
   */
  calculateUniqueX(tocLinks: TocLink[]): number[] {
    const uniqueX = tocLinks.reduce((uniquesArray: number[], link) => {
      if (uniquesArray.indexOf(link.lineItem.x) < 0) uniquesArray.push(link.lineItem.x);
      return uniquesArray;
    }, []);

    uniqueX.sort((a, b) => {
      return a - b;
    });

    return uniqueX;
  }

  /**
   * Extracts unique font IDs from TOC links.
   */
  calculateUniqueFonts(tocLinks: TocLink[]): string[] {
    const uniqueFont = tocLinks.reduce((uniquesArray: string[], link) => {
      const font = (link.lineItem as any).font as string;
      if (uniquesArray.indexOf(font) < 0) uniquesArray.push(font);
      return uniquesArray;
    }, []);

    return uniqueFont;
  }
}

/**
 * TOC entry extracted from table of contents page.
 * Links headline text to page number and hierarchy level.
 */
class TocLink {
  lineItem: LineItem;
  pageNumber: number;
  level: number;

  constructor(options: { lineItem: LineItem; pageNumber: number }) {
    this.lineItem = options.lineItem;
    this.pageNumber = options.pageNumber;
    this.level = 0;
  }
}
