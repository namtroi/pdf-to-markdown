# Architecture

## Overview

PDF-to-Markdown converts PDF documents to markdown using a multi-stage transformation pipeline. Each stage analyzes and enriches the document structure until final markdown output.

## Data Flow

```
PDF File
  ↓
PDF.js extraction → TextItems (raw text fragments with positions)
  ↓
Stage 1: CalculateGlobalStats → Baseline statistics (font sizes, spacing)
  ↓
Stage 2-5: TextItem transformations → Detect structure (headers, lists, TOC)
  ↓
Stage 6: ToLineItemTransformation → TextItems → LineItems (grouped by y-coordinate)
  ↓
Stage 7-9: LineItem transformations → Refine structure (remove duplicates, compact lines)
  ↓
Stage 10: ToLineItemBlockTransformation → LineItems → Blocks (paragraphs, lists, code)
  ↓
Stage 11-12: Block transformations → Detect code/quotes, list hierarchy
  ↓
Stage 13: ToTextBlocks → Blocks → Text strings
  ↓
Stage 14: ToMarkdown → Text → Final markdown
  ↓
Markdown string
```

## Core Models

### ParseResult
Container for transformation pipeline output. Immutable pattern - each stage returns new ParseResult.

```typescript
class ParseResult {
  pages: Page[]           // Document pages
  globals?: GlobalStats   // Shared statistics
  messages?: string[]     // Debug messages
}
```

### Page
Single page with items that evolve through pipeline.

```typescript
class Page {
  index: number          // 0-based page number
  items: PageItem[]      // TextItem | LineItem | LineItemBlock | string
}
```

### TextItem
Raw PDF.js text fragment with positioning.

```typescript
class TextItem {
  x, y, width, height   // Position/size
  text: string          // Content
  font: string          // Font ID
  type?: BlockTypeValue // Detected type (H1, LIST, etc)
}
```

### LineItem
Grouped text items forming single line.

```typescript
class LineItem {
  x, y, width, height   // Position/size
  words: Word[]         // Words with formatting
  type?: BlockTypeValue // H1, H2, LIST, CODE, etc
}
```

### LineItemBlock
Group of lines forming semantic block.

```typescript
class LineItemBlock {
  items: LineItem[]      // Lines in block
  type?: BlockTypeValue  // PARAGRAPH, LIST, CODE_BLOCK, etc
}
```

### Word
Word with markdown formatting metadata.

```typescript
class Word {
  string: string           // Text
  type?: WordTypeValue     // LINK, FOOTNOTE
  format?: WordFormatValue // BOLD, OBLIQUE, BOLD_OBLIQUE
}
```

## Transformation Pipeline

### Stage 1: CalculateGlobalStats (TextItem)
Analyzes entire PDF for baseline statistics.

**Output:**
```typescript
globals: {
  mostUsedHeight: number      // Common font size
  mostUsedFont: string        // Common font
  mostUsedDistance: number    // Line spacing
  maxHeight: number           // Largest font (likely title)
  fontToFormats: Map<string, string>  // Font → format mapping
}
```

### Stage 2: DetectHeaders (TextItem)
Identifies headers using multiple strategies:
1. Title page detection (first page, large font)
2. TOC-based detection (if TOC found, map headlines)
3. Height-based categorization (font size → H1/H2/H3)

Marks items with `type: H1/H2/H3/H4/H5/H6`

### Stage 3: DetectListItems (TextItem)
Detects bullet/numbered lists using:
- List character patterns (•, -, *, 1., a., etc)
- Indentation consistency
- Vertical spacing

Marks items with `type: LIST`

### Stage 4: DetectTOC (TextItem)
Complex TOC detection algorithm:
1. Find TOC pages (title + page numbers pattern)
2. Extract headline items
3. Map TOC entries to actual headlines in document
4. Link pages for navigation

Updates `globals.tocPages`

### Stage 5: VerticalToHorizontal (TextItem)
Converts vertical text orientation to horizontal (e.g., rotated headers).

### Stage 6: ToLineItemTransformation
**Converts:** TextItems → LineItems

Groups text items by y-coordinate proximity into lines. Sorts words left-to-right.

Uses `TextItemLineGrouper` class.

### Stage 7: CompactLines (LineItem)
Merges adjacent lines that should be single line (e.g., lines broken by formatting).

### Stage 8: RemoveRepetitiveElements (LineItem)
Removes page headers/footers that repeat across pages.

Heuristic: If line appears on most pages at same position, likely header/footer.

### Stage 9: GatherBlocks (LineItem)
(Minimal - mostly passes through)

### Stage 10: ToLineItemBlockTransformation
**Converts:** LineItems → LineItemBlocks

Groups consecutive lines of same type into blocks.

