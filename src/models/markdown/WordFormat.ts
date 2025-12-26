/**
 * Markdown inline formatting types (bold, italic, bold+italic).
 * Maps to markdown symbols for wrapping text.
 */
export const WordFormat = {
  /** Bold text: **text** */
  BOLD: {
    name: 'BOLD',
    startSymbol: '**',
    endSymbol: '**'
  },
  /** Italic text: _text_ */
  OBLIQUE: {
    name: 'OBLIQUE',
    startSymbol: '_',
    endSymbol: '_'
  },
  /** Bold+italic text: **_text_** */
  BOLD_OBLIQUE: {
    name: 'BOLD_OBLIQUE',
    startSymbol: '**_',
    endSymbol: '_**'
  }
} as const;

/** Union type of all word format values */
export type WordFormatValue = typeof WordFormat[keyof typeof WordFormat];

/**
 * Finds word format by name string.
 *
 * @param name - Format name ('BOLD', 'OBLIQUE', 'BOLD_OBLIQUE')
 * @returns Format object or null if not found
 */
export function getWordFormatByName(name: string): WordFormatValue | null {
  const value = (WordFormat as Record<string, any>)[name];
  return value || null;
}
