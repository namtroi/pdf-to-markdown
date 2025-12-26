# PDF-To-Markdown Converter

Javascript tool to parse PDF files and convert them into Markdown format. Online version at http://pdf2md.morethan.io!

## Major Changes

- **2020/2021** Currently separating the parsing logic from the frontent in order to make it separately available. 
  - [Branch modularize](https://github.com/jzillmann/pdf-to-markdown/tree/modularize) 
  - Find the current version at https://jzillmann.github.io/pdf-to-markdown-staging/
  - [Help me](https://github.com/jzillmann/pdf-to-markdown/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+milestone%3Av2) 
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
