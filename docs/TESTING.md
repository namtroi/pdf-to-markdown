# Testing Guide

## Overview

Test suite uses **Vitest** with focus on unit + integration testing. Current coverage: >80%.

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:ui

# With coverage
npm test -- --coverage

# Specific file
npm test test/stringFunctions.test.ts

# Run all checks (type + lint + test)
npm run check
```

## Test Structure

```
test/
├── fixtures/          # Test data
│   ├── mockData.ts   # Mock objects
│   └── pdfs/         # Small test PDFs (<100KB)
├── *.test.ts         # Unit tests (co-located with source)
└── integration/      # Integration tests
```

## Writing Tests

### Unit Tests

Place test files next to source: `foo.ts` → `foo.test.ts`

**Example: Utility function**
```typescript
import { describe, it, expect } from 'vitest'
import { isListItem } from './stringFunctions'

describe('stringFunctions', () => {
  describe('isListItem', () => {
    it('detects bullet lists', () => {
      expect(isListItem('• Item')).toBe(true)
      expect(isListItem('- Item')).toBe(true)
      expect(isListItem('* Item')).toBe(true)
    })

    it('detects numbered lists', () => {
      expect(isListItem('1. Item')).toBe(true)
      expect(isListItem('a. Item')).toBe(true)
    })

    it('rejects non-list items', () => {
      expect(isListItem('Normal text')).toBe(false)
      expect(isListItem('1 Item')).toBe(false) // Missing dot
    })
  })
})
```

### Model Tests

Test constructors, methods, data transformations.

**Example: Model class**
```typescript
import { describe, it, expect } from 'vitest'
import { LineItem } from './LineItem'
import { Word } from './Word'

describe('LineItem', () => {
  it('creates from words', () => {
    const words = [new Word({ string: 'hello' }), new Word({ string: 'world' })]
    const line = new LineItem({ x: 10, y: 20, width: 100, height: 12, words })

    expect(line.text()).toBe('hello world')
    expect(line.wordStrings()).toEqual(['hello', 'world'])
  })

  it('creates from text string', () => {
    const line = new LineItem({
      x: 10, y: 20, width: 100, height: 12,
      text: 'hello world'
    })

    expect(line.words).toHaveLength(2)
    expect(line.text()).toBe('hello world')
  })
})
```

### Transformation Tests

Test each pipeline stage independently.

**Example: Transformation**
```typescript
import { describe, it, expect } from 'vitest'
import { CalculateGlobalStats } from './CalculateGlobalStats'
import { ParseResult } from '../ParseResult'
import { Page } from '../Page'
import { TextItem } from '../TextItem'

describe('CalculateGlobalStats', () => {
  it('calculates most used height', () => {
    const items = [
      new TextItem({ x: 0, y: 0, width: 10, height: 12, text: 'a', font: 'f1' }),
      new TextItem({ x: 0, y: 10, width: 10, height: 12, text: 'b', font: 'f1' }),
      new TextItem({ x: 0, y: 20, width: 10, height: 16, text: 'c', font: 'f2' })
    ]
    const pages = [new Page({ index: 0, items })]
    const result = new ParseResult({ pages })

    const transform = new CalculateGlobalStats()
    const transformed = transform.transform(result)

    expect(transformed.globals?.mostUsedHeight).toBe(12)
    expect(transformed.globals?.maxHeight).toBe(16)
  })
})
```

### Integration Tests

Test full pipeline with real/mock PDFs.

**Example: Full pipeline**
```typescript
import { describe, it, expect } from 'vitest'
import { loadPDF, runPipeline } from './testHelpers'

describe('PDF pipeline integration', () => {
  it('converts simple PDF to markdown', async () => {
    const pdf = await loadPDF('test/fixtures/pdfs/simple.pdf')
    const markdown = await runPipeline(pdf)

    expect(markdown).toContain('# Heading')
    expect(markdown).toContain('Paragraph text')
    expect(markdown).toContain('- List item')
  })
})
```

### Snapshot Tests

Verify transformation output consistency.

**Example: Snapshot**
```typescript
import { describe, it, expect } from 'vitest'
import { ToMarkdown } from './ToMarkdown'

