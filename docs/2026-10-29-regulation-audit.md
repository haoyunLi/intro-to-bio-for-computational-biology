# Regulation and model-system curriculum audit — 2026-10-29

This extension adds eight focused bridges to the existing biology curriculum. It preserves the English technical terms and explains their mechanisms, measurement meaning and failure modes in Chinese. All worked numbers and figures are original synthetic examples. They are not patient interpretations, wet-lab protocols, validated biological parameter defaults or reproductions of complete inference packages.

## Coverage decision

The existing curriculum already introduces variants (`g05`), VAF and copy number (`x14`), mosaicism (`x17`), regulatory DNA (`x06`, `s06`), perturbation and rescue (`x16`), ligand–receptor binding (`l01`) and communication inference (`l06`, `sp07`). The new chapters link back to those introductions and deepen distinctions that are easy to conflate.

| New chapter | Existing course | Additional understanding | Original visual / worked calculation |
| --- | --- | --- | --- |
| rb01 — Model systems | 05 | In vivo, In vitro, Ex vivo, context selection, experimental unit versus donor population inference | Four donors, three wells each: 12 measurements remain four donor sources |
| rb02 — Culture models | 05 | Primary culture, Cell line, Organoid; composition versus within-cell state; model drift | Two-subclone selection: fractions .2, 1/3, .5, 2/3 and marker means 3.2, 4, 5, 6 |
| rb03 — Variant origin and lineage | 01 | Somatic/Germline and Inherited/De novo as separate axes; sampling and copy-aware VAF | Two distinct diploid mixtures both yield VAF=.25 |
| rb04 — TF evidence | 01B | TF expression, motif, accessibility, occupancy, target-program activity | Signed target contributions [2,1,1], normalized score 4/3 |
| rb05 — Enhancer–gene linking | 01B | Candidate elements versus target links; distance, contact, correlation, perturbation; ABC denominator | [.4,.4,.4] products yield thirds; doubling third contact yields [.25,.25,.5] |
| rb06 — Signaling complexes | 13 | Stoichiometry, assembly capacity, binding, occupancy and response | 2:1 receptor capacity at most four; extra binding assumptions yield expected occupied=2 |
| rb07 — Communication inference | 13 | Complex-aware expression, resource/scale/thresholds, specificity null versus donor condition null | Pair means 2.5 and 4; links distinguish 20 cell-label assignments from 16 donor sign flips |
| rb08 — Perturbation logic | 05 | Necessity, Sufficiency, Rescue, scale-dependent Epistasis and out-of-context prediction | 2×2 additive contrast=2; multiplicative reference gives a different expected value |

Each chapter contains six deep sections, six ordered worked steps, three to five five-field terms, a question and answer, a data lens, an accessible original SVG figure and an interactive-lab link. The chapters cover mechanism, use, settings, trade-offs and debugging. The SVGs have title/description text, keyboard-accessible horizontal-scroll regions and explicit synthetic-example captions.

## Research boundaries checked

