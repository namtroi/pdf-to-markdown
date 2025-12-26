import { Transformation } from './Transformation';
import { ParseResult } from '../ParseResult';
import { LineItem } from '../LineItem';
import { REMOVED_ANNOTATION } from '../Annotation';
import { Page } from '../Page';

// @ts-ignore - React components, converted in Phase 4
import LineItemPageView from '../../components/debug/LineItemPageView';

// Abstract class for transformations producing LineItem(s) to be shown in the LineItemPageView
export abstract class ToLineItemTransformation extends Transformation {
  protected showWhitespaces: boolean = false;

  constructor(name: string) {
    super(name, LineItem.name);
    if (new.target === ToLineItemTransformation) {
      throw new TypeError('Can not construct abstract class.');
    }
  }

  override showModificationCheckbox(): boolean {
    return true;
  }

  override createPageView(page: Page, modificationsOnly?: boolean): any {
    // @ts-ignore
    return LineItemPageView({
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