describe('ToMarkdown', () => {
  it('matches baseline output', () => {
    const input = createMockBlocks()
    const transform = new ToMarkdown()
    const result = transform.transform(input)

    expect(result.pages[0].items).toMatchSnapshot()
  })
})
```

**Update snapshots:** `npm test -- -u`

## Test Fixtures

### Mock Data

Use `test/fixtures/mockData.ts` for reusable mocks:

```typescript
// test/fixtures/mockData.ts
export const mockTextItem = (overrides = {}) => new TextItem({
  x: 10,
  y: 20,
  width: 100,
  height: 12,
  text: 'Sample',
  font: 'Arial',
  ...overrides
})

export const mockParsedPage = (items = []) => new Page({
  index: 0,
  items
})
```

### Test PDFs

Small PDFs in `test/fixtures/pdfs/`:

- **simple.pdf** - 1 page, plain text (<10KB)
- **complex.pdf** - Multi-page, headers/lists (<50KB)
- **table-heavy.pdf** - Tables/columns (<30KB)

**Adding test PDFs:**
1. Keep < 50KB
2. Document what it tests in `test/fixtures/pdfs/README.md`
3. Commit to repo

## Coverage Goals

- **Utilities** - 100% (easy to test)
- **Models** - >90% (core data structures)
- **Transformations** - >80% (complex logic)
- **Components** - >60% (UI, less critical)

Check coverage:
```bash
npm test -- --coverage
open coverage/index.html
```

## Testing Patterns

### Arrange-Act-Assert
```typescript
it('does something', () => {
  // Arrange - setup
  const input = createInput()

  // Act - execute
  const result = doSomething(input)

  // Assert - verify
  expect(result).toBe(expected)
})
```

### Parameterized Tests
```typescript
describe('isListItem', () => {
  const cases = [
    ['• Item', true],
    ['- Item', true],
    ['Normal', false]
  ]

  cases.forEach(([input, expected]) => {
    it(`returns ${expected} for "${input}"`, () => {
      expect(isListItem(input)).toBe(expected)
    })
  })
})
```

### Testing Async Code
```typescript
it('loads PDF', async () => {
  const pdf = await loadPDF('test.pdf')
  expect(pdf).toBeDefined()
})
```

### Testing Errors
```typescript
it('throws on invalid input', () => {
  expect(() => parseInvalid()).toThrow('Invalid input')
})
```

## Component Testing

Use `@testing-library/react` for component tests:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { UploadView } from './UploadView'

describe('UploadView', () => {
  it('calls onFileSelected when file dropped', async () => {
    const onFileSelected = vi.fn()
    render(<UploadView onFileSelected={onFileSelected} />)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const dropzone = screen.getByText(/drag.*drop/i)

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })

    expect(onFileSelected).toHaveBeenCalledWith(file)
  })
})
```

## Best Practices

### ✅ DO
- **Test behavior, not implementation** - Focus on inputs/outputs
- **Use descriptive test names** - `it('detects bullet lists')` not `it('works')`
- **Keep tests simple** - One assertion per test when possible
- **Use fixtures** - Reuse mock data
- **Test edge cases** - Empty arrays, null, undefined, large inputs
- **Test error paths** - What happens when things fail?

### ❌ DON'T
- **Test private methods** - Test public API only
- **Over-mock** - Use real objects when simple
- **Share state** - Each test isolated
- **Ignore flaky tests** - Fix or remove
- **Skip tests** - Fix broken tests, don't skip
- **Test external libraries** - Trust PDF.js, React, etc

## Debugging Tests

### VSCode
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test", "--", "--run"],
  "console": "integratedTerminal"
}
```

### Console Logs
```typescript
it('debug test', () => {
  const result = transform(input)
  console.log('Result:', result) // Shows in test output
  expect(result).toBe(expected)
})
```

### Vitest UI
```bash
npm run test:ui
```
Opens browser with interactive test explorer + debugger.

## CI/CD Integration

Tests run automatically on:
- Pre-commit hook (fast tests only)
- Pull requests (full suite)
- Main branch pushes (full suite + coverage)

**GitHub Actions example:**
```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Common Issues

### "Cannot find module"
- Check import paths (`.ts` extension needed in some cases)
- Verify file exists
- Check `tsconfig.json` paths

### "Unexpected token"
- JSX/TSX not configured - check `vitest.config.ts`
- Missing `@vitejs/plugin-react`

### "Test timeout"
- Increase timeout: `it('slow test', async () => { ... }, 10000)`
- Or in `vitest.config.ts`: `testTimeout: 10000`

### Flaky tests
- Check for shared state between tests
- Use `beforeEach` to reset
- Avoid timing dependencies (setTimeout, etc)

## Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Test Coverage Best Practices](https://martinfowler.com/bliki/TestCoverage.html)
