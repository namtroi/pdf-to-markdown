import type { WordTypeValue } from './markdown/WordType';
import type { WordFormatValue } from './markdown/WordFormat';

export class Word {
  string: string;
  type?: WordTypeValue | null;
  format?: WordFormatValue | null;

  constructor(options: { string: string; type?: WordTypeValue | null; format?: WordFormatValue | null }) {
    this.string = options.string;
    this.type = options.type;
    this.format = options.format;
  }
}
