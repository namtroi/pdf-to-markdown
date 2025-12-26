const MIN_DIGIT_CHAR_CODE = 48;
const MAX_DIGIT_CHAR_CODE = 57;
const WHITESPACE_CHAR_CODE = 32;
const TAB_CHAR_CODE = 9;
const DOT_CHAR_CODE = 46;

/**
 * Checks if char code represents a digit (0-9).
 *
 * @param charCode - ASCII character code to check
 * @returns true if charCode is between 48 ('0') and 57 ('9')
 */
export function isDigit(charCode: number): boolean {
    return charCode >= MIN_DIGIT_CHAR_CODE && charCode <= MAX_DIGIT_CHAR_CODE;
}

/**
 * Checks if entire string contains only digits.
 *
 * @param string - Input string to validate
 * @returns true if all characters are digits
 */
export function isNumber(string: string): boolean {
    for (let i = 0; i < string.length; i++) {
        const charCode = string.charCodeAt(i);
        if (!isDigit(charCode)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if string consists entirely of one repeated character.
 * Used to detect separator lines (e.g., "..." or "---").
 *
 * @param string - String to check
 * @param char - Character to check for
 * @returns true if string contains only the specified character
 */
export function hasOnlyCharacter(string: string, char: string): boolean {
    const charCode = char.charCodeAt(0);
    for (let i = 0; i < string.length; i++) {
        const aCharCode = string.charCodeAt(i);
        if (aCharCode !== charCode) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if character is uppercase letter.
 * Handles edge cases: filters out numbers, checks case-sensitivity.
 *
 * @param character - Single character to check
 * @returns true if character is uppercase letter
 */
function isUpperCaseLetter(character: string): boolean {
    return isNaN(character as any) &&
           character === character.toUpperCase() &&
           character.toUpperCase() !== character.toLowerCase();
}

/**
 * Detects if text contains uppercase character mid-word.
 * Used to identify camelCase/PascalCase (which shouldn't be headers).
 *
 * @param text - Input string to analyze
 * @returns true if uppercase found mid-word
 */
export function hasUpperCaseCharacterInMiddleOfWord(text: string): boolean {
    let beginningOfWord = true;
    for (let i = 0; i < text.length; i++) {
        const character = text.charAt(i);
        if (character === ' ') {
            beginningOfWord = true;
        } else {
            if (!beginningOfWord && isUpperCaseLetter(character)) {
                return true;
            }
            beginningOfWord = false;
        }
    }
    return false;
}

/**
 * Converts string to normalized char code array for comparison.
 * Removes whitespace/dots, converts to uppercase. Used for fuzzy matching
 * headlines in TOC detection.
 *
 * @param string - String to normalize
 * @returns Array of character codes (uppercase, no whitespace/dots)
 */
export function normalizedCharCodeArray(string: string): number[] {
    string = string.toUpperCase();
    return charCodeArray(string).filter(charCode => charCode !== WHITESPACE_CHAR_CODE && charCode !== TAB_CHAR_CODE && charCode !== DOT_CHAR_CODE);
}

/**
 * Converts string to array of character codes.
 *
 * @param string - String to convert
 * @returns Array of ASCII character codes
 */
export function charCodeArray(string: string): number[] {
    const charCodes: number[] = [];
    for (let i = 0; i < string.length; i++) {
        charCodes.push(string.charCodeAt(i));
    }
    return charCodes;
}

/**
 * Removes leading whitespace from string.
 *
 * @param string - String to trim
 * @returns String without leading spaces
 */
export function removeLeadingWhitespaces(string: string): string {
    while (string.charCodeAt(0) === WHITESPACE_CHAR_CODE) {
        string = string.substring(1, string.length);
    }
    return string;
}

/**
 * Removes trailing whitespace from string.
 *
 * @param string - String to trim
 * @returns String without trailing spaces
 */
export function removeTrailingWhitespaces(string: string): string {
    while (string.charCodeAt(string.length - 1) === WHITESPACE_CHAR_CODE) {
        string = string.substring(0, string.length - 1);
    }
    return string;
}

/**
 * Adds prefix to string, preserving leading whitespace.
 * Used for markdown formatting (e.g., adding bold markers).
 *
 * @param prefix - String to add before content
 * @param string - String to modify
 * @returns String with prefix after any leading whitespace
 */
export function prefixAfterWhitespace(prefix: string, string: string): string {
    if (string.charCodeAt(0) === WHITESPACE_CHAR_CODE) {
        string = removeLeadingWhitespaces(string);
        return ' ' + prefix + string;
    } else {
        return prefix + string;
    }
}

/**
 * Adds suffix to string, preserving trailing whitespace.
 * Used for markdown formatting (e.g., adding bold markers).
 *
 * @param string - String to modify
 * @param suffix - String to add after content
 * @returns String with suffix before any trailing whitespace
 */
export function suffixBeforeWhitespace(string: string, suffix: string): string {
    if (string.charCodeAt(string.length - 1) === WHITESPACE_CHAR_CODE) {
        string = removeTrailingWhitespaces(string);
        return string + suffix + ' ';
    } else {
        return string + suffix;
    }
}

/**
 * Checks if string is a single list bullet character.
 * Recognizes: -, •, –
 *
 * @param string - String to check
 * @returns true if string is exactly one list bullet character
 */
export function isListItemCharacter(string: string): boolean {
    if (string.length > 1) {
        return false;
    }
    const char = string.charAt(0);
    return char === '-' || char === '•' || char === '–';
}

/**
 * Checks if string starts with list bullet pattern.
 * Pattern: optional whitespace, bullet (-, •, –), space, content
 *
 * @param string - String to test
 * @returns true if matches list item pattern
 */
export function isListItem(string: string): boolean {
    return /^[\s]*[-•–][\s].*$/g.test(string);
}

/**
 * Checks if string starts with numbered list pattern.
 * Pattern: optional whitespace, digits, dot, space, content
 *
 * @param string - String to test
 * @returns true if matches numbered list pattern
 */
export function isNumberedListItem(string: string): boolean {
    return /^[\s]*[\d]*[.][\s].*$/g.test(string);
}

/**
 * Calculates word-based similarity score between two strings.
 * Used for matching TOC entries with actual headlines (case-insensitive).
 *
 * @param string1 - First string to compare
 * @param string2 - Second string to compare
 * @returns Similarity score 0-1 (intersection size / max set size)
 *
 * @example
 * calculateWordMatchScore("Hello World", "world hello") // returns 1.0
 * calculateWordMatchScore("Hello World", "Hello") // returns 0.5
 */
export function calculateWordMatchScore(string1: string, string2: string): number {
    const words1 = new Set(string1.toUpperCase().split(' '));
    const words2 = new Set(string2.toUpperCase().split(' '));
    const intersection = new Set(
        [...words1].filter(x => words2.has(x)));
    return intersection.size / Math.max(words1.size, words2.size);
}
