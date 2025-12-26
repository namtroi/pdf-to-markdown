declare module 'remarkable' {
    export interface RemarkableOptions {
        breaks?: boolean;
        html?: boolean;
        [key: string]: any;
    }

    export default class Remarkable {
        constructor(options?: RemarkableOptions);
        render(markdown: string): string;
    }
}
