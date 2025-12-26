import { Transformation } from './Transformation';
import { ParseResult } from '../ParseResult';
import { Page } from '../Page';

// @ts-ignore - React components, converted in Phase 4
import MarkdownPageView from '../../components/debug/MarkdownPageView.jsx';

export class ToMarkdown extends Transformation {
  constructor() {
    super('To Markdown', 'String');
  }

  override createPageView(page: Page, _modificationsOnly?: boolean): any {
    return MarkdownPageView({
      key: page.index,
      page: page,
    });
  }

  override transform(parseResult: ParseResult): ParseResult {
    parseResult.pages.forEach((page) => {
      let text = '';
      page.items.forEach((block: any) => {
        text += block.text + '\n';
      });
      page.items = [text] as any;
    });
    return new ParseResult({
      ...parseResult,
    });
  }
}
