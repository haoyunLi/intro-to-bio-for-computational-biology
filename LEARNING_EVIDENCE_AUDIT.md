# Response and experimental-evidence teaching

Publication baseline: public main `0c3b76565e612fd0a3d2a7478ef94fa923112ce9`.
Publication branch: `learning-honesty-2026-10-05`.

This is a standalone adaptation of the recovery changes. It imports no files or commits from the unpublished biology snapshot. Chapter answer reveal now requires a written explanation and confidence choice; the initial response is locked for the round and is not automatically graded. Reading marks explicitly mean read, not mastered. The draft lasts only in the current chapter. No new persistent self-assessment system is introduced.

D01 adds original synthetic assay signals, an additive treatment/batch model, a parameter slider, a computed design-matrix rank, observed-versus-predicted values, a crossed-design comparison, and three targeted questions. The observations have no independent replication or error estimates and are not RNA-seq raw counts. Identifiability under the stated additive model does not establish precision or biological causality.

The mechanism walkthrough holds observed black outlines fixed while revealing assumed baseline, treatment, and batch contributions in four manual or explicitly played stages. Play, pause, replay, and parameter changes operate on the same computed values; reduced-motion preference preserves static manual steps. Original SVG segments use a shared zero-based scale. Explanations A (3+0), B (0+3), and C (1+2) fit the confounded two-row design equally. Adding within-batch combinations rejects A/B against the four specified observations, while C fits. The colored decomposition is a model hypothesis, not a measured biological mechanism. The numeric table and questions are optional expandable details.

Sources reviewed: [MIT OCW 7.016 assignments](https://ocw.mit.edu/courses/7-016-introductory-biology-fall-2018/pages/assignments/), [HHMI p53 figure interpretation](https://www.biointeractive.org/classroom-resources/role-p53-cell-cycle), [HHMI Immunology Virtual Lab](https://www.biointeractive.org/classroom-resources/immunology-virtual-lab), [DESeq2 linear combinations and full-rank designs](https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html#linear-combinations), and [EMBL-EBI RNA-seq course](https://www.ebi.ac.uk/training/materials/introduction-to-rna-seq-materials/course-content/). The figure, values, questions, and feedback are original.

Validation after adapting onto public main:

- `node --check textbook.js`
- `node --check chapter-practice.js`
- `node scripts/test-chapter-practice.mjs`
- `node scripts/test-project-transfer.mjs`
- `node scripts/audit-zero-background.mjs`
- `git diff --check`

All passed. The content audit covers 24 courses, 180 chapters, 779 sections, 218 sources, 13 units, and 602 terms on this public baseline. The unpublished learning-progress test/module and snapshot diagnostic/story files are deliberately absent from this publication branch.

Additional numeric tests verify that stacked contributions reproduce each full prediction across all slider positions in both designs, and that each visual stage reveals only its intended terms. Chrome browser checks passed answer prerequisites and locking; hypothesis comparison, rank and mismatch updates; optional questions and retry; timed playback, pause and reset; mobile graph scrolling; reduced-motion manual controls; and absence of runtime errors. Desktop and phone-width rendered figures were reviewed. Browser scripts, logs, and screenshots are retained in the separate local handoff workspace.
