import { expect, describe, it } from 'vitest';

import { HeadlineFinder } from '../src/models/HeadlineFinder';
import { LineItem } from '../src/models/LineItem';

describe('HeadlineFinder', () => {

    it('Not Found - Case 1', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item1 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'My '
        });
        const item2 = new LineItem({
            x: 10, y: 0, width: 10, height: 10,
            text: 'Little'
        });
        const item3 = new LineItem({
            x: 20, y: 0, width: 10, height: 10,
            text: ' Headline2'
        });

        expect(headlineFinder.consume(item1)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(1);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.consume(item2)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(2);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.consume(item3)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(0);

    });

    it('Found - Simple', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item1 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'My '
        });
        const item2 = new LineItem({
            x: 10, y: 0, width: 10, height: 10,
            text: 'Little'
        });
        const item3 = new LineItem({
            x: 20, y: 0, width: 10, height: 10,
            text: ' Headline'
        });

        expect(headlineFinder.consume(item1)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(1);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.consume(item2)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(2);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.consume(item3)).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.stackedLineItems).toContain(item3);

    });

    it('Found - Waste in beginning', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item0 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'Waste '
        });
        const item1 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'My '
        });
        const item2 = new LineItem({
            x: 10, y: 0, width: 10, height: 10,
            text: 'Little'
        });
        const item3 = new LineItem({
            x: 20, y: 0, width: 10, height: 10,
            text: ' Headline'
        });

        expect(headlineFinder.consume(item0)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(0);
        expect(headlineFinder.consume(item1)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(1);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.consume(item2)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(2);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.consume(item3)).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.stackedLineItems).toContain(item3);

    });

    it('Found - Duplicate in beginning', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'My Little Headline'
        });
        const item0 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'My '
        });
        const item1 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'My '
        });
        const item2 = new LineItem({
            x: 10, y: 0, width: 10, height: 10,
            text: 'Little'
        });
        const item3 = new LineItem({
            x: 20, y: 0, width: 10, height: 10,
            text: ' Headline'
        });

        expect(headlineFinder.consume(item0)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(1);
        expect(headlineFinder.stackedLineItems).toContain(item0);
        expect(headlineFinder.consume(item1)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(1);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.consume(item2)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(2);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.consume(item3)).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.stackedLineItems).toContain(item3);

    });

    it('Found - Mixed up case and Whitespace', () => {
        const headlineFinder = new HeadlineFinder({
            headline: 'MYLitt le HEADline'
        });
        const item1 = new LineItem({
            x: 0, y: 0, width: 10, height: 10,
            text: 'My '
        });
        const item2 = new LineItem({
            x: 10, y: 0, width: 10, height: 10,
            text: 'Little'
        });
        const item3 = new LineItem({
            x: 20, y: 0, width: 10, height: 10,
            text: ' Headline'
        });

        expect(headlineFinder.consume(item1)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(1);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.consume(item2)).toBe(null);
        expect(headlineFinder.stackedLineItems).toHaveLength(2);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.consume(item3)).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toHaveLength(3);
        expect(headlineFinder.stackedLineItems).toContain(item1);
        expect(headlineFinder.stackedLineItems).toContain(item2);
        expect(headlineFinder.stackedLineItems).toContain(item3);

    });

});
