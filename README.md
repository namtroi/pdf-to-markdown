# PDF to Markdown Converter

Convert PDF to Markdown with intelligent layout detection, header/list extraction, and formatting preservation.

[Live Demo](https://namtroi.github.io/pdf-to-markdown/)

## Features

- **Smart Layout Detection** - Headers, paragraphs, lists, code blocks, TOC
- **Format Preservation** - Bold, italic, links, footnotes
- **Debug View** - Visualize transformation pipeline stages
- **Client-Side** - All processing in browser, no server needed
- **Modern Stack** - React 19, TypeScript, Vite, Tailwind v4

## How It Works

PDF → TextItems → LineItems → Blocks → Markdown

1. **Extract** - PDF.js pulls raw text with positions
2. **Transform** - 12-stage pipeline detects structure
3. **Convert** - Block types render to markdown

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Major Changes

- **Dec 2025** - Modernized: JS→TS, Webpack→Vite, Mocha→Vitest, React 19, Tailwind v4
- **2020/2021** - [Modularization branch](https://github.com/jzillmann/pdf-to-markdown/tree/modularize)
- **Apr 2017** - 0.1: Initial Release

## Development

### Setup

```bash
npm install
```

### Development Commands

- `npm run dev` - Start Vite dev server (http://localhost:5173)
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint code with ESLint
- `npm test` - Run tests with Vitest
- `npm run test:ui` - Open Vitest UI dashboard
- `npm run check` - Run type-check + lint + test

### Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **Headless UI** for accessible components
- **Vitest** for testing
- **pdfjs-dist 5.4** for PDF parsing

## Contribute

Use the [issue tracker](https://github.com/jzillmann/pdf-to-markdown/issues) and/or open [pull requests](https://github.com/jzillmann/pdf-to-markdown/pulls)!


## Credits

- [pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF parsing & rendering platform (pdfjs-dist 5.4)
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Headless UI](https://headlessui.com/) - Accessible component library
- [TypeScript](https://www.typescriptlang.org/) - Language and type safety
