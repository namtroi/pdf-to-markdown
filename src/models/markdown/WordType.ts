/**
 * Special word types for markdown conversion (links, footnotes).
 * Each type defines how to render the word in markdown.
 */
export const WordType = {
  /** URL or link: [text](url) */
  LINK: {
    name: 'LINK' as const,
    attachWithoutWhitespace: false,
    plainTextFormat: false,
    toText(string: string) {
      return `[${string}](${string})`;
    }
  },
  /** Footnote reference: ^1 */
  FOOTNOTE_LINK: {
    name: 'FOOTNOTE_LINK' as const,
    attachWithoutWhitespace: true,
    plainTextFormat: true,
    toText(string: string) {
      return `^${string}`;
      // return `<sup>[${string}](#${string})</sup>`;
    }
  },
  /** Footnote definition: (^1) */
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

/** Union type of all word type values */
export type WordTypeValue = typeof WordType[keyof typeof WordType];

/** Minimal LineItem interface for markdown conversion */
export interface LineItem {
  words: Array<{
    string: string;
    type?: WordTypeValue | null;
    format?: WordFormatValue | null;
  }>;
}

/**
 * Converts line items to markdown text.
 * Handles inline formatting (bold/italic) and special word types (links/footnotes).
 * Properly opens/closes formatting across line boundaries.
 *
 * @param lineItems - Lines to convert
 * @param disableInlineFormats - Skip inline formatting (for headers)
 * @returns Markdown text with newlines between lines
 */
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
