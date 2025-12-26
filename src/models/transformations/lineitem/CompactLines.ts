import { ToLineItemTransformation } from '../ToLineItemTransformation';
import { ParseResult } from '../../ParseResult';
import { LineItem } from '../../LineItem';
import { TextItemLineGrouper } from '../../TextItemLineGrouper';
// @ts-ignore - LineConverter not yet typed
import { LineConverter } from '../../LineConverter';
import { BlockType } from '../../markdown/BlockType';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation';

// gathers text items on the same y line to one line item
export class CompactLines extends ToLineItemTransformation {
  constructor() {
    super('Compact To Lines');
  }

  override transform(parseResult: ParseResult): ParseResult {
    // @ts-ignore - globals not typed
    const { mostUsedDistance, fontToFormats } = parseResult.globals;
    const foundFootnotes: any[] = [];
    const foundFootnoteLinks: any[] = [];
    let linkCount = 0;
    let formattedWords = 0;

    const lineGrouper = new TextItemLineGrouper({
      mostUsedDistance: mostUsedDistance,
    });
    const lineCompactor = new LineConverter(fontToFormats);

    parseResult.pages.forEach((page) => {
      if (page.items.length > 0) {
        const lineItems: LineItem[] = [];
        // @ts-ignore - TextItem type conversion
        const textItemsGroupedByLine = lineGrouper.group(page.items);
        textItemsGroupedByLine.forEach((lineTextItems: any[]) => {
          const lineItem = lineCompactor.compact(lineTextItems);
          if (lineTextItems.length > 1) {
            lineItem.annotation = ADDED_ANNOTATION;
            lineTextItems.forEach((item: any) => {
              item.annotation = REMOVED_ANNOTATION;
              lineItems.push(
                new LineItem({
                  ...item,
                })
              );
            });
          }
          if (lineItem.words.length === 0) {
            lineItem.annotation = REMOVED_ANNOTATION;
          }
          lineItems.push(lineItem);

          if (lineItem.parsedElements?.formattedWords) {
            formattedWords += lineItem.parsedElements.formattedWords;
          }
          if (lineItem.parsedElements?.containLinks) {
            linkCount++;
          }
          if (lineItem.parsedElements?.footnoteLinks && lineItem.parsedElements.footnoteLinks.length > 0) {
            const footnoteLinks = lineItem.parsedElements.footnoteLinks.map((footnoteLink: any) => ({
              footnoteLink,
              pageIndex: page.index,
            }));
            foundFootnoteLinks.push(...footnoteLinks);
          }
          if (lineItem.parsedElements?.footnotes && lineItem.parsedElements.footnotes.length > 0) {
            lineItem.type = BlockType.FOOTNOTES;
            const footnotes = lineItem.parsedElements.footnotes.map((footnote: any) => ({
              footnote,
              pageIndex: page.index,
            }));
            foundFootnotes.push(...footnotes);
          }
        });
        page.items = lineItems as any;
      }
    });

    return new ParseResult({
      ...parseResult,
      messages: [
        'Detected ' + formattedWords + ' formatted words',
        'Found ' + linkCount + ' links',
        'Detected ' + foundFootnoteLinks.length + ' footnotes links',
        'Detected ' + foundFootnotes.length + ' footnotes',
      ],
    });
  }
}