- **Model labels describe context, not a fixed hierarchy of truth.** Ex vivo can overlap with broad In vitro usage. Specify source, preserved architecture, time and missing mechanisms. [NC3Rs experimental model guidance](https://nc3rs.org.uk/3rs-resources/driver-recommendations/experimental-model), [human tissue models](https://nc3rs.org.uk/3rs-resources/increasing-human-tissue-use), [microphysiological systems](https://nc3rs.org.uk/3rs-resource-library/microphysiological-systems).
- **Culture is not a static identity.** Selection can change mixture averages without changing the expression of individual components; real systems can also have within-cell changes. The synthetic growth ratio is not a recommended culture setting. [Ben-David et al., 2018](https://www.nature.com/articles/s41586-018-0409-3), [Phipson et al., 2019](https://www.nature.com/articles/s41592-018-0253-2).
- **Variant origin and distribution require separate labels.** De novo does not mean Somatic, and a sampled tissue does not reveal every lineage. Somatic variants are acquired in a somatic lineage; presence in somatic tissue alone is insufficient because inherited constitutional variants are also present there. The VAF formula assumes normal ALT=0 and constant target-compartment copy number; constitutional variants and heterogeneous CN require a different expanded model. [MedlinePlus Genetics](https://medlineplus.gov/genetics/understanding/mutationsanddisorders/genemutation/), [NHGRI Mosaicism](https://www.genome.gov/genetics-glossary/Mosaicism), [ABSOLUTE](https://www.nature.com/articles/nbt.2203).
- **TF measurements are not interchangeable.** Motif accessibility does not establish specific TF binding; shared motifs, target-set choice and background can affect inferred activity. The signed toy is not AUCell, SCENIC or chromVAR. [chromVAR](https://www.nature.com/articles/nmeth.4401), [SCENIC](https://pubmed.ncbi.nlm.nih.gov/28991892/).
- **Enhancer scores depend on the candidate universe.** Activity-by-Contact ranks links under context and input assumptions; normalized values are not calibrated causal probabilities. [Fulco et al., 2019](https://www.nature.com/articles/s41588-019-0538-0).
- **RNA expression is not a physical concentration.** Receptor assembly, occupancy and functional response are distinct. Physical stoichiometry examples use known hypothetical protein quantities, while LR ingredient examples use expression summaries. [CellPhoneDB](https://pubmed.ncbi.nlm.nih.gov/32103204/), [CellChat](https://www.nature.com/articles/s41467-021-21246-9).
- **LR nulls answer different questions.** The AI lab's six-cell/20-label-assignment specificity null differs from the biology lab's four-paired-donor/16-sign-flip condition null. The biology lab uses a custom expression-times-distance score, not a full package implementation. Resource and method choice affect predictions; concordance is not causal validation. [Comparison of communication inference methods](https://www.nature.com/articles/s41467-022-30755-0), [NicheNet](https://www.nature.com/articles/s41592-019-0667-5).
- **Perturbation effects and interactions require a stated context and reference.** Guide identity is not guaranteed target engagement; additive and multiplicative nulls differ. Strict Necessity requires effective removal preventing the predefined phenomenon; reduction alone initially supports contribution or dependence, with viability and other alternatives checked. Four means without replicate variation cannot establish statistical significance. [Perturb-seq](https://doi.org/10.1016/j.cell.2016.11.038).

## Interactive connections

- `regulation-lab.html#models`: rb01, rb02, rb08; context and sampling hierarchy.
- `regulation-lab.html#lineage`: rb03; lineage and mixture assumptions.
- `regulation-lab.html#motif`: rb04; sequence/background arithmetic.
- `regulation-lab.html#enhancer`: rb05; activity, contact and normalization.
- `regulation-lab.html#complex`: rb06; assembly and binding assumptions.
- `regulation-lab.html#lr`: rb07; expression, spatial assumptions and donor-level condition contrast.
- AI lessons `motif-pwm-scoring`, `enhancer-gene-abc`, `regulon-tf-activity`, `ligand-receptor-inference`, `perturbation-generalization`, `variant-mixture-inference`: distinguish statistical models from biological evidence and compare evaluation units. All use the verified `#/lesson/<id>?animation=1` route.

## Validation

Run `node scripts/test-regulation-curriculum.mjs` from the repository. This test loads the extension independently into four stub course containers. It validates eight unique chapter IDs, course registration, substantive section text, six worked steps per chapter, source resolution, English-only technical-term names, term examples and limitations, SVG accessibility structure, and precise AI lesson routes.

The numerical checks independently verify donor counts, mixture selection, VAF ambiguity and CN effects, signed target contributions, ABC denominator sensitivity, stoichiometric bottlenecks, occupancy, complex-aware means and additive contrasts. They also cover invariants and invalid-input boundaries. Global loader/navigation checks and real-browser/lab QA are performed by the integrating task; this local test does not claim deployment completion.
