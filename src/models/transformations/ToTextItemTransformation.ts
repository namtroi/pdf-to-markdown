import { Transformation } from './Transformation';
import { ParseResult } from '../ParseResult';
import { TextItem } from '../TextItem';
import { REMOVED_ANNOTATION } from '../Annotation';
import { Page } from '../Page';

// @ts-ignore - React components, converted in Phase 6
import TextItemPageView from '../../components/debug/TextItemPageView';

// Abstract class for transformations producing TextItem(s) to be shown in the TextItemPageView
export abstract class ToTextItemTransformation extends Transformation {
  protected showWhitespaces: boolean = false;

  constructor(name: string) {
    super(name, TextItem.name);
    if (new.target === ToTextItemTransformation) {
      throw new TypeError('Can not construct abstract class.');
    }
  }

  override showModificationCheckbox(): boolean {
    return true;
  }

  override createPageView(page: Page, modificationsOnly?: boolean): any {
    // @ts-ignore
    return TextItemPageView({
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
