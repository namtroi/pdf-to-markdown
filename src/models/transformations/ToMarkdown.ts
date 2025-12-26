import { Transformation } from './Transformation';
import { ParseResult } from '../ParseResult';
import { Page } from '../Page';

// @ts-ignore - React components, converted in Phase 4
import MarkdownPageView from '../../components/debug/MarkdownPageView';

/**
 * Final transformation: Converts structured blocks to markdown strings.
 * Collapses all block items into single text string per page.
 * Assumes blocks already have .text property with markdown formatting applied.
 */
export class ToMarkdown extends Transformation {
  constructor() {
    super('To Markdown', 'String');
  }

  /**
   * Creates debug view component for markdown output.
   *
   * @param page - Page with markdown text
   * @param _modificationsOnly - Unused in this transformation
   * @returns React component for visualization
   */
  override createPageView(page: Page, _modificationsOnly?: boolean): any {
    // @ts-ignore
    return MarkdownPageView({
      key: page.index,
      page: page,
    });
  }

  /**
   * Joins all block text into single markdown string per page.
   * Each block's text is newline-separated.
   *
   * @param parseResult - Blocks with markdown text
   * @returns ParseResult with pages containing single text string
   */
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
