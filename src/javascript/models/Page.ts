import type { PageItem } from './PageItem';

// A page which holds PageItems displayable via PdfPageView
export class Page {
  index: number;
  items: PageItem[];

  constructor(options: { index: number; items?: PageItem[] }) {
    this.index = options.index;
    this.items = options.items || [];
  }
}
