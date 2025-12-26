import type { Block } from '../types/globals';

const INVALID_COORDINATE = 999;

/**
 * Interface for items with x-coordinate positioning.
 */
interface HasXCoordinate {
    x: number;
}

/**
 * Finds minimum x-coordinate across all items in blocks.
 * Used to detect left margin for code block detection.
 *
 * @param blocks - Array of blocks containing items
 * @returns Minimum x value found, or null if no items
 */
export function minXFromBlocks(blocks: Block[]): number | null {
    let minX = INVALID_COORDINATE;
    blocks.forEach(block => {
        block.items.forEach((item) => {
            minX = Math.min(minX, item.x);
        });
    });
    if (minX === INVALID_COORDINATE) {
        return null;
    }
    return minX;
}

/**
 * Finds minimum x-coordinate from array of page items.
 * Used to detect left margin for indentation analysis.
 *
 * @param items - Array of items with x coordinates
 * @returns Minimum x value found, or null if no items
 */
export function minXFromPageItems(items: HasXCoordinate[]): number | null {
    let minX = INVALID_COORDINATE;
    items.forEach(item => {
        minX = Math.min(minX, item.x);
    });
    if (minX === INVALID_COORDINATE) {
        return null;
    }
    return minX;
}

/**
 * Sorts items in-place by x-coordinate (left to right).
 * Used to ensure correct reading order within a line.
 *
 * @param items - Array of items to sort (mutated)
 */
export function sortByX<T extends HasXCoordinate>(items: T[]): void {
    items.sort((a, b) => {
        return a.x - b.x;
    });
}

/**
 * Creates sorted copy of items by x-coordinate.
 *
 * @param items - Array of items to sort
 * @returns New array sorted by x-coordinate
 */
export function sortCopyByX<T extends HasXCoordinate>(items: T[]): T[] {
    const copy = items.concat();
    sortByX(copy);
    return copy;
}
