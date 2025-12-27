# React PDF to Markdown (Modernized)

**The fastest client-side PDF to Markdown converter. Rebuilt for the AI era.**

Transform PDFs into clean, structured Markdown directly in the browser. Perfect for **RAG (Retrieval-Augmented Generation) pipelines**, LLM data ingestion, and content migration.

[**🚀 Live Demo**](https://namtroi.github.io/pdf-to-markdown/)

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

```bash
# Start the Vite dev server (Fast HMR)
npm run dev

# Run the test suite (Vitest)
npm run test

# Type-check and build for production
npm run build

```

## 🛠 Architecture

The conversion pipeline consists of **12 granular transformation stages**:

1. **Extract:** Raw text & geometry from PDF.js.
2. **Structure:** Detect headers, list items, and blocks.
3. **Refine:** Remove repetition, merge lines, detect code blocks.
4. **Output:** Render final Markdown.

See [ARCHITECTURE.md](https://www.google.com/search?q=docs/ARCHITECTURE.md) for a deep dive into the logic.

## 🚧 Current Status & Roadmap

This project is currently maintained by a solo developer. While the core logic is robust and fully typed, we are practically pragmatic about the codebase:

* ✅ **Core Pipeline:** Fully migrated to TypeScript with strict types.
* ✅ **Tests:** >77% coverage with Vitest.
* ⚠️ **UI Components:** You might spot a few `@ts-ignore` or `any` types in the legacy view components.

**Contributions are welcome!** If you're looking for a `Good First Issue`, helping us kill the last few `any` types in the UI would be amazing.

## 🤝 Contributing

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📜 Credits

* **Original Author:** Heavily inspired by and forked from [jzillmann/pdf-to-markdown](https://github.com/jzillmann/pdf-to-markdown). Massive kudos for the original algorithm.
* **PDF Engine:** Powered by [Mozilla's PDF.js](https://mozilla.github.io/pdf.js/).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.