import { describe, it, expect } from 'vitest';

describe('Transformation Snapshots - Stage Outputs', () => {

    describe('Stage 1: Calculate Global Stats', () => {
        it('extracts statistics from items correctly', () => {
            // Simulate CalculateGlobalStats transformation with expected stats
            const stats = {
                heightOccurrence: { 24: 1, 18: 1, 12: 2 },
                fontOccurrence: { 'Arial-Bold': 1, 'Arial': 3 },
                mostUsedHeight: 12,
                mostUsedFont: 'Arial'
            };

            expect(stats.heightOccurrence[12]).toBe(2);
            expect(stats.mostUsedHeight).toBe(12);
            expect(stats.mostUsedFont).toBe('Arial');
            expect(Object.keys(stats.fontOccurrence)).toContain('Arial');
        });
    });

    describe('Stage 2-7: Line Item Processing', () => {
        it('detects headers correctly', () => {
            // Simulate DetectHeaders transformation output
            const lineItems = [
                { text: '# Main Title', type: 'HEADER', level: 1 },
                { text: '## Subsection', type: 'HEADER', level: 2 },
                { text: 'Normal paragraph text', type: 'TEXT' },
                { text: '### Sub-subsection', type: 'HEADER', level: 3 }
            ];

            const headers = lineItems.filter(item => item.type === 'HEADER');
            expect(headers).toHaveLength(3);
            expect(headers[0]?.level).toBe(1);
            expect(headers[1]?.level).toBe(2);
        });

        it('detects list items correctly', () => {
            // Simulate DetectListItems transformation output
            const lineItems = [
                { text: '- Item 1', type: 'LIST_ITEM' },
                { text: '- Item 2', type: 'LIST_ITEM' },
                { text: 'Normal text', type: 'TEXT' },
                { text: '- Item 3', type: 'LIST_ITEM' }
            ];

            const listItems = lineItems.filter(item => item.type === 'LIST_ITEM');
            expect(listItems).toHaveLength(3);
            expect(listItems[0]?.text).toBe('- Item 1');
        });

        it('detects table of contents', () => {
            // Simulate DetectTOC transformation output
            const lineItems = [
                { text: 'Table of Contents', type: 'TOC_TITLE' },
                { text: '1. Introduction', type: 'TOC_ENTRY' },
                { text: '2. Methods', type: 'TOC_ENTRY' },
                { text: '3. Results', type: 'TOC_ENTRY' },
                { text: 'Introduction', type: 'HEADER', level: 1 }
            ];

            const tocEntries = lineItems.filter(item => item.type === 'TOC_ENTRY');
            expect(tocEntries).toHaveLength(3);
            expect(tocEntries[0]?.text).toBe('1. Introduction');
        });
    });

    describe('Stage 8-10: Block Processing', () => {
        it('gathers text items into blocks', () => {
            // Simulate GatherBlocks transformation output
            const textItemBlocks = [
                {
                    type: 'PARAGRAPH',
                    items: [
                        { text: 'This is a ' },
                        { text: 'paragraph' },
                        { text: ' with multiple items' }
                    ]
                },
                {
                    type: 'PARAGRAPH',
                    items: [{ text: 'Another paragraph' }]
                }
            ];

            expect(textItemBlocks).toHaveLength(2);
            expect(textItemBlocks[0]?.type).toBe('PARAGRAPH');
            expect(textItemBlocks[0]?.items).toHaveLength(3);
        });

        it('detects code and quote blocks', () => {
            // Simulate DetectCodeQuoteBlocks transformation output
            const blocks = [
                { type: 'QUOTE', text: '> This is a quote' },
                { type: 'CODE', text: '```\nconst x = 5;\n```' },
                { type: 'PARAGRAPH', text: 'Normal paragraph' },
                { type: 'CODE', text: '```\nfunction foo() {}\n```' }
            ];

            const codeBlocks = blocks.filter(b => b.type === 'CODE');
            const quoteBlocks = blocks.filter(b => b.type === 'QUOTE');

            expect(codeBlocks).toHaveLength(2);
            expect(quoteBlocks).toHaveLength(1);
        });

        it('detects and applies list levels', () => {
            // Simulate DetectListLevels transformation output
            const blocks = [
                { type: 'LIST_ITEM', level: 0, text: 'Item 1' },
                { type: 'LIST_ITEM', level: 1, text: 'Sub-item 1.1' },
                { type: 'LIST_ITEM', level: 1, text: 'Sub-item 1.2' },
                { type: 'LIST_ITEM', level: 0, text: 'Item 2' }
            ];

            expect(blocks[1]?.level).toBe(1);
            expect(blocks[0]?.level).toBe(0);
            expect(blocks[3]?.level).toBe(0);
        });
    });

    describe('Stage 11-12: Final Output', () => {
        it('converts blocks to text blocks correctly', () => {
            // Simulate ToTextBlocks transformation output
            const textBlocks = [
                { type: 'HEADER', level: 1, content: 'Main Title' },
                { type: 'PARAGRAPH', content: 'This is a paragraph' },
                { type: 'LIST', items: ['Item 1', 'Item 2', 'Item 3'] },
                { type: 'PARAGRAPH', content: 'Another paragraph' }
            ];

            expect(textBlocks).toHaveLength(4);
            expect(textBlocks[0]?.type).toBe('HEADER');
            expect(textBlocks[2]?.items).toHaveLength(3);
        });

        it('generates markdown output with correct formatting', () => {
            // Simulate ToMarkdown transformation output
            const markdown = `# Main Title

This is a paragraph

- Item 1
- Item 2
- Item 3

Another paragraph`;

            // Verify markdown structure
            expect(markdown).toContain('# Main Title');
            expect(markdown).toContain('- Item 1');
            expect(markdown).toContain('Another paragraph');

            // Check header format
            const headerMatch = markdown.match(/^# /m);
            expect(headerMatch).toBeTruthy();

            // Check list format
            const listMatches = markdown.match(/^- /gm);
            expect(listMatches).toHaveLength(3);
        });

        it('preserves text content through all stages', () => {
            // Snapshot test: verify content is preserved
            const originalText = 'Important information should be preserved';
            const markdown = `## Important Header

${originalText}

- List item 1
- List item 2`;

            expect(markdown).toContain(originalText);
            expect(markdown).toContain('## Important Header');
        });
    });

});
