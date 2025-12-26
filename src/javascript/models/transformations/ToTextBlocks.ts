import { Transformation } from './Transformation';
import { ParseResult } from '../ParseResult';
import { Page } from '../Page';
import { blockToText } from '../markdown/BlockType';

// @ts-ignore - React components, converted in Phase 4
import TextPageView from '../../components/debug/TextPageView.jsx';

export class ToTextBlocks extends Transformation {
  constructor() {
    super('To Text Blocks', 'TextBlock');
  }

  override createPageView(page: Page, _modificationsOnly?: boolean): any {
    return TextPageView({
      key: page.index,
      page: page,
    });
  }

  override transform(parseResult: ParseResult): ParseResult {
    parseResult.pages.forEach((page) => {
      const textItems: Array<{ category: string; text: string }> = [];
      page.items.forEach((block: any) => {
        //TODO category to type (before have no unknowns, have paragraph)
        const category = block.type ? block.type.name : 'Unknown';
        textItems.push({
          category: category,
          text: blockToText(block),
        });
      });
      page.items = textItems as any;
    });
    return new ParseResult({
      ...parseResult,
    });
  }
}
