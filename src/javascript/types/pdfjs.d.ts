import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

export interface PDFJSTextItem {
    str: string;
    transform: number[];
    width: number;
    height: number;
    fontName: string;
}

export interface PDFJSTextContent {
    items: PDFJSTextItem[];
}

export interface PDFJSViewport {
    transform: number[];
}

// Re-export for convenience
export type { PDFDocumentProxy, PDFPageProxy };
