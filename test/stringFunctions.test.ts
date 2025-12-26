import { describe, it, expect } from 'vitest';
import {
    isDigit,
    isNumber,
    hasOnly,
    hasUpperCaseCharacterInMiddleOfWord,
    normalizedCharCodeArray,
    charCodeArray,
    removeLeadingWhitespaces,
    removeTrailingWhitespaces,
    prefixAfterWhitespace,
    suffixBeforeWhitespace,
    isListItemCharacter,
    isListItem,
    isNumberedListItem,
    wordMatch
} from '../src/javascript/stringFunctions';

describe('stringFunctions', () => {
    describe('isDigit', () => {
        it('returns true for digit char codes (48-57)', () => {
            expect(isDigit(48)).toBe(true);  // '0'
            expect(isDigit(49)).toBe(true);  // '1'
            expect(isDigit(53)).toBe(true);  // '5'
            expect(isDigit(57)).toBe(true);  // '9'
        });

        it('returns false for non-digit char codes', () => {
            expect(isDigit(47)).toBe(false);  // '/' (before '0')
            expect(isDigit(58)).toBe(false);  // ':' (after '9')
            expect(isDigit(65)).toBe(false);  // 'A'
            expect(isDigit(32)).toBe(false);  // space
        });
    });

    describe('isNumber', () => {
        it('returns true for numeric strings', () => {
            expect(isNumber('0')).toBe(true);
            expect(isNumber('123')).toBe(true);
            expect(isNumber('999')).toBe(true);
            expect(isNumber('42')).toBe(true);
        });

        it('returns false for non-numeric strings', () => {
            expect(isNumber('abc')).toBe(false);
            expect(isNumber('12a')).toBe(false);
            expect(isNumber('a12')).toBe(false);
            expect(isNumber('1.5')).toBe(false);  // decimal point
            expect(isNumber('1 2')).toBe(false);  // space
            expect(isNumber('')).toBe(true);  // empty string (no chars to check)
        });
    });

    describe('hasOnly', () => {
        it('returns true when string contains only specified character', () => {
            expect(hasOnly('aaa', 'a')).toBe(true);
            expect(hasOnly('---', '-')).toBe(true);
            expect(hasOnly('...', '.')).toBe(true);
            expect(hasOnly('x', 'x')).toBe(true);
        });

        it('returns false when string contains other characters', () => {
            expect(hasOnly('aab', 'a')).toBe(false);
            expect(hasOnly('baa', 'a')).toBe(false);
            expect(hasOnly('aba', 'a')).toBe(false);
            expect(hasOnly('abc', 'a')).toBe(false);
        });

        it('returns true for empty string', () => {
            expect(hasOnly('', 'a')).toBe(true);
        });
    });

    describe('hasUpperCaseCharacterInMiddleOfWord', () => {
        it('returns true for camelCase words', () => {
            expect(hasUpperCaseCharacterInMiddleOfWord('camelCase')).toBe(true);
            expect(hasUpperCaseCharacterInMiddleOfWord('myVariable')).toBe(true);
            expect(hasUpperCaseCharacterInMiddleOfWord('iPhone')).toBe(true);
        });

        it('returns false for proper capitalization', () => {
            expect(hasUpperCaseCharacterInMiddleOfWord('Title Case')).toBe(false);
            expect(hasUpperCaseCharacterInMiddleOfWord('Hello World')).toBe(false);
            expect(hasUpperCaseCharacterInMiddleOfWord('lowercase')).toBe(false);
        });

        it('returns true for all uppercase (after first character)', () => {
            expect(hasUpperCaseCharacterInMiddleOfWord('UPPERCASE')).toBe(true);
            expect(hasUpperCaseCharacterInMiddleOfWord('ABC')).toBe(true);
        });

        it('handles numbers correctly', () => {
            expect(hasUpperCaseCharacterInMiddleOfWord('test123')).toBe(false);
            expect(hasUpperCaseCharacterInMiddleOfWord('test123Test')).toBe(true);
        });

        it('returns false for empty string', () => {
            expect(hasUpperCaseCharacterInMiddleOfWord('')).toBe(false);
        });

        it('returns false for single character', () => {
            expect(hasUpperCaseCharacterInMiddleOfWord('a')).toBe(false);
            expect(hasUpperCaseCharacterInMiddleOfWord('A')).toBe(false);
        });
    });

    describe('normalizedCharCodeArray', () => {
        it('converts to uppercase and returns char codes', () => {
            const result = normalizedCharCodeArray('abc');
            expect(result).toEqual([65, 66, 67]); // A, B, C
        });

        it('removes whitespace', () => {
            const result = normalizedCharCodeArray('a b c');
            expect(result).toEqual([65, 66, 67]); // A, B, C (spaces removed)
        });

        it('removes dots', () => {
            const result = normalizedCharCodeArray('a.b.c');
            expect(result).toEqual([65, 66, 67]); // A, B, C (dots removed)
        });

        it('removes tabs', () => {
            const result = normalizedCharCodeArray('a\tb\tc');
            expect(result).toEqual([65, 66, 67]); // A, B, C (tabs removed)
        });

        it('handles mixed case and special chars', () => {
            const result = normalizedCharCodeArray('Hello. World\t!');
            const expected = charCodeArray('HELLOWORLD!').filter(c => c !== 46 && c !== 32 && c !== 9);
            expect(result).toEqual(expected);
        });
    });

    describe('charCodeArray', () => {
        it('returns array of character codes', () => {
            expect(charCodeArray('ABC')).toEqual([65, 66, 67]);
            expect(charCodeArray('abc')).toEqual([97, 98, 99]);
            expect(charCodeArray('123')).toEqual([49, 50, 51]);
        });

        it('returns empty array for empty string', () => {
            expect(charCodeArray('')).toEqual([]);
        });

        it('handles special characters', () => {
            expect(charCodeArray(' ')).toEqual([32]);  // space
            expect(charCodeArray('\t')).toEqual([9]);  // tab
            expect(charCodeArray('.')).toEqual([46]);  // dot
        });
    });

    describe('removeLeadingWhitespaces', () => {
        it('removes leading spaces', () => {
            expect(removeLeadingWhitespaces('   hello')).toBe('hello');
            expect(removeLeadingWhitespaces(' hello')).toBe('hello');
        });

        it('does not remove trailing spaces', () => {
            expect(removeLeadingWhitespaces('hello   ')).toBe('hello   ');
        });

        it('handles strings without leading spaces', () => {
            expect(removeLeadingWhitespaces('hello')).toBe('hello');
        });

        it('handles empty string', () => {
            expect(removeLeadingWhitespaces('')).toBe('');
        });

        it('removes all spaces if string is all spaces', () => {
            expect(removeLeadingWhitespaces('     ')).toBe('');
        });
    });

    describe('removeTrailingWhitespaces', () => {
        it('removes trailing spaces', () => {
            expect(removeTrailingWhitespaces('hello   ')).toBe('hello');
            expect(removeTrailingWhitespaces('hello ')).toBe('hello');
        });

        it('does not remove leading spaces', () => {
            expect(removeTrailingWhitespaces('   hello')).toBe('   hello');
        });

        it('handles strings without trailing spaces', () => {
            expect(removeTrailingWhitespaces('hello')).toBe('hello');
        });

        it('handles empty string', () => {
            expect(removeTrailingWhitespaces('')).toBe('');
        });

        it('removes all spaces if string is all spaces', () => {
            expect(removeTrailingWhitespaces('     ')).toBe('');
        });
    });

    describe('prefixAfterWhitespace', () => {
        it('adds prefix without space if string does not start with space', () => {
            expect(prefixAfterWhitespace('>', 'hello')).toBe('>hello');
            expect(prefixAfterWhitespace('#', 'Title')).toBe('#Title');
        });

        it('preserves single leading space and adds prefix after it', () => {
            expect(prefixAfterWhitespace('>', ' hello')).toBe(' >hello');
            expect(prefixAfterWhitespace('#', ' Title')).toBe(' #Title');
        });

        it('handles multiple leading spaces', () => {
            expect(prefixAfterWhitespace('>', '   hello')).toBe(' >hello');
        });
    });

    describe('suffixBeforeWhitespace', () => {
        it('adds suffix without space if string does not end with space', () => {
            expect(suffixBeforeWhitespace('hello', '.')).toBe('hello.');
            expect(suffixBeforeWhitespace('test', '!')).toBe('test!');
        });

        it('preserves single trailing space and adds suffix before it', () => {
            expect(suffixBeforeWhitespace('hello ', '.')).toBe('hello. ');
            expect(suffixBeforeWhitespace('test ', '!')).toBe('test! ');
        });

        it('handles multiple trailing spaces', () => {
            expect(suffixBeforeWhitespace('hello   ', '.')).toBe('hello. ');
        });
    });

    describe('isListItemCharacter', () => {
        it('returns true for bullet characters', () => {
            expect(isListItemCharacter('-')).toBe(true);
            expect(isListItemCharacter('•')).toBe(true);
            expect(isListItemCharacter('–')).toBe(true);
        });

        it('returns false for non-bullet characters', () => {
            expect(isListItemCharacter('a')).toBe(false);
            expect(isListItemCharacter('1')).toBe(false);
            expect(isListItemCharacter('.')).toBe(false);
            expect(isListItemCharacter('*')).toBe(false);
        });

        it('returns false for multi-character strings', () => {
            expect(isListItemCharacter('--')).toBe(false);
            expect(isListItemCharacter('ab')).toBe(false);
        });

        it('returns false for empty string', () => {
            expect(isListItemCharacter('')).toBe(false);
        });
    });

    describe('isListItem', () => {
        it('detects bullet list items', () => {
            expect(isListItem('- Item 1')).toBe(true);
            expect(isListItem('• Item 2')).toBe(true);
            expect(isListItem('– Item 3')).toBe(true);
        });

        it('handles whitespace before bullet', () => {
            expect(isListItem('  - Item')).toBe(true);
            expect(isListItem('\t- Item')).toBe(true);
        });

        it('requires space after bullet', () => {
            expect(isListItem('-Item')).toBe(false);
            expect(isListItem('-')).toBe(false);
        });

        it('rejects non-list items', () => {
            expect(isListItem('Normal text')).toBe(false);
            expect(isListItem('This - is not a list')).toBe(false);
            expect(isListItem('')).toBe(false);
        });
    });

    describe('isNumberedListItem', () => {
        it('detects numbered list items', () => {
            expect(isNumberedListItem('1. Item 1')).toBe(true);
            expect(isNumberedListItem('2. Item 2')).toBe(true);
            expect(isNumberedListItem('123. Item 123')).toBe(true);
        });

        it('handles whitespace before number', () => {
            expect(isNumberedListItem('  1. Item')).toBe(true);
            expect(isNumberedListItem('\t1. Item')).toBe(true);
        });

        it('handles number-less periods', () => {
            expect(isNumberedListItem('. Item')).toBe(true);
        });

        it('requires space after period', () => {
            expect(isNumberedListItem('1.Item')).toBe(false);
            expect(isNumberedListItem('1.')).toBe(false);
        });

        it('rejects non-list items', () => {
            expect(isNumberedListItem('Normal text')).toBe(false);
            expect(isNumberedListItem('This has a 1. in it')).toBe(false);
            expect(isNumberedListItem('')).toBe(false);
        });
    });

    describe('wordMatch', () => {
        it('returns 1 for identical strings', () => {
            expect(wordMatch('hello world', 'hello world')).toBe(1);
            expect(wordMatch('test', 'test')).toBe(1);
        });

        it('returns 1 for identical strings with different case', () => {
            expect(wordMatch('Hello World', 'hello world')).toBe(1);
            expect(wordMatch('TEST', 'test')).toBe(1);
        });

        it('returns 0 for completely different strings', () => {
            expect(wordMatch('hello', 'world')).toBe(0);
            expect(wordMatch('abc', 'def')).toBe(0);
        });

        it('returns partial match for overlapping words', () => {
            expect(wordMatch('hello world', 'hello universe')).toBe(0.5); // 1 match out of 2 words
            expect(wordMatch('one two three', 'one two four')).toBe(2/3); // 2 matches out of 3 words
        });

        it('handles single word strings', () => {
            expect(wordMatch('hello', 'hello')).toBe(1);
            expect(wordMatch('hello', 'goodbye')).toBe(0);
        });

        it('handles empty strings', () => {
            // Empty string splits to Set with one empty element: [''] -> Set([''])
            // So wordMatch('', '') = 1/max(1, 1) = 1
            expect(wordMatch('', '')).toBe(1);
            expect(wordMatch('hello', '')).toBe(0);
            expect(wordMatch('', 'hello')).toBe(0);
        });

        it('normalizes to uppercase for comparison', () => {
            expect(wordMatch('Hello', 'HELLO')).toBe(1);
            expect(wordMatch('Test Word', 'test word')).toBe(1);
        });

        it('uses maximum word count as denominator', () => {
            expect(wordMatch('one', 'one two three')).toBe(1/3);
            expect(wordMatch('one two three', 'one')).toBe(1/3);
        });
    });
});
