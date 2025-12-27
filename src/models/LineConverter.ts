import { TextItem } from './TextItem';
import { Word } from './Word';
import { WordType } from './markdown/WordType';
import { getWordFormatByName } from './markdown/WordFormat';
import { LineItem } from './LineItem';
import { StashingStream } from './StashingStream';
import { ParsedElements } from './PageItem';
import { isNumber, isListItemCharacter } from '../utils/stringFunctions';
import { sortByX } from '../utils/pageItemFunctions';

// Converts text items which have been grouped to a line (through TextItemLineGrouper) to a single LineItem doing inline transformations like
// 'whitespace removal', bold/emphasis annotation, link-detection, etc..
export class LineConverter {
  private fontToFormats: Map<string, string>;

  constructor(fontToFormats: Map<string, string>) {
    this.fontToFormats = fontToFormats;
  }

  // returns a LineItem
  compact(textItems: TextItem[]): LineItem {
    // we can't trust order of occurence, esp. footnoteLinks like to come last
    sortByX(textItems);

    const wordStream = new WordDetectionStream(this.fontToFormats);
    wordStream.consumeAll(
      textItems.map(
        (item) =>
          new TextItem({
            ...item
          })
      )
    );
    const words = wordStream.complete();

    let maxHeight = 0;
    let widthSum = 0;
    textItems.forEach((item) => {
      maxHeight = Math.max(maxHeight, item.height);
      widthSum += item.width;
    });

    const firstItem = textItems[0];
    if (!firstItem) {
      throw new Error('Cannot compact empty text items array');
    }

    return new LineItem({
      x: firstItem.x,
      y: firstItem.y,
      height: maxHeight,
      width: widthSum,
      words: words,
      parsedElements: new ParsedElements({
        footnoteLinks: wordStream.footnoteLinks,
        footnotes: wordStream.footnotes,
        containLinks: wordStream.containLinks,
        formattedWords: wordStream.formattedWords
      })
    });
  }
}

class WordDetectionStream extends StashingStream<TextItem, Word> {
  private fontToFormats: Map<string, string>;
  footnoteLinks: (string | number)[] = [];
  footnotes: (string | number)[] = [];
  formattedWords = 0;
  containLinks = false;

  private firstY?: number;
  private stashedNumber = false;
  private currentItem?: TextItem;

  constructor(fontToFormats: Map<string, string>) {
    super();
    this.fontToFormats = fontToFormats;
  }

  protected shouldStash(item: TextItem): boolean {
    if (!this.firstY) {
      this.firstY = item.y;
    }
    this.currentItem = item;
    return true;
  }

  protected onPushOnStash(item: TextItem): void {
    this.stashedNumber = isNumber(item.text.trim());
  }

  protected doMatchesStash(lastItem: TextItem, item: TextItem): boolean {
    const lastItemFormat = this.fontToFormats.get(lastItem.font);
    const itemFormat = this.fontToFormats.get(item.font);
    if (lastItemFormat !== itemFormat) {
      return false;
    }
    const itemIsANumber = isNumber(item.text.trim());
    return this.stashedNumber === itemIsANumber;
  }

  protected doFlushStash(stash: TextItem[], results: Word[]): void {
    const firstStash = stash[0];
    if (!firstStash) return;

    if (this.stashedNumber) {
      const joinedNumber = stash.map((item) => item.text).join('').trim();
      if (firstStash.y > (this.firstY || 0)) {
        // footnote link
        results.push(
          new Word({
            string: `${joinedNumber}`,
            type: WordType.FOOTNOTE_LINK
          })
        );
        this.footnoteLinks.push(parseInt(joinedNumber, 10));
      } else if (this.currentItem && this.currentItem.y < firstStash.y) {
        // footnote
        results.push(
          new Word({
            string: `${joinedNumber}`,
            type: WordType.FOOTNOTE
          })
        );
        this.footnotes.push(joinedNumber);
      } else {
        this.copyStashItemsAsText(stash, results);
      }
    } else {
      this.copyStashItemsAsText(stash, results);
    }
  }

  private copyStashItemsAsText(stash: TextItem[], results: Word[]): void {
    const firstStash = stash[0];
    if (!firstStash) return;
    const formatName = this.fontToFormats.get(firstStash.font);
    results.push(...this.itemsToWords(stash, formatName));
  }

  private itemsToWords(items: TextItem[], formatName?: string): Word[] {
    const combinedText = combineText(items);
    const words = combinedText.split(' ');
    const format = formatName ? getWordFormatByName(formatName) : null;
    return words
      .filter((w) => w.trim().length > 0)
      .map((word) => {
        let type = null;
        if (word.startsWith('http:')) {
          this.containLinks = true;
          type = WordType.LINK;
        } else if (word.startsWith('www.')) {
          this.containLinks = true;
          word = `http://${word}`;
          type = WordType.LINK;
        }

        if (format) {
          this.formattedWords++;
        }
        return new Word({
          string: word,
          type: type,
          format: format
        });
      });
  }
}

function combineText(textItems: TextItem[]): string {
  let text = '';
  let lastItem: TextItem | undefined;
  textItems.forEach((textItem) => {
    let textToAdd = textItem.text;
    if (!text.endsWith(' ') && !textToAdd.startsWith(' ')) {
      if (lastItem) {
        const xDistance = textItem.x - lastItem.x - lastItem.width;
        if (xDistance > 5) {
          text += ' ';
        }
      } else {
        if (isListItemCharacter(textItem.text)) {
          textToAdd += ' ';
        }
      }
    }
    text += textToAdd;
    lastItem = textItem;
  });
  return text;
}
