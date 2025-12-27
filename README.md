# React PDF to Markdown (Modernized)

**The fastest client-side PDF to Markdown converter. Rebuilt for the AI era.**

Transform PDFs into clean, structured Markdown directly in the browser. Perfect for **RAG (Retrieval-Augmented Generation) pipelines**, LLM data ingestion, and content migration.


---

## ⚡ Why This Fork?

This is a complete modernization of the original [pdf-to-markdown](https://github.com/jzillmann/pdf-to-markdown) tool. We moved from a legacy 2017 stack to a cutting-edge 2025 architecture, resulting in significantly faster parsing and a better developer experience.

### Performance & Stack Comparison

| Metric | Legacy (v0.x) | **Modern (v1.0)** |
| :--- | :--- | :--- |
| **Framework** | React 15 (Class Components) | **React 19 (Hooks/Functional)** |
| **Build Tool** | Webpack | **Vite** (Instant HMR) |
| **Language** | JavaScript | **TypeScript** (Strict Mode) |
| **Testing** | Mocha/Chai | **Vitest** |
| **Styling** | Bootstrap 3 | **Tailwind CSS v4** |
| **Parsing Speed** | ~9s (500 pages) | **~7s (500 pages)** 🚀 |
| **PDF Engine** | pdf.js v2 | **pdf.js v5.4** |

## ✨ Features

-   **RAG-Ready Output:** Extracts clean structure (headers, lists, tables) optimized for LLM context windows.
-   **100% Client-Side:** No server required. Your documents never leave the browser.
-   **Smart Layout Detection:** correctly identifies:
    -   H1-H6 Headers (based on font size/weight)
    -   Complex nested lists
    -   Code blocks & Blockquotes
    -   Table of Contents
-   **Debug Mode:** Visualise the 12-stage transformation pipeline step-by-step.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone [https://github.com/namtroi/pdf-to-markdown.git](https://github.com/namtroi/pdf-to-markdown.git)
cd pdf-to-markdown
npm install

```

### Development

- `npm run dev` - Dev server
- `npm run check` - Type + lint + test

### Build

- `npm run build` - Production build

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
