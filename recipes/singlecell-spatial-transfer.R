# Original synthetic example for donor-aware single-cell and spatial workflows.
# Run with Rscript singlecell-spatial-transfer.R. Only base R is required.
# This illustrates aggregation and validation; it does not run a production scRNA workflow.

set.seed(592)
cell_meta <- expand.grid(donor = paste0("D", 1:4), condition = c("C", "T"),
                         celltype = c("A", "B"), cell_index = 1:10,
                         KEEP.OUT.ATTRS = FALSE, stringsAsFactors = FALSE)
cell_meta$cell_id <- paste0("cell", seq_len(nrow(cell_meta)))
cell_meta$sample_id <- paste(cell_meta$donor, cell_meta$condition, sep = "_")
raw_counts <- matrix(rpois(40 * nrow(cell_meta), 3), nrow = 40,
                     dimnames = list(paste0("gene", 1:40), cell_meta$cell_id))
stopifnot(all(raw_counts >= 0), all(raw_counts == round(raw_counts)),
          identical(colnames(raw_counts), cell_meta$cell_id))

# Aggregate integer counts within biological sample and cell type, not across donors.
group <- interaction(cell_meta$sample_id, cell_meta$celltype, drop = TRUE, sep = ":")
pseudobulk <- t(rowsum(t(raw_counts), group = group, reorder = FALSE))
group_rows <- match(colnames(pseudobulk), as.character(group))
sample_meta <- cell_meta[group_rows, c("donor", "condition", "celltype", "sample_id")]
rownames(sample_meta) <- colnames(pseudobulk)
sample_meta$cells <- as.integer(table(group)[colnames(pseudobulk)])
stopifnot(identical(colnames(pseudobulk), rownames(sample_meta)),
          all(rowSums(pseudobulk) == rowSums(raw_counts)))

# Fit each cell type separately after defining minimum-cell and filtering policies.
# Four paired donors provide the grouping structure, not a guarantee of adequate power.
use <- sample_meta$celltype == "A"
analysis_meta <- sample_meta[use, ]
analysis_meta$condition <- factor(analysis_meta$condition, levels = c("C", "T"))
design <- model.matrix(~ donor + condition, analysis_meta)
stopifnot(qr(design)$rank == ncol(design), nrow(design) > ncol(design))
print(sample_meta)
print(design)

# Optional production handoff with DESeq2 after experiment-specific QC/filtering:
# dds <- DESeq2::DESeqDataSetFromMatrix(pseudobulk[, use], analysis_meta,
#                                     design = ~ donor + condition)
# dds <- DESeq2::DESeq(dds)
# result <- DESeq2::results(dds, contrast = c("condition", "T", "C"))
# Integrated embeddings, imputed values and soft-assigned fractional counts are not this input.

# Spatial coordinates must share units and be transformed into the same coordinate system.
coordinates <- cbind(x_um = c(0, 1, 2, 3, 4, 5), y_um = rep(0, 6))
expression <- c(1, 1, 2, 8, 9, 9)
distance <- as.matrix(dist(coordinates))
weights <- 1 * (distance > 0 & distance <= 1.1)
moran <- function(x, w) {
  centered <- x - mean(x)
  if (sum(w) == 0 || sum(centered^2) == 0) return(NA_real_)
  length(x) / sum(w) * sum(w * outer(centered, centered)) / sum(centered^2)
}
observed <- moran(expression, weights)
null_values <- replicate(999, moran(sample(expression), weights))
# This unrestricted permutation assumes exchangeability within this synthetic section.
# Real anatomical gradients, masks and repeated sections can invalidate that assumption.
upper_p <- (1 + sum(null_values >= observed)) / (1 + length(null_values))
print(c(Moran_I = observed, within_section_upper_tail_p = upper_p))

# Compare assignment sensitivity, while retaining unassigned mass.
assignment <- function(offset, temperature = 4, threshold = .8) {
  cost <- c((2 - offset)^2, (2 - (4 + offset))^2)
  probability <- exp(-(cost - min(cost)) / temperature)
  probability <- probability / sum(probability)
  accepted <- max(probability) >= threshold
  hard <- matrix(c(16, 3, 3, 16), nrow = 2, byrow = TRUE)
  unassigned <- c(4, 4)
  if (accepted) {
    hard[which.max(probability), ] <- hard[which.max(probability), ] + unassigned
    unassigned <- c(0, 0)
  }
  stopifnot(all(colSums(hard) + unassigned == c(23, 23)))
  c(offset = offset, weight_A = probability[1], accepted = accepted,
    assigned_G1 = sum(hard[, 1]), unassigned_G1 = unassigned[1])
}
print(t(vapply(seq(-1, 1, by = .25), assignment, numeric(5))))
cat("PASS: sample alignment, integer aggregation, paired design and spatial mass balance.\n")
cat("Spatial cells/bins are nested in sections and donors; validate across held-out donors.\n")
print(sessionInfo())
