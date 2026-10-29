# Biology learning-flow review — 2026-10-29

## Scope and limits

Reviewed the full metadata catalogue of 24 courses and 245 chapters, all 13 guided-unit questions/outcomes/transitions and their 78 core steps, the RB01–RB08 prose and worked examples, and the glossary's English-name / definition / example / misconception structure. Also sampled the opening sections of 17 existing chapters across foundations, regulation, metabolism, inheritance, disease, experimental design, assays, raw data, statistics, project work and Single-cell / Spatial methods: B01, M02, X06, A01, L01, X09, X14, T03, D01, W09, Q04, R03, R06, SC05, SC12, SP07 and CB05.

This was a learning-sequence and editorial review. It is not a line-by-line scientific re-review of every paragraph in all 245 chapters or all 779 glossary entries. Numerical models and citations were preserved; no new methods or scientific claims were added.

## Findings and targeted changes

The main sequence is coherent: biological objects → information flow → regulation → cellular operation → coordination → inheritance → somatic changes → disease → experimental measurement → assays → data → analysis → project synthesis. The full course catalogue serves as a reference library, not a replacement linear reading order. All 78 core steps remain unchanged.

Five new introductory chapters asked readers to complete advanced applications before learning their underlying distinction. RB01 now starts from biological scales and experimental design; RB03 from diploidy and variant basics; RB04 from transcription and regulatory DNA; RB06 from cell signaling and ligand binding; RB07 from the communication overview and receptor-complex chapter. Deeper material remains linked where it becomes useful. Optional readings in the regulation, coordination and measurement units now group the relevant concepts before their further applications.

Several transitions were made explicit:

- RB01 first states the missing biological environment, then introduces the model-system names; its lab link names the actual donor-count and repeated-measurement controls.
- RB02 distinguishes the chapter's composition-growth example from the lab's donor/repeated-measurement example, avoiding the impression that the latter predicts culture growth.
- RB03 separates origin from distribution, and distinguishes the diploid lineage sandbox from the AI allele-mixture likelihood. The ambiguous phrase “different numerator” was rewritten as the ALT-copy counting rule.
- RB04 distinguishes a motif's sequence from the accessibility of the region containing it; the opening now follows abundance → access → occupancy → response.
- RB05 previously promised a Contact control in the biology sandbox, although Contact is fixed there. The handoff now states that the chapter changes E3 Contact, the biology lab changes E1 activity or the candidate set, and the AI lab changes E2 Contact. The reader compares the shared mechanism, not unmatched raw numbers.
- RB06 introduces physical signaling before the inference application, matching the revised prerequisite order.
- RB07 explains why physical receptor concepts lead to expression-based candidate inference and keeps Spatial methods as an optional extension.

A separate renderer issue was reported to the parent reviewer: some legacy generated chapters repeat their second intuition paragraph verbatim at the beginning of section one. That issue lies outside this review's owned files. The source text `penetrance <1` in X09 was also flagged as a text-extraction concern; no browser breakage was inferred from a regex-only extraction.

## Validation

Passed after edits:

- `node scripts/test-regulation-curriculum.mjs`
- `node scripts/audit-zero-background.mjs`
- `node scripts/test-regulation-integration.mjs`
- `git diff --check`

The counts remain 24 courses, 245 chapters, 1,089 sections, 364 source entries and 779 glossary terms. The model arithmetic, chart geometry, IDs, source references and core learning sequence are unchanged.

## Navigation and final integration

The renderer now follows RB01–RB08 as an explicit topic sequence. The existing 78-step core remains unchanged, while other extension neighbours are labelled as catalogue order. The final topic chapter returns to its overview rather than silently entering a different course. Exact repeated opening paragraphs are omitted only when meaningful section content remains; the chapter data is preserved. The homepage now introduces the continuous core before optional topics, with an in-place shortcut to regulation. Stale public chapter counts and the X09 penetrance sentence were corrected.

All biology audit and test scripts passed. Browser checks followed RB02 → RB03 and verified the RB08 endpoint, checked that X06's mental-model passage appears once, and confirmed homepage section order. No new scientific model or changed arithmetic was introduced.
