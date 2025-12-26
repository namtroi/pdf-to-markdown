# Migration Guide: v0.1.3 → v1.0.0

## For Users

### UI Changes
- **New Design**: Modernized UI with Tailwind CSS
  - Cleaner, more modern look with slate-colored navbar
  - Blue accent colors for interactive elements and active tabs
  - Improved responsive design for better mobile experience

### Functionality
- All existing features work exactly the same as before
- PDF parsing output unchanged (still uses pdfjs-dist 5.4)
- Markdown output format and quality unchanged
- Debug view still available for developers

## For Contributors

### Major Technical Changes

1. **Build System**: Webpack → **Vite**
   - Significantly faster build times
   - Instant HMR (Hot Module Replacement) during development
   - Modern ESM-based bundling

2. **UI Framework**: Bootstrap → **Tailwind CSS v4**
   - Utility-first CSS approach
   - Smaller bundle size
   - Better tree-shaking of unused CSS

3. **React Version**: v16 → **v19**
   - New JSX transform (no need to import React)
   - Concurrent features support
   - Improved performance

4. **TypeScript**: ~50% → **~95% coverage**
   - Nearly all components and utilities typed
   - Better IDE support and compile-time safety

5. **Testing**: Mocha/Chai → **Vitest**
   - Faster test execution
   - Native ESM and TypeScript support
   - Better Jest-compatible API

6. **Component Library**: react-bootstrap → **Headless UI**
   - More flexible, unstyled components
   - Tailwind CSS compatible
   - Better accessibility features

### Breaking Changes

- Old npm scripts removed:
  - `npm run watch` → use `npm run dev`
  - `npm run release` → use `npm run build` + manual git tag
  - `npm run deploy` → deploy manually or set up CI/CD
  - `npm run start` → use `npm run dev`

- Bootstrap classes no longer available
  - All components use Tailwind CSS classes
  - `container`, `btn`, `alert`, `navbar`, etc. are gone
  - Refer to Tailwind CSS documentation for equivalents

- All `.jsx` files converted to `.tsx`
  - Direct import changes: `import Foo from './Foo.jsx'` → `import Foo from './Foo'`
  - TypeScript strict mode enabled

### New Development Workflow

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Run tests (watch mode)
npm test -- --watch

# Run all checks (type-check + lint + test)
npm run check

# Build for production
npm run build
```

### Dependencies Removed

```json
{
  "bootstrap": "removed",
  "react-bootstrap": "removed",
  "webpack": "removed",
  "webpack-cli": "removed",
  "babel-loader": "removed"
}
```

### Dependencies Added

```json
{
  "tailwindcss": "^4.1.18",
  "@headlessui/react": "^2.2.9",
  "@tailwindcss/postcss": "^4.1.18",
  "vite": "^7.3.0",
  "@vitejs/plugin-react": "^5.1.2",
  "vitest": "^4.0.16",
  "typescript-eslint": "^8.50.1"
}
```

## Migration Path for Contributors

### Converting a Bootstrap Component

**Before** (v0.1.3):
```jsx
import { Button, Container, Alert } from 'react-bootstrap';

export function MyComponent() {
  return (
    <Container>
      <Alert variant="warning">Be careful!</Alert>
      <Button variant="primary">Click me</Button>
    </Container>
  );
}
```

**After** (v1.0.0):
```tsx
import { Menu } from '@headlessui/react';

interface MyComponentProps {}

export default function MyComponent() {
  return (
    <div className="container mx-auto px-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        Be careful!
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Click me
      </button>
    </div>
  );
}
```

## ESLint Migration

**Before**: Single `.eslintrc` file (ESLint v8)
**After**: `eslint.config.js` file (ESLint v9 flat config)

### Key Configuration Changes

- Moved from `.eslintrc` to `eslint.config.js`
- Using `typescript-eslint` instead of separate plugins
- React 19 rules automatically configured (no need for `react/react-in-jsx-scope`)

## Testing Updates

**Before**:
```javascript
// Mocha/Chai
describe('Feature', () => {
  it('works', () => {
    expect(result).to.equal(5);
  });
});
```

**After**:
```typescript
// Vitest
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('works', () => {
    expect(result).toBe(5);
  });
});
```

## Getting Help

- Check the [main README.md](README.md) for current dev commands
- Review [TypeScript documentation](https://www.typescriptlang.org/)
- See [Tailwind CSS docs](https://tailwindcss.com/docs) for styling
- Visit [Headless UI](https://headlessui.com/) for component patterns

## Version Numbers

- **v0.1.x**: Bootstrap + Webpack era
- **v1.0.0**: React 19 + Vite + Tailwind CSS + TypeScript
