import { Transformation } from './Transformation';
import { ParseResult } from '../ParseResult';
import { LineItemBlock } from '../LineItemBlock';
import { REMOVED_ANNOTATION } from '../Annotation';
import { Page } from '../Page';

import LineItemBlockPageView from '../../components/debug/LineItemBlockPageView';

// Abstract class for transformations producing LineItemBlock(s) to be shown in the LineItemBlockPageView
export abstract class ToLineItemBlockTransformation extends Transformation {
  protected showWhitespaces: boolean = false;

  constructor(name: string) {
    super(name, LineItemBlock.name);
    if (new.target === ToLineItemBlockTransformation) {
      throw new TypeError('Can not construct abstract class.');
    }
  }

  override showModificationCheckbox(): boolean {
    return true;
  }

  override createPageView(page: Page, modificationsOnly?: boolean): any {

    return LineItemBlockPageView({
      key: page.index,
      page: page,
      modificationsOnly: modificationsOnly,
      showWhitespaces: this.showWhitespaces
    });
  }

  override completeTransform(parseResult: ParseResult): ParseResult {
    // The usual cleanup
    parseResult.messages = [];
    parseResult.pages.forEach((page) => {
      page.items = page.items.filter((item) => !item.annotation || item.annotation !== REMOVED_ANNOTATION);
      page.items.forEach((item) => {
        item.annotation = undefined;
      });
    });
    return parseResult;
  }
}
