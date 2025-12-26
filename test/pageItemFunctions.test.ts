import { describe, it, expect } from 'vitest';
import {
    minXFromBlocks,
    minXFromPageItems,
    sortByX,
    sortCopyByX
} from '../src/javascript/pageItemFunctions';

describe('pageItemFunctions', () => {
    describe('minXFromBlocks', () => {
        it('returns minimum x coordinate from blocks', () => {
            const blocks = [
                { items: [{ x: 100 }, { x: 50 }, { x: 75 }] },
                { items: [{ x: 25 }, { x: 200 }] }
            ];
            expect(minXFromBlocks(blocks)).toBe(25);
        });

        it('returns minimum x from single block', () => {
            const blocks = [
                { items: [{ x: 100 }, { x: 50 }, { x: 75 }] }
            ];
            expect(minXFromBlocks(blocks)).toBe(50);
        });

        it('returns null for empty blocks array', () => {
            expect(minXFromBlocks([])).toBe(null);
        });

        it('returns null for blocks with no items', () => {
            const blocks = [
                { items: [] },
                { items: [] }
            ];
            expect(minXFromBlocks(blocks)).toBe(null);
        });

        it('handles single item in single block', () => {
            const blocks = [
                { items: [{ x: 42 }] }
            ];
            expect(minXFromBlocks(blocks)).toBe(42);
        });

        it('handles negative x coordinates', () => {
            const blocks = [
                { items: [{ x: 10 }, { x: -5 }, { x: 20 }] }
            ];
            expect(minXFromBlocks(blocks)).toBe(-5);
        });

        it('handles x coordinate of 0', () => {
            const blocks = [
                { items: [{ x: 0 }, { x: 10 }, { x: 20 }] }
            ];
            expect(minXFromBlocks(blocks)).toBe(0);
        });
    });

    describe('minXFromPageItems', () => {
        it('returns minimum x coordinate from items', () => {
            const items = [
                { x: 100 },
                { x: 50 },
                { x: 75 },
                { x: 25 },
                { x: 200 }
            ];
            expect(minXFromPageItems(items)).toBe(25);
        });

        it('returns minimum x from single item', () => {
            const items = [{ x: 42 }];
            expect(minXFromPageItems(items)).toBe(42);
        });

        it('returns null for empty items array', () => {
            expect(minXFromPageItems([])).toBe(null);
        });

        it('handles negative x coordinates', () => {
            const items = [
                { x: 10 },
                { x: -5 },
                { x: 20 }
            ];
            expect(minXFromPageItems(items)).toBe(-5);
        });

        it('handles x coordinate of 0', () => {
            const items = [
                { x: 0 },
                { x: 10 },
                { x: 20 }
            ];
            expect(minXFromPageItems(items)).toBe(0);
        });

        it('handles all items with same x coordinate', () => {
            const items = [
                { x: 50 },
                { x: 50 },
                { x: 50 }
            ];
            expect(minXFromPageItems(items)).toBe(50);
        });
    });

    describe('sortByX', () => {
        it('sorts items by x coordinate in ascending order', () => {
            const items = [
                { x: 100, text: 'c' },
                { x: 50, text: 'b' },
                { x: 25, text: 'a' }
            ];
            sortByX(items);
            expect(items[0]?.x).toBe(25);
            expect(items[1]?.x).toBe(50);
            expect(items[2]?.x).toBe(100);
        });

        it('modifies array in place', () => {
            const items = [
                { x: 100, text: 'c' },
                { x: 50, text: 'b' }
            ];
            const originalRef = items;
            sortByX(items);
            expect(items).toBe(originalRef); // same reference
            expect(items[0]?.x).toBe(50);
        });

        it('handles already sorted array', () => {
            const items = [
                { x: 10, text: 'a' },
                { x: 20, text: 'b' },
                { x: 30, text: 'c' }
            ];
            sortByX(items);
            expect(items[0]?.x).toBe(10);
            expect(items[1]?.x).toBe(20);
            expect(items[2]?.x).toBe(30);
        });

        it('handles single item', () => {
            const items = [{ x: 42 }];
            sortByX(items);
            expect(items[0]?.x).toBe(42);
        });

        it('handles empty array', () => {
            const items: any[] = [];
            sortByX(items);
            expect(items).toEqual([]);
        });

        it('handles items with same x coordinate', () => {
            const items = [
                { x: 50, text: 'a' },
                { x: 50, text: 'b' },
                { x: 50, text: 'c' }
            ];
            sortByX(items);
            expect(items[0]?.x).toBe(50);
            expect(items[1]?.x).toBe(50);
            expect(items[2]?.x).toBe(50);
        });

        it('handles negative x coordinates', () => {
            const items = [
                { x: 10 },
                { x: -5 },
                { x: 0 },
                { x: -10 }
            ];
            sortByX(items);
            expect(items[0]?.x).toBe(-10);
            expect(items[1]?.x).toBe(-5);
            expect(items[2]?.x).toBe(0);
            expect(items[3]?.x).toBe(10);
        });
    });

    describe('sortCopyByX', () => {
        it('returns sorted copy without modifying original', () => {
            const items = [
                { x: 100, text: 'c' },
                { x: 50, text: 'b' },
                { x: 25, text: 'a' }
            ];
            const sorted = sortCopyByX(items);

            // Original unchanged
            expect(items[0]?.x).toBe(100);
            expect(items[1]?.x).toBe(50);
            expect(items[2]?.x).toBe(25);

            // Copy is sorted
            expect(sorted[0]?.x).toBe(25);
            expect(sorted[1]?.x).toBe(50);
            expect(sorted[2]?.x).toBe(100);
        });

        it('returns different array reference', () => {
            const items = [
                { x: 100 },
                { x: 50 }
            ];
            const sorted = sortCopyByX(items);
            expect(sorted).not.toBe(items); // different reference
        });

        it('handles single item', () => {
            const items = [{ x: 42 }];
            const sorted = sortCopyByX(items);
            expect(sorted[0]?.x).toBe(42);
            expect(sorted).not.toBe(items);
        });

        it('handles empty array', () => {
            const items: any[] = [];
            const sorted = sortCopyByX(items);
            expect(sorted).toEqual([]);
            expect(sorted).not.toBe(items);
        });

        it('handles already sorted array', () => {
            const items = [
                { x: 10 },
                { x: 20 },
                { x: 30 }
            ];
            const sorted = sortCopyByX(items);
            expect(sorted[0]?.x).toBe(10);
            expect(sorted[1]?.x).toBe(20);
            expect(sorted[2]?.x).toBe(30);
            expect(items[0]?.x).toBe(10); // original unchanged
        });
    });
});
