// Word format definitions for markdown styling
export const WordFormat = {
  BOLD: {
    name: 'BOLD',
    startSymbol: '**',
    endSymbol: '**'
  },
  OBLIQUE: {
    name: 'OBLIQUE',
    startSymbol: '_',
    endSymbol: '_'
  },
  BOLD_OBLIQUE: {
    name: 'BOLD_OBLIQUE',
    startSymbol: '**_',
    endSymbol: '_**'
  }
} as const;

export type WordFormatValue = typeof WordFormat[keyof typeof WordFormat];

export function getWordFormatByName(name: string): WordFormatValue | null {
  const value = (WordFormat as Record<string, any>)[name];
  return value || null;
}
