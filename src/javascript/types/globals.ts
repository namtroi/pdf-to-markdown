import type { LineItem } from '../models/LineItem';
import type { BlockTypeValue } from '../models/markdown/BlockType';

/**
 * GlobalStats interface - shared across all transformations
 *
 * Hybrid approach: strict typing for core properties set by CalculateGlobalStats,
 * with index signature for transformation-specific extensions
 */
export interface GlobalStats {
  // Core statistics (set by CalculateGlobalStats)
  mostUsedHeight: number;
  mostUsedFont: string;
  mostUsedDistance: number;
  maxHeight: number;
  maxHeightFont?: string;
  fontToFormats: Map<string, string>;

  // Optional properties added by specific transformations
  tocPages?: number[];
  headlineTypeToHeightRange?: Record<string, HeightRange>;

  // Extension point for custom transformation data
  // Use 'unknown' instead of 'any' for type safety
  [key: string]: unknown;
}

/**
 * Height range for headline detection
 */
export interface HeightRange {
  min: number;
  max: number;
}

/**
 * Font information from pdfjs-dist
 *
 * Note: Uses internal pdfjs API (_transport.commonObjs)
 * Should handle gracefully if API changes
 */
export interface FontInfo {
  name: string;
  size: number;
  bold: boolean;
  italic: boolean;
}

/**
 * Font object from pdfjs-dist font map
 */
export interface PDFFont {
  name: string;
  // Additional properties can be added as discovered
  [key: string]: unknown;
}

/**
 * Block interface for BlockType operations
 * Represents a block of LineItems with an optional type
 */
export interface Block {
  items: LineItem[];
  type?: BlockTypeValue;
  // Allow additional properties for flexibility
  [key: string]: unknown;
}
