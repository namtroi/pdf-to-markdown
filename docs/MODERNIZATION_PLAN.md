# PDF-to-Markdown Modernization Plan - v1.0.0

## Executive Summary

Modernize legacy 2017 stack → modern 2025 stack. Total effort: 14-20 working days.

| What | From | To |
|------|------|-----|
| Language | JavaScript | TypeScript (53 files) |
| React | 15.4.2 | 19.x + Hooks |
| Build | Webpack | Vite |
| Testing | Mocha/Chai | Vitest |
| Dependencies | 2016-2021 | 2024-2025 |

**Key principle:** Phased approach. Test after each phase. Can rollback at any point.

---

## Phase Overview

### Phase 1: Foundation (4-6h, LOW RISK)
**What:** Setup TypeScript + Vite infrastructure
**How:**
- Create `tsconfig.json` (ES2020, strict mode)
- Create `vite.config.ts` (React plugin, asset copying)
- Move `src/index.html` to root
- Install new dev dependencies: typescript, vite, vitest, eslint@9
- Update eslint config format

**Success:** `npm run dev` starts Vite dev server

---

### Phase 2: Core Models (12-16h, MEDIUM RISK)
**What:** Type all 18 data model files
**How:**
1. Start with enums (BlockType, WordFormat, WordType) → replace enumify with const objects
2. Type simple models (Annotation, Metadata, Word)
3. Type core structures (TextItem, LineItem, Page, ParseResult)
4. Type utilities (stringFunctions, pageItemFunctions, LineConverter)

**Key decisions:**
- Use const objects for enums (not TS enums)
- Define `GlobalStats` interface (shared across all transformations)
- Keep existing logic, just add types

**Success:** Existing tests pass with typed models

---

### Phase 3: Transformation Pipeline (24-32h, HIGH RISK - CRITICAL)
**What:** Type the 12-stage PDF→Markdown conversion pipeline
**How:**
1. Create base Transformation classes (abstract types)
2. Type each transformation in sequence:
   - Stage 1: CalculateGlobalStats
   - Stages 2-7: LineItem detectors (TOC, Headers, Lists)
   - Stages 8-10: Block processing (Gather, DetectCode, ListLevels)
   - Stages 11-12: Final output (ToTextBlocks, ToMarkdown)

**Testing between each transformation:**
- Build passes
- Upload test PDF, verify stage output
- Compare with pre-migration output

**Why critical:** This is core business logic. Cannot break.

**Success:** Full pipeline works end-to-end with TypeScript

---

### Phase 4: React Ecosystem (4-8h, HIGH RISK)
**What:** Update React + related libraries
**How:**
```bash
npm install react@19 react-dom@19 prop-types@15
npm install react-bootstrap@2 bootstrap@5
npm install react-dropzone@14 react-icons@5
```

**Breaking changes to handle:**
- react-bootstrap v2: New import paths (use named exports)
- react-dropzone v14: Now hooks-based
- Bootstrap 5: CSS class names changed

**Success:** App starts (warnings OK, visual breaks OK at this stage)

---

### Phase 5: Entry Point & State (6-8h, MEDIUM RISK)
**What:** Modernize app entry + main state manager
**How:**
1. Convert `index.jsx` → `index.tsx`:
   - Change `ReactDOM.render()` to `createRoot()`
   - Type the callback function

2. Convert `AppState.jsx` → `AppState.tsx`:
   - Keep as class (easier migration path)
   - Add TypeScript interfaces
   - Type constructor options + all methods

