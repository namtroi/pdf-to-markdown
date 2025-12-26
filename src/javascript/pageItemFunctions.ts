import type { Block } from './types/globals';

const INVALID_COORDINATE = 999;

interface HasXCoordinate {
    x: number;
}

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

export function sortByX<T extends HasXCoordinate>(items: T[]): void {
    items.sort((a, b) => {
        return a.x - b.x;
    });
}

export function sortCopyByX<T extends HasXCoordinate>(items: T[]): T[] {
    const copy = items.concat();
    sortByX(copy);
    return copy;
}
