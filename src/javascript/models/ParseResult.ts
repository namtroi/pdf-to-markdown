import type { Page } from './Page';

// The result of a PDF parse respectively a Transformation
export class ParseResult {
  pages: Page[];
  globals?: Record<string, any>; // properties accessible for all the following transformations in debug mode
  messages?: string[]; // something to show only for the transformation in debug mode

  constructor(options: { pages: Page[]; globals?: Record<string, any>; messages?: string[] }) {
    this.pages = options.pages;
    this.globals = options.globals;
    this.messages = options.messages;
  }
}
