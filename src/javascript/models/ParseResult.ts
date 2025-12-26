import type { Page } from './Page';
import type { GlobalStats } from '../types/globals';

// The result of a PDF parse respectively a Transformation
export class ParseResult {
  pages: Page[];
  globals?: GlobalStats; // properties accessible for all the following transformations in debug mode
  messages?: string[]; // something to show only for the transformation in debug mode

  constructor(options: { pages: Page[]; globals?: GlobalStats; messages?: string[] }) {
    this.pages = options.pages;
    this.globals = options.globals;
    this.messages = options.messages;
  }
}