Example:
```
H1 line
PARAGRAPH line 1
PARAGRAPH line 2
LIST line 1
LIST line 2
```
→
```
Block(type=H1, items=[H1 line])
Block(type=PARAGRAPH, items=[PARAGRAPH line 1, PARAGRAPH line 2])
Block(type=LIST, items=[LIST line 1, LIST line 2])
```

### Stage 11: DetectCodeQuoteBlocks (LineItemBlock)
Detects code blocks using indentation heuristics.

If block consistently indented > threshold → `type: CODE_BLOCK`

### Stage 12: DetectListLevels (LineItemBlock)
Calculates list nesting levels using x-coordinates.

Updates list items with indentation level for markdown rendering (-, -, -).

### Stage 13: ToTextBlocks
**Converts:** LineItemBlocks → Text strings

Calls `BlockType.toText(block)` for each block to render markdown.

### Stage 14: ToMarkdown
Collapses text blocks to final markdown string.

## Block Types

Defined in `BlockType.ts`:

- **H1-H6** - Headers (# → ######)
- **PARAGRAPH** - Normal text
- **LIST** - Bullet/numbered lists
- **CODE_BLOCK** - ``` code ```
- **QUOTE** - > quote
- **TOC** - Table of contents

Each block type has `toText(block)` method for markdown conversion.

## Global Statistics

`GlobalStats` uses hybrid typing:

```typescript
interface GlobalStats {
  // Core stats (set by CalculateGlobalStats)
  mostUsedHeight: number
  mostUsedFont: string
  mostUsedDistance: number
  maxHeight: number

  // Transformation-specific
  tocPages?: number[]
  headlineTypeToHeightRange?: Record<string, HeightRange>

  // Extension point
  [key: string]: unknown
}
```

**Rationale:** Type safety for core properties + flexibility for custom transformations.

## Utilities

### stringFunctions.ts
Text analysis utilities:
- `isListItem(str)` - Detects list patterns
- `hasUpperCaseCharacterInMiddleOfWord(str)` - Identifies camelCase
- `calculateWordMatchScore(str1, str2)` - Fuzzy matching for TOC

### pageItemFunctions.ts
Position utilities:
- `minXFromBlocks(blocks)` - Leftmost x-coordinate
- `sortByX(items)` - Sort left-to-right

### HeadlineFinder
Multi-line headline matching for TOC. Uses character-by-character comparison to find headlines across lines.

### TextItemLineGrouper
Groups TextItems into LineItems by y-coordinate proximity. Configurable threshold.

## Component Architecture

```
App
├── UploadView (file selection)
├── LoadingView (PDF parsing + progress)
│   ├── PDF.js extraction
│   └── Transformation pipeline
├── ResultView (markdown output)
│   ├── Markdown display
│   └── Copy/download
└── DebugView (pipeline visualization)
    └── Per-stage inspection
```

### AppState
Manages document state:

```typescript
class AppState {
  metadata: Metadata      // PDF info
  pages: Page[]           // Document pages
  transformations: Transformation[]  // Pipeline stages
}
```

## Testing Strategy

See [TESTING.md](TESTING.md) for details.

- **Unit tests** - Utilities, models, transformations
- **Integration tests** - Full pipeline with small PDFs
- **Snapshot tests** - Verify output consistency

## Performance Considerations

- **Incremental processing** - Pages processed one-by-one
- **Worker threads** - PDF.js runs in worker (not main thread)
- **Lazy rendering** - Debug view only renders visible stages
- **Memoization** - React.memo() on pure components

## Extension Points

### Adding Custom Transformation

1. Extend `Transformation` base class
2. Implement `transform(parseResult)` method
3. Add to pipeline in appropriate stage
4. Update `GlobalStats` if needed

Example:
```typescript
class DetectTables extends ToLineItemTransformation {
  transform(parseResult: ParseResult): ParseResult {
    // Detect table patterns
    // Mark items with type: TABLE
    return new ParseResult({ pages: newPages })
  }
}
```

### Adding Custom BlockType

1. Add to `BlockType.ts`
2. Define `toText(block)` method
3. Update transformations to detect/set type

Example:
```typescript
export const BlockType = {
  TABLE: {
    name: 'TABLE',
    toText(block: Block) {
      // Render markdown table
      return '| col1 | col2 |\n|---|---|\n...'
    }
  }
}
```

## Known Limitations

- **Font detection** - Uses internal PDF.js API (`_transport.commonObjs`) - may break in future PDF.js versions
- **Table detection** - Limited support (treats as paragraphs)
- **Multi-column layouts** - May merge columns incorrectly
- **Image extraction** - Positions noted, but images not embedded
- **Rotated text** - Partial support (VerticalToHorizontal handles some cases)

## Future Improvements

- Better table detection/rendering
- Multi-column layout handling
- Image embedding (base64 or external files)
- OCR integration for scanned PDFs
- Custom transformation plugins
- CLI version for batch processing
