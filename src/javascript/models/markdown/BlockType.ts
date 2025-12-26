import { linesToText } from './WordType';

export const BlockType = {
  H1: {
    name: 'H1',
    headline: true,
    headlineLevel: 1,
    toText(block: any) {
      return '# ' + linesToText(block.items, true);
    }
  },
  H2: {
    name: 'H2',
    headline: true,
    headlineLevel: 2,
    toText(block: any) {
      return '## ' + linesToText(block.items, true);
    }
  },
  H3: {
    name: 'H3',
    headline: true,
    headlineLevel: 3,
    toText(block: any) {
      return '### ' + linesToText(block.items, true);
    }
  },
  H4: {
    name: 'H4',
    headline: true,
    headlineLevel: 4,
    toText(block: any) {
      return '#### ' + linesToText(block.items, true);
    }
  },
  H5: {
    name: 'H5',
    headline: true,
    headlineLevel: 5,
    toText(block: any) {
      return '##### ' + linesToText(block.items, true);
    }
  },
  H6: {
    name: 'H6',
    headline: true,
    headlineLevel: 6,
    toText(block: any) {
      return '###### ' + linesToText(block.items, true);
    }
  },
  TOC: {
    name: 'TOC',
    mergeToBlock: true,
    toText(block: any) {
      return linesToText(block.items, true);
    }
  },
  FOOTNOTES: {
    name: 'FOOTNOTES',
    mergeToBlock: true,
    mergeFollowingNonTypedItems: true,
    toText(block: any) {
      return linesToText(block.items, false);
    }
  },
  CODE: {
    name: 'CODE',
    mergeToBlock: true,
    toText(block: any) {
      return '```\n' + linesToText(block.items, true) + '```';
    }
  },
  LIST: {
    name: 'LIST',
    mergeToBlock: true,
    mergeFollowingNonTypedItemsWithSmallDistance: true,
    toText(block: any) {
      return linesToText(block.items, false);
    }
  },
  PARAGRAPH: {
    name: 'PARAGRAPH',
    toText(block: any) {
      return linesToText(block.items, false);
    }
  }
} as const;

export type BlockTypeValue = typeof BlockType[keyof typeof BlockType];

export function isHeadline(type: BlockTypeValue | null | undefined): boolean {
  if (!type) return false;
  return type.name.length === 2 && type.name[0] === 'H';
}

export function blockToText(block: any): string {
  if (!block.type) {
    return linesToText(block.items, false);
  }
  return block.type.toText(block);
}

export function headlineByLevel(level: number): BlockTypeValue {
  switch (level) {
    case 1:
      return BlockType.H1;
    case 2:
      return BlockType.H2;
    case 3:
      return BlockType.H3;
    case 4:
      return BlockType.H4;
    case 5:
      return BlockType.H5;
    case 6:
      return BlockType.H6;
    default:
      throw new Error(`Unsupported headline level: ${level} (supported are 1-6)`);
  }
}