**Decision:** Keep AppState as class (don't convert to hooks yet)

**Success:** App renders, state changes work

---

### Phase 6: Simple Components (16-20h, MEDIUM RISK)
**What:** Convert 15 simple/debug components to functional + TypeScript
**How:**
1. Start with leaf components (FooterBar, AppLogo, TopBar)
2. Then debug components (all in components/debug/)
3. Then simple view components (UploadView, ResultView, DebugView)

**Pattern for each:**
- Rename `.jsx` → `.tsx`
- Replace `React.PropTypes` with TypeScript interfaces
- Convert class component to functional component
- Replace lifecycle methods with hooks (if any)
- Update react-bootstrap imports

**Note:** UploadView needs special care - convert to useDropzone() hook

**Success:** All non-complex components are functional + typed

---

### Phase 7: Complex Components (12-16h, HIGH RISK)
**What:** Convert LoadingView (most complex) + App component
**How:**

**LoadingView:**
- Convert class → functional component
- Move `componentWillMount()` → `useEffect()`
- Complex state (document, metadata, pages, fontMap, progress) → useState
- Fix state mutations → use functional updates
- Type pdfjs-dist interfaces

**App:**
- Simple conversion to functional component
- Update react-bootstrap Grid → Container/Row/Col

**Testing:** Load PDFs, verify all 3 progress stages work

**Success:** All components functional + typed

---

### Phase 8: pdfjs-dist Upgrade (8-16h, CRITICAL RISK)
**What:** Upgrade pdfjs-dist from 2.8.335 to 5.4.x
**How (staged):**

**Stage 1: v2.8 → v3.11**
- npm install pdfjs-dist@3.11
- Test worker loading, CMaps, font retrieval
- If breaks, revert + investigate

**Stage 2: v3.11 → v4.7**
- npm install pdfjs-dist@4.7
- Same testing as Stage 1

**Stage 3: v4.7 → v5.4**
- npm install pdfjs-dist@5.4
- Thorough testing

**Critical areas to test each stage:**
- PDF loading (simple, complex, large)
- Text extraction works
- Font detection works (or gracefully skip)
- CMaps resolve correctly

**Fallback:** If font API breaks, skip font detection (non-critical)

**Success:** pdfjs@5.4 working, all PDFs parse

---

### Phase 9: Test Migration (6-8h, MEDIUM RISK)
**What:** Migrate from Mocha/Chai to Vitest
**How:**
1. Convert 3 existing test files:
   - `test/*.spec.js` → `test/*.test.ts`
   - Update assertion syntax (chai → vitest expect)

2. Add integration tests:
   - Test full transformation pipeline
   - Snapshot tests for each stage

3. Update package.json scripts:
   - `npm run test` → vitest
   - Add `npm run test:ui` → vitest UI
   - Add `npm run type-check` → tsc --noEmit

**Success:** All tests pass with Vitest

---

### Phase 10: Build System Finalization (4-6h, LOW RISK)
**What:** Complete Webpack → Vite migration
**How:**
1. Finalize vite.config.ts:
   - Set proper outDir (build/)
   - Configure code splitting
   - Setup sourcemaps for production

2. Asset handling:
   - Create `public/` directory
   - Copy pdf.worker.js, cmaps, favicons via Vite

3. Remove Webpack:
   - Delete webpack.config.js
   - Delete babel plugins/presets (keep only for vitest if needed)
   - Update .gitignore

4. Environment variables:
   - Replace `process.env.*` with `import.meta.env.*`

**Success:** `npm run build` produces working app in build/

---

### Phase 11: Styling Updates (6-8h, LOW RISK)
**What:** Update Bootstrap 3 → 5 CSS changes
**How:**
1. Review each component visually
2. Fix layout issues:
   - Grid system changes (Grid → Container/Row/Col)
   - Component APIs (Button variants, etc)
3. Update custom CSS if needed
4. Test on desktop + mobile

**Success:** Visual appearance same or better than original

---

### Phase 12: Polish & Release (8-12h, LOW RISK)
**What:** Final cleanup for v1.0.0 release
**How:**
1. Code quality:
   - Remove all eslint-disable comments
   - Remove all @ts-ignore comments
   - Zero TypeScript errors
   - Zero ESLint warnings

2. Documentation:
   - Update README (new dev setup)
   - Add MIGRATION.md (what changed for users)
   - Document new npm scripts

3. Final testing:
   - Cross-browser (Chrome, Firefox, Safari, Edge)
   - Responsive/mobile
   - Large PDFs (100+ pages)
   - Error handling

4. Version & tag:
   - Bump version to 1.0.0 in package.json
   - Create git tag v1.0.0

**Success:** Production-ready v1.0.0

---

## Key Files to Handle Carefully

| File | Why | Phase |
|------|-----|-------|
| models/ParseResult.jsx | Core data structure, all transformations depend on it | 2 |
| models/transformations/Transformation.jsx | Base class for all 12 transformations | 3 |
| components/LoadingView.jsx | Complex async, pdfjs integration, many state changes | 7 |
| models/AppState.jsx | Central state manager, all components depend on it | 5 |
| models/markdown/BlockType.jsx | Sets enum replacement pattern for other enums | 2 |

---

## Risk Management

### High-Risk Areas & Mitigation

| Risk | Happens in | Mitigation |
|------|-----------|-----------|
| Transformation pipeline breaks | Phase 3 | Snapshot tests, compare outputs, test after each |
| pdfjs-dist API changes | Phase 8 | Staged upgrade (v3→v4→v5), font detection optional |
| React 19 incompatible | Phase 4 | All changes tested incrementally, rollback branch |
| LoadingView state mess | Phase 7 | Careful useEffect, test with diverse PDFs |

### Rollback Strategy
- Git branch for each phase: `phase-1-foundation`, `phase-2-models`, etc
- Git tag at each checkpoint: `v0.2.0-alpha.1`, `v0.2.0-alpha.2`, etc
- If phase fails: git reset to previous phase tag, investigate in separate branch

---

## Testing Checkpoints

**After each phase:**
- Build passes
- Type check passes: `npm run type-check`
- Lint passes: `npm run lint`
- Tests pass: `npm run test`

**Critical checkpoints:**
- Phase 3 end: Upload PDF, verify all 12 stages produce same output as v0.1.3
- Phase 8 end: Test with 10+ diverse PDFs (simple, complex, large)
- Phase 12 end: Full cross-browser testing

---

## Success Criteria

### Functional
- ✅ All 53 files migrated to TypeScript
- ✅ All components functional (using hooks)
- ✅ Vite dev server works (`npm run dev`)
- ✅ Vite production build works (`npm run build`)
- ✅ Tests pass (`npm run test`)

### Quality
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ Test coverage >75%
- ✅ Bundle size <2MB total

### Compatibility
- ✅ Works on Chrome, Firefox, Safari, Edge (latest versions)
- ✅ Handles PDFs up to 500 pages
- ✅ Same accuracy as v0.1.3

---

## Dependencies Summary

### Before → After
```
react               15.4.2 → 19.x
react-dom           15.4.2 → 19.x
react-bootstrap     0.30.7 → 2.10.x
bootstrap           3.3.7 → 5.3.x
pdfjs-dist          2.8.335 → 5.4.x
react-dropzone      3.9.2 → 14.x
react-icons         2.2.3 → 5.4.x
webpack             removed (→ vite)
mocha               3.2.0 → removed (→ vitest)
chai                3.5.0 → removed (→ vitest)
enumify             removed (→ const objects)
typescript          NEW (5.7.x)
vite                NEW (6.x)
vitest              NEW (2.x)
eslint              7.30.0 → 9.x
```

---

## Timeline Estimate

**Total: 14-20 working days**

### Recommended 4-week breakdown
```
Week 1 (30-40h):
  Phase 1: Foundation (4-6h)
  Phase 2: Models (12-16h)
  Phase 3: Transformations (24-32h) - split across week

Week 2 (30-40h):
  Phase 3: Transformations (continued)
  Phase 4: React Updates (4-8h)
  Phase 5: Entry Point (6-8h)
  Phase 6: Simple Components (16-20h) - split across week

Week 3 (30-40h):
  Phase 6: Simple Components (continued)
  Phase 7: Complex Components (12-16h)
  Phase 8: pdfjs-dist Upgrade (8-16h)
  Phase 9: Test Migration (6-8h) - split across week

Week 4 (20-30h):
  Phase 9: Test Migration (continued)
  Phase 10: Build Finalization (4-6h)
  Phase 11: Styling (6-8h)
  Phase 12: Polish & Release (8-12h)
```

---

## Commands Reference

### Development
```bash
npm run dev              # Start Vite dev server (after phase 1)
npm run type-check      # Check TypeScript errors
npm run lint            # Run ESLint
npm run test            # Run Vitest
npm run test:ui         # Vitest UI
npm run build           # Production build
```

### Progress Tracking
```bash
# Check each phase completion
git log --oneline | grep "phase-"     # Show phase commits
git tag | grep "v0\."                 # Show phase tags
```

---

## Common Challenges & Solutions

### Challenge 1: "App won't start after updating React"
- **Cause:** ReactDOM API changed
- **Solution:** Verify you're using createRoot() not render()

### Challenge 2: "Tests fail after Vitest migration"
- **Cause:** Chai syntax no longer works
- **Solution:** Replace expect().to.equal with expect().toBe()

### Challenge 3: "pdfjs-dist upgrade breaks font detection"
- **Cause:** Internal `_transport` API changed
- **Solution:** Skip font detection gracefully (non-critical feature)

### Challenge 4: "TypeScript complaints about any"
- **Cause:** Need to type pdfjs-dist returns
- **Solution:** Create local type definitions for pdfjs-dist

### Challenge 5: "Build size increased"
- **Cause:** Code splitting not configured
- **Solution:** Configure rollupOptions in vite.config.ts

---

## Notes

- **Keep git history clean:** Commit after each transformation file
- **Test frequently:** After each phase, run full test suite + manual PDF upload
- **Document changes:** Update README progressively
- **Preserve logic:** Never refactor while migrating (migrate only, refactor separately)
- **Ask for help:** If pdfjs API breaks, check GitHub issues before reinventing
