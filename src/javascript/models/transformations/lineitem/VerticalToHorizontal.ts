import { ToLineItemTransformation } from '../ToLineItemTransformation';
import { ParseResult } from '../../ParseResult';
import { LineItem } from '../../LineItem';
import { StashingStream } from '../../StashingStream';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation';

const MIN_VERTICAL_SPACING = 5;
const MIN_VERTICAL_CHARACTERS = 5;
const INITIAL_MIN_X = 999;

// Converts vertical text to horizontal
export class VerticalToHorizontal extends ToLineItemTransformation {
  constructor() {
    super('Vertical to Horizontal Text');
  }

  override transform(parseResult: ParseResult): ParseResult {
    let foundVerticals = 0;
    parseResult.pages.forEach((page) => {
      const stream = new VerticalsStream();
      stream.consumeAll(page.items);
      page.items = stream.complete();
      foundVerticals += stream.foundVerticals;
    });

    return new ParseResult({
      ...parseResult,
      messages: ['Converted ' + foundVerticals + ' verticals'],
    });
  }
}

class VerticalsStream extends StashingStream {
  foundVerticals: number;

  constructor() {
    super();
    this.foundVerticals = 0;
  }

  override shouldStash(item: LineItem): boolean {
    return item.words.length === 1 && item.words[0]!.string.length === 1;
  }

  override doMatchesStash(lastItem: LineItem, item: LineItem): boolean {
    return lastItem.y - item.y > MIN_VERTICAL_SPACING && (lastItem.words[0]?.type === item.words[0]?.type);
  }

  override doFlushStash(stash: LineItem[], results: LineItem[]): void {
    if (stash.length > MIN_VERTICAL_CHARACTERS) {
      // unite
      const combinedWords: any[] = [];
      let minX = INITIAL_MIN_X;
      let maxY = 0;
      let sumWidth = 0;
      let maxHeight = 0;
      stash.forEach((oneCharacterLine) => {
        oneCharacterLine.annotation = REMOVED_ANNOTATION;
        results.push(oneCharacterLine);
        combinedWords.push(oneCharacterLine.words[0]);
        minX = Math.min(minX, oneCharacterLine.x);
        maxY = Math.max(maxY, oneCharacterLine.y);
        sumWidth += oneCharacterLine.width;
        maxHeight = Math.max(maxHeight, oneCharacterLine.height);
      });
      results.push(
        new LineItem({
          ...stash[0],
          x: minX,
          y: maxY,
          width: sumWidth,
          height: maxHeight,
          words: combinedWords,
          annotation: ADDED_ANNOTATION,
        } as any)
      );
      this.foundVerticals++;
    } else {
      //add as singles
      results.push(...stash);
    }
  }
}
