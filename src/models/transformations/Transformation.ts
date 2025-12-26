import { ParseResult } from '../ParseResult';
import { Page } from '../Page';

// A transformation from a ParseResult to another ParseResult
export abstract class Transformation {
  protected name: string;
  protected itemType: string;

  constructor(name: string, itemType: string) {
    if (new.target === Transformation) {
      throw new TypeError('Can not construct abstract class.');
    }
    if (this.transform === Transformation.prototype.transform) {
      throw new TypeError("Please implement abstract method 'transform()'.");
    }
    this.name = name;
    this.itemType = itemType;
  }

  showModificationCheckbox(): boolean {
    return false;
  }

  createPageView(_page: Page, _modificationsOnly?: boolean): any {
    throw new TypeError('Do not call abstract method createPageView from child.');
  }

  // Transform an incoming ParseResult into an outgoing ParseResult
  abstract transform(parseResult: ParseResult): ParseResult;

  // Sometimes the transform() does only visualize a change. This method then does the actual change.
  completeTransform(parseResult: ParseResult): ParseResult {
    parseResult.messages = [];
    return parseResult;
  }
}
