import { expect, describe, it } from 'vitest';

import { StashingStream } from '../../src/models/StashingStream';

describe('StashingStream', () => {

    it('Simple', () => {
        const stream = new MyStashingStream();

        stream.consume('a');
        stream.consume('b');
        stream.consume('a');
        stream.consume('a');
        stream.consume('z');
        stream.consume('m');
        stream.consume('m');
        stream.consume('z');
        stream.consume('z');
        stream.consume('c');
        stream.consume('e');
        stream.consume('f');
        stream.consume('m');
        stream.consume('a');

        const resultsAsString = stream.complete().join('');

        expect(resultsAsString).toBe('AbAAZZZcefA');
        expect(stream.transformedItems).toBe(10);
    });

    it('ConsumeAll', () => {
        const items = ['k', 'k', 'x', 'a', 'm', 'z', 'o', 'p']
        const stream = new MyStashingStream();
        stream.consumeAll(items);

        const resultsAsString = stream.complete().join('');
        expect(resultsAsString).toBe('kkxAZop');
        expect(stream.transformedItems).toBe(3);
    });

});


class MyStashingStream extends StashingStream {
    transformedItems: number;

    constructor() {
        super();
        this.transformedItems = 0;
    }

    shouldStash(item: any): boolean {
        return item === 'a' || item === 'z' || item === 'm';
    }

    doMatchesStash(lastItem: any, item: any): boolean {
        return lastItem === item;
    }

    doFlushStash(stash: any[], results: any[]): void {
        this.transformedItems += stash.length;
        results.push(...stash.filter((elem: any) => elem !== 'm').map((item: any) => item.toUpperCase()));
    }
}
