# Response and experimental-evidence teaching

Publication baseline: public main `0c3b76565e612fd0a3d2a7478ef94fa923112ce9`.
Publication branch: `learning-honesty-2026-10-05`.

This is a standalone adaptation of the recovery changes. It imports no files or commits from the unpublished biology snapshot. Chapter answer reveal now requires a written explanation and confidence choice; the initial response is locked for the round and is not automatically graded. Reading marks explicitly mean read, not mastered. The draft lasts only in the current chapter. No new persistent self-assessment system is introduced.

D01 adds original synthetic assay signals, an additive treatment/batch model, a parameter slider, a computed design-matrix rank, observed-versus-predicted values, a crossed-design comparison, and three targeted questions. The observations have no independent replication or error estimates and are not RNA-seq raw counts. Identifiability under the stated additive model does not establish precision or biological causality.

The mechanism walkthrough holds observed black outlines fixed while revealing assumed baseline, treatment, and batch contributions in four manual or explicitly played stages. Play, pause, replay, and parameter changes operate on the same computed values; reduced-motion preference preserves static manual steps. Original SVG segments use a shared zero-based scale. Explanations A (3+0), B (0+3), and C (1+2) fit the confounded two-row design equally. Adding within-batch combinations rejects A/B against the four specified observations, while C fits. The colored decomposition is a model hypothesis, not a measured biological mechanism. The numeric table and questions are optional expandable details.

The appraisal pass extends the counterexample to a negative treatment coefficient: explanation D (`treatment=-1`, `batch=+4`) still predicts the original observations 5 and 8. In the crossed design it predicts 5, 4, 9, 8 against fixed observations 5, 6, 7, 8, so it is rejected. The positive observed difference therefore does not even identify treatment's sign in the confounded design. The slider's -2 to 5 range is explicitly an illustration range rather than inferred parameter bounds. Original signed waterfall arrows point left for decreases and right for increases, retain blue for treatment and brown for batch, and share a fixed 0–10 signal scale across all rows/designs. Black outlines remain observations; separate vertical marks show full hypothetical prediction endpoints.

The rank display clarifies that it includes the intercept column, while the illustrative baseline is fixed at 5. Additive identities and the sign counterexample are original derivations of the model; the cited DESeq2 documentation supports the identifiability problem, not these synthetic values or a biological causal claim.

The user-approved Plot Is All You Need skill's appraisal guidance was applied to original rendered keyframes. Its reviewed contact-sheet helper compared the confounded and crossed versions privately. Gallery examples informed directional layout conventions only; no copied figure or plotting script was published, no taste choice was fabricated, and nothing was ingested into a gallery. Earlier contributions remain still while only the newly introduced term animates. Hidden documents stop playback; manual and reduced-motion states retain the same values.

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

Final appraisal tests cover every signed quarter-step from -2 to 5 in both designs, exact negative-effect predictions, unchanged observations, leftward arrow endpoints, all staged keyframes, label size/clipping/overlap, pause-on-hidden behavior, mobile scrolling, and reduced-motion equivalence. The broader public-baseline audits remain unchanged and pass.
