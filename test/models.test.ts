import { describe, it, expect } from 'vitest';
import { TextItem } from '../src/models/TextItem';
import { Word } from '../src/models/Word';
import { ParseResult } from '../src/models/ParseResult';
import { WordFormat } from '../src/models/markdown/WordFormat';
import { WordType } from '../src/models/markdown/WordType';
import { Page } from '../src/models/Page';

describe('Models', () => {
    describe('TextItem', () => {
        it('creates TextItem with required properties', () => {
            const item = new TextItem({
                x: 10,
                y: 20,
                width: 100,
                height: 12,
                text: 'Hello World',
                font: 'Arial'
            });

            expect(item.x).toBe(10);
            expect(item.y).toBe(20);
            expect(item.width).toBe(100);
            expect(item.height).toBe(12);
            expect(item.text).toBe('Hello World');
            expect(item.font).toBe('Arial');
        });

        it('creates TextItem with optional properties', () => {
            const item = new TextItem({
                x: 10,
                y: 20,
                width: 100,
                height: 12,
                text: 'Test',
                font: 'Arial',
                lineFormat: WordFormat.BOLD,
                unopenedFormat: WordFormat.OBLIQUE,
                unclosedFormat: WordFormat.BOLD_OBLIQUE
            });

            expect(item.lineFormat).toBe(WordFormat.BOLD);
            expect(item.unopenedFormat).toBe(WordFormat.OBLIQUE);
            expect(item.unclosedFormat).toBe(WordFormat.BOLD_OBLIQUE);
        });
    });

    describe('Word', () => {
        it('creates Word with string', () => {
            const word = new Word({ string: 'test' });
            expect(word.string).toBe('test');
            expect(word.type).toBeUndefined();
            expect(word.format).toBeUndefined();
        });

        it('creates Word with type and format', () => {
            const word = new Word({
                string: 'test',
                type: WordType.LINK,
                format: WordFormat.BOLD
            });

            expect(word.string).toBe('test');
            expect(word.type).toBe(WordType.LINK);
            expect(word.format).toBe(WordFormat.BOLD);
        });
    });

    describe('ParseResult', () => {
        it('creates ParseResult with pages', () => {
            const pages = [
                new Page({
                    index: 0,
                    items: [new TextItem({ text: 'Page 1', x: 0, y: 0, width: 100, height: 12, font: 'Arial' })]
                })
            ];

            const result = new ParseResult({
                pages: pages
            });

            expect(result.pages).toEqual(pages);
        });

        it('creates ParseResult with globals and messages', () => {
            const result = new ParseResult({
                pages: [],
                globals: {
                    mostUsedHeight: 12,
                    mostUsedFont: 'Arial',
                    mostUsedDistance: 10,
                    maxHeight: 14,
                    fontToFormats: new Map()
                },
                messages: ['Test message']
            });

            expect(result.globals?.mostUsedHeight).toBe(12);
            expect(result.messages).toEqual(['Test message']);
        });

        it('messages and globals are optional', () => {
            const result = new ParseResult({ pages: [] });
            expect(result.messages).toBeUndefined();
            expect(result.globals).toBeUndefined();
        });

        it('can create with empty messages array', () => {
            const result = new ParseResult({ pages: [], messages: [] });
            expect(result.messages).toEqual([]);
            expect(Array.isArray(result.messages)).toBe(true);
        });
    });
});
