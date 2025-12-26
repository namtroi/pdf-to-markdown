const INVALID_COORDINATE = 999;

export function minXFromBlocks(blocks: any[]): number | null {
    let minX = INVALID_COORDINATE;
    blocks.forEach(block => {
        block.items.forEach((item: any) => {
            minX = Math.min(minX, item.x);
        });
    });
    if (minX === INVALID_COORDINATE) {
        return null;
    }
    return minX;
}

export function minXFromPageItems(items: any[]): number | null {
    let minX = INVALID_COORDINATE;
    items.forEach(item => {
        minX = Math.min(minX, item.x);
    });
    if (minX === INVALID_COORDINATE) {
        return null;
    }
    return minX;
}

export function sortByX(items: any[]): void {
    items.sort((a: any, b: any) => {
        return a.x - b.x;
    });
}

export function sortCopyByX(items: any[]): any[] {
    const copy = items.concat();
    sortByX(copy);
    return copy;
}
