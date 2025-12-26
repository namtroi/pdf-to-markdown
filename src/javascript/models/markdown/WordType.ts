// Word type definitions for markdown formatting
export const WordType = {
  LINK: {
    name: 'LINK' as const,
    attachWithoutWhitespace: false,
    plainTextFormat: false,
    toText(string: string) {
      return `[${string}](${string})`;
    }
  },
  FOOTNOTE_LINK: {
    name: 'FOOTNOTE_LINK' as const,
    attachWithoutWhitespace: true,
    plainTextFormat: true,
    toText(string: string) {
      return `^${string}`;
      // return `<sup>[${string}](#${string})</sup>`;
    }
  },
  FOOTNOTE: {
    name: 'FOOTNOTE' as const,
    attachWithoutWhitespace: false,
    plainTextFormat: false,
    toText(string: string) {
      return `(^${string})`;
    }
  }
} as const;

import type { WordFormatValue } from './WordFormat';

export type WordTypeValue = typeof WordType[keyof typeof WordType];

export interface LineItem {
  words: Array<{
    string: string;
    type?: WordTypeValue | null;
    format?: WordFormatValue | null;
  }>;
}

export function linesToText(lineItems: LineItem[], disableInlineFormats?: boolean): string {
  let text = '';
  let openFormat: WordFormatValue | null = null;

  const closeFormat = () => {
    if (openFormat) {
      text += openFormat.endSymbol;
      openFormat = null;
    }
  };

  lineItems.forEach((line, lineIndex) => {
    line.words.forEach((word, i) => {
      const wordType = word.type;
      const wordFormat = word.format;
      if (openFormat && (!wordFormat || wordFormat !== openFormat)) {
        closeFormat();
      }

      if (i > 0 && !(wordType && wordType.attachWithoutWhitespace) && !isPunctationCharacter(word.string)) {
        text += ' ';
      }

      if (wordFormat && !openFormat && !disableInlineFormats) {
        openFormat = wordFormat;
        text += openFormat.startSymbol;
      }

      if (wordType && (!disableInlineFormats || wordType.plainTextFormat)) {
        text += wordType.toText(word.string);
      } else {
        text += word.string;
      }
    });
    const nextLine = lineIndex < lineItems.length - 1 ? lineItems[lineIndex + 1] : null;
    if (openFormat && (lineIndex === lineItems.length - 1 || !nextLine || firstFormat(nextLine) !== openFormat)) {
      closeFormat();
    }
    text += '\n';
  });
  return text;
}

function firstFormat(lineItem: LineItem | null): WordFormatValue | null {
  if (!lineItem || lineItem.words.length === 0) {
    return null;
  }
  const firstWord = lineItem.words[0];
  return firstWord ? firstWord.format ?? null : null;
}

function isPunctationCharacter(string: string): boolean {
  if (string.length !== 1) {
    return false;
  }
  return string[0] === '.' || string[0] === '!' || string[0] === '?';
}
