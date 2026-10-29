# Model Systems & Regulation Lab

The new standalone `regulation-lab.html` supplies six original synthetic teaching
models. The page preserves the existing white/navy reading and operation hierarchy.
All technical names remain English; questions, explanation and evidence bounds are
primarily Chinese. No fitted biological performance or clinical predictions are shown.

## Six reproducible paths

| Anchor | Inputs and actual computation | Connection |
|---|---|---|
| `models` | Platform context; donors n and measurements m. Balanced random-intercept SE = sqrt(4/n + 9/(nm)); variance decomposition, naive row-level SE and limiting SE. | rb01, rb02 |
| `lineage` | Declared origin, sampled compartment and clone fraction. Diploid heterozygote copy counting; expected VAF = f/2. | rb03 |
| `motif` | Sequence, total pseudocount mass and GC background. PFM → normalized probabilities → per-position log2(P/q) → total PWM score. | rb04 |
| `enhancer` | E1 activity and candidate inclusion. A×C weights → candidate-set denominator → relative ABC scores. | rb05 |
| `complex` | R2 copies and free ligand. Hypothetical 2R1:1R2 capacity upper bound; one-site equilibrium occupancy and expected bound count. | rb06 |
| `lr` | Receptor bottleneck and spatial length scale. Custom expression×distance score; paired donor contrasts; exact enumeration of 16 sign flips. | rb07 |

Each path has four manual stages, bounded play/pause and speed controls, a reset,
parameter-responsive quantitative SVG, a data table, a predict/check question,
usage guidance, tuning guidance, symptom/check/action troubleshooting and linked
primary sources. The selected stage is retained after parameter edits. Playback
stops when parameters change, the tab is hidden, or the stage leaves the viewport.
Reduced Motion disables playback while retaining every manual calculation.
SVG and table overflow remains local, rather than expanding the mobile page.

## Evidence and interpretation bounds

- The platform selector changes the question/context checklist, not fictitious
  comparative accuracy. In vitro and ex vivo usage can overlap. Treatment
  assignment unit and population inference unit are explicitly distinguished.
- The lineage compartments are simplified bookkeeping, not reconstructed
  developmental biology. Germ-cell progenitors mean **pre-meiotic diploid cells**,
  not mature haploid gametes. Inherited/de novo history cannot be inferred from
  blood VAF; copy-number variation, read sampling and offspring risk are excluded.
- The PWM is a hand-calculated four-position model, not a full FIMO implementation.
  It does not provide occupancy probability or genome-wide FDR.
- ABC normalization does not calibrate causal probabilities. Activity and contact
  have separate panels; changing the candidate universe changes the denominator.
- The receptor stoichiometry is hypothetical. Capacity is an upper bound;
  occupancy is not activation, and Kd is not automatically EC50.
- LR means Ligand–Receptor. The custom score is not CellPhoneDB or CellChat's
  scoring equation. Paired-donor condition sign flips are distinct from
  CellPhoneDB cell-label specificity shuffles. Exchangeability assumptions,
  one-sided testing, minimum p=1/16 and lack of multiplicity correction are stated.
  The null graph shows discrete points, without interpolating between permutations.

## Primary sources checked

- [NC3Rs model selection](https://nc3rs.org.uk/3rs-resources/driver-recommendations/experimental-model)
- [NC3Rs experimental units](https://eda.nc3rs.org.uk/experimental-design-unit)
- [NHGRI Mosaicism](https://www.genome.gov/genetics-glossary/Mosaicism)
- [MedlinePlus Genetics variant origins](https://medlineplus.gov/genetics/understanding/mutationsanddisorders/genemutation/)
- [MEME Suite FIMO](https://meme-suite.org/meme/doc/fimo.html)
- [Fulco et al., Activity-by-Contact](https://pmc.ncbi.nlm.nih.gov/articles/PMC6886585/)
- [Hulme & Trevethick, equilibrium ligand binding](https://pmc.ncbi.nlm.nih.gov/articles/PMC3000649/)
- [CellPhoneDB method documentation](https://cellphonedb.readthedocs.io/en/stable/RESULTS-DOCUMENTATION.html)

## Verification

`node scripts/test-regulation-math.mjs` validates independent numerical fixtures,
1,963 supported parameter combinations, conservation/normalization/bounds,
monotonicity, exact permutation identities and invalid numeric inputs. The test
loads the same pure `window.BIOCS_REGULATION_MATH` module in a Node VM, without UI
dependencies. Browser layout, interaction and publication checks are performed
separately by the integrating task; this mathematical check does not claim those
checks have completed.

The page links to the shared AI route
`#/concepts/biology-regulation-inference`, and to the matching motif, ABC,
variant mixture and LR lessons. Global navigation and publication are managed by
the integrating task.
