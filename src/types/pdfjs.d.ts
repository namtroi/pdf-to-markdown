import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

/**
 * Raw text item from PDF.js getTextContent().
 * Contains text fragment with positioning from PDF coordinate system.
 */
export interface PDFJSTextItem {
    /** Text content of fragment */
    str: string;
    /** Transform matrix [a, b, c, d, e, f] for positioning */
    transform: number[];
    /** Width in PDF units */
    width: number;
    /** Height in PDF units (font size) */
    height: number;
    /** Font identifier from PDF */
    fontName: string;
}

/**
 * Text content from PDF.js page.getTextContent().
 * Contains all text items extracted from single page.
 */
export interface PDFJSTextContent {
    /** Array of text fragments in reading order */
    items: PDFJSTextItem[];
}

/**
 * Viewport transform for PDF coordinate conversion.
 * Used to convert PDF coordinate system to screen coordinates.
 */
export interface PDFJSViewport {
    /** Transform matrix for coordinate conversion */
    transform: number[];
}

// Re-export for convenience
export type { PDFDocumentProxy, PDFPageProxy };
