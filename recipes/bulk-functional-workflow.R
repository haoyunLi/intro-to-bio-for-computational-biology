# Bio/CS teaching recipe: bulk counts -> three DE methods -> ORA and GSEA.
# Run: Rscript bulk-functional-workflow.R [output_directory]
# All counts, effects, gene IDs and gene sets are synthetic. No biological claims.
# edgeR is required for the shared filtering/normalization workflow. No auto-install.
# DESeq2, limma and clusterProfiler are optional; missing branches are recorded.
# Existing local libraries can be supplied with R_LIBS before invoking Rscript.
# Use independent biological samples; cells or spots are not independent donors.

args <- commandArgs(trailingOnly = TRUE)
output_dir <- if (length(args)) args[1] else "bulk_functional_output"
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
required_packages <- "edgeR"
missing_packages <- required_packages[!vapply(required_packages, requireNamespace,
                                             logical(1), quietly = TRUE)]
if (length(missing_packages)) {
  stop("Install compatible Bioconductor packages before running: ",
       paste(missing_packages, collapse = ", "))
}
packages <- c("edgeR", "DESeq2", "limma", "clusterProfiler")
available <- setNames(vapply(packages, requireNamespace, logical(1), quietly = TRUE), packages)
package_status <- data.frame(package = packages, available = unname(available),
                            version = vapply(packages, function(package) {
                              if (available[package]) as.character(utils::packageVersion(package)) else NA_character_
                            }, character(1)))
write.csv(package_status, file.path(output_dir, "package_status.csv"), row.names = FALSE)
record_skip <- function(branch, reason) {
  message(reason)
  writeLines(reason, file.path(output_dir, paste0(branch, "_not_executed.txt")))
}
method_results <- list()

# Generate a reproducible teaching dataset; keep truth separate from fitting inputs.
set.seed(20261028)
gene_ids <- sprintf("toy_g%03d", seq_len(600))
sample_ids <- c(paste0("C", 1:6), paste0("T", 1:6))
samples <- data.frame(sample_id = sample_ids,
                      condition = rep(c("Control", "Treatment"), each = 6),
                      batch = rep(rep(c("A", "B"), each = 3), 2),
                      stringsAsFactors = FALSE)
depth <- c(0.6, 0.9, 1.3, 0.8, 1.2, 1.7, 0.7, 1.0, 1.5, 0.9, 1.3, 1.8)
baseline <- 2^runif(600, 5, 10)
baseline[571:600] <- 0.2
condition_log2fc <- c(rep(2, 30), rep(-2, 30), rep(0, 540))
batch_log2fc <- c(rep(0, 60), rep(0.8, 60), rep(0, 480))
dispersion <- 0.08 + 4 / pmax(baseline, 10)
mean_counts <- outer(baseline, depth) *
  2^outer(condition_log2fc, as.integer(samples$condition == "Treatment")) *
  2^outer(batch_log2fc, as.integer(samples$batch == "B"))
counts <- matrix(rnbinom(length(mean_counts), mu = as.vector(mean_counts),
                         size = rep(1 / dispersion, length(sample_ids))),
                 nrow = 600, dimnames = list(gene_ids, sample_ids))
write.csv(data.frame(gene_id = gene_ids, counts, check.names = FALSE),
          file.path(output_dir, "input_counts.csv"), row.names = FALSE)
write.csv(data.frame(gene_id = gene_ids, condition_log2fc, batch_log2fc),
          file.path(output_dir, "simulation_truth_not_used_for_fitting.csv"),
          row.names = FALSE)

# Deliberately shuffle metadata to demonstrate alignment by ID, never row position.
samples <- samples[c(8, 2, 12, 4, 9, 1, 11, 6, 3, 10, 5, 7), ]
stopifnot(!anyDuplicated(samples$sample_id), !anyDuplicated(colnames(counts)),
          !anyDuplicated(rownames(counts)),
          setequal(samples$sample_id, colnames(counts)))
samples <- samples[match(colnames(counts), samples$sample_id), ]
rownames(samples) <- samples$sample_id
stopifnot(identical(rownames(samples), colnames(counts)),
          all(is.finite(counts)), all(counts >= 0), all(counts == round(counts)))
samples$condition <- factor(samples$condition, levels = c("Control", "Treatment"))
samples$batch <- factor(samples$batch)
design <- model.matrix(~ batch + condition, data = samples)
stopifnot(qr(design)$rank == ncol(design), nrow(design) > ncol(design))
write.csv(samples, file.path(output_dir, "aligned_samples.csv"), row.names = FALSE)
write.csv(design, file.path(output_dir, "design_matrix.csv"))

# Filter with the final design; raw counts remain unchanged by normalization.
y <- edgeR::DGEList(counts = counts)
keep <- edgeR::filterByExpr(y, design = design)
if (sum(keep) < 20) stop("Too few retained genes for this demonstration.")
y <- y[keep, , keep.lib.sizes = FALSE]
y <- edgeR::calcNormFactors(y, method = "TMM")
filtered_counts <- y$counts
log_cpm <- edgeR::cpm(y, log = TRUE, normalized.lib.sizes = TRUE)
write.csv(data.frame(gene_id = rownames(counts), retained = keep),
          file.path(output_dir, "filtering.csv"), row.names = FALSE)
write.csv(y$samples, file.path(output_dir, "TMM_library_factors.csv"))

# PCA is descriptive, not a test; batch remains in the plotted expression values.
pca <- prcomp(t(log_cpm), center = TRUE, scale. = FALSE)
write.csv(data.frame(sample_id = rownames(pca$x), pca$x[, 1:2], samples[, c("condition", "batch")]),
          file.path(output_dir, "PCA_coordinates.csv"), row.names = FALSE)
pdf(file.path(output_dir, "sample_QC.pdf"), width = 8, height = 6)
barplot(colSums(counts), names.arg = colnames(counts), las = 2,
        ylab = "Assigned counts", main = "Synthetic library totals")
plot(pca$x[, 1:2], pch = ifelse(samples$batch == "A", 16, 17),
     col = ifelse(samples$condition == "Control", "steelblue", "tomato"),
     main = "PCA of TMM logCPM")
text(pca$x[, 1:2], labels = samples$sample_id, pos = 3, cex = 0.7)
dev.off()

# DESeq2 estimates its own size factors, not the TMM factors in y.
if (available["DESeq2"]) {
  dds <- DESeq2::DESeqDataSetFromMatrix(countData = filtered_counts,
                                      colData = samples, design = ~ batch + condition)
  dds <- DESeq2::DESeq(dds, quiet = TRUE)
  deseq_result <- as.data.frame(DESeq2::results(dds,
                          contrast = c("condition", "Treatment", "Control"), alpha = 0.05))
  method_results$DESeq2 <- deseq_result
} else {
  record_skip("DESeq2", "DESeq2 not executed: package is not installed in the active R libraries.")
}

# edgeR tests the same condition effect using a negative-binomial QL workflow.
y <- edgeR::estimateDisp(y, design)
ql_fit <- edgeR::glmQLFit(y, design)
ql_test <- edgeR::glmQLFTest(ql_fit, coef = "conditionTreatment")
edge_result <- edgeR::topTags(ql_test, n = Inf, sort.by = "none")$table
method_results$edgeR <- edge_result

# voom fits weighted logCPM; weights represent mean-variance-dependent precision.
if (available["limma"]) {
  voom_data <- limma::voom(y, design, plot = FALSE)
  limma_fit <- limma::eBayes(limma::lmFit(voom_data, design))
  voom_result <- limma::topTable(limma_fit, coef = "conditionTreatment",
                                 n = Inf, sort.by = "none")
  stopifnot(all(is.finite(voom_data$weights)), all(voom_data$weights > 0))
  method_results$limma_voom <- voom_result
} else {
  record_skip("limma_voom", "limma-voom not executed: limma is not installed in the active R libraries.")
}

# Export full results separately from threshold-selected genes. Preserve NA values.
padj_columns <- c(DESeq2 = "padj", edgeR = "FDR", limma_voom = "adj.P.Val")
fc_columns <- c(DESeq2 = "log2FoldChange", edgeR = "logFC", limma_voom = "logFC")
padj_columns <- padj_columns[names(method_results)]
fc_columns <- fc_columns[names(method_results)]
summary_table <- data.frame()
for (method in names(method_results)) {
  result <- method_results[[method]]
  selected <- which(!is.na(result[[padj_columns[method]]]) & result[[padj_columns[method]]] < 0.05)
  write.csv(data.frame(gene_id = rownames(result), result),
            file.path(output_dir, paste0(method, "_all_tested.csv")), row.names = FALSE)
  write.csv(data.frame(gene_id = rownames(result)[selected], result[selected, , drop = FALSE]),
            file.path(output_dir, paste0(method, "_significant.csv")), row.names = FALSE)
  summary_table <- rbind(summary_table, data.frame(method, tested = nrow(result),
                                                  significant = length(selected)))
}
write.csv(summary_table, file.path(output_dir, "method_summary.csv"), row.names = FALSE)
print(summary_table)
cat("Discovery counts from this single simulation do not rank the methods.\n")

# Use the same plot limits; clamping zero affects only rendering, never tests.
all_fc <- unlist(Map(function(x, nm) x[[nm]], method_results, fc_columns))
all_p <- unlist(Map(function(x, nm) x[[nm]], method_results, padj_columns))
xlim <- range(all_fc[is.finite(all_fc)])
ylim <- c(0, max(-log10(pmax(all_p[is.finite(all_p)], .Machine$double.xmin))))
pdf(file.path(output_dir, "volcano_comparison.pdf"), width = 12, height = 4)
par(mfrow = c(1, length(method_results)))
for (method in names(method_results)) {
  result <- method_results[[method]]
  fc <- result[[fc_columns[method]]]
  p <- result[[padj_columns[method]]]
  valid <- is.finite(fc) & is.finite(p)
  plot(fc[valid], -log10(pmax(p[valid], .Machine$double.xmin)), pch = 16, cex = 0.5,
       col = ifelse(p[valid] < 0.05, "tomato", "grey60"), xlim = xlim, ylim = ylim,
       xlab = "Treatment / Control log2 fold change", ylab = "-log10(adjusted p)", main = method)
  abline(h = -log10(0.05), lty = 2)
}
dev.off()

# Custom synthetic sets make the example executable without organism databases.
# Replace these with documented annotation tables for research; record versions.
set_members <- list(Toy_positive = gene_ids[1:40], Toy_negative = gene_ids[31:70],
                    Toy_overlap = gene_ids[c(1:20, 31:50)], Toy_background_A = gene_ids[121:180],
                    Toy_background_B = gene_ids[181:240], Toy_background_C = gene_ids[241:300],
                    Toy_background_D = gene_ids[301:360], Toy_background_E = gene_ids[361:420])
term2gene <- do.call(rbind, lapply(names(set_members), function(term) {
  data.frame(term = term, gene = set_members[[term]], stringsAsFactors = FALSE)
}))
write.csv(term2gene, file.path(output_dir, "synthetic_TERM2GENE.csv"), row.names = FALSE)

# Eligibility uses finite test evidence, not significance. Keep every finite signed statistic.
if (available["DESeq2"]) {
  enrichment_input <- data.frame(stat = deseq_result$stat, pvalue = deseq_result$pvalue,
                                 padj = deseq_result$padj, effect = deseq_result$log2FoldChange,
                                 row.names = rownames(deseq_result))
  ranking_method <- "DESeq2 Wald statistic; positive = Treatment greater than Control."
} else {
  # A one-coefficient QL F statistic has no sign; attach the matching effect direction.
  # This signed sqrt(F) is a ranking score, not a claim that the QL test is a Wald test.
  enrichment_input <- data.frame(stat = sign(edge_result$logFC) * sqrt(edge_result$F),
                                 pvalue = edge_result$PValue, padj = edge_result$FDR,
                                 effect = edge_result$logFC, row.names = rownames(edge_result))
  ranking_method <- "edgeR signed sqrt(QL F) score for one coefficient; positive = Treatment greater than Control."
}
writeLines(ranking_method, file.path(output_dir, "ranking_method.txt"))
valid_test <- is.finite(enrichment_input$stat) & is.finite(enrichment_input$pvalue)
tested <- enrichment_input[valid_test, , drop = FALSE]
background <- rownames(tested)
up <- rownames(tested)[which(tested$padj < 0.05 & tested$effect >= 1)]
down <- rownames(tested)[which(tested$padj < 0.05 & tested$effect <= -1)]
ranking <- setNames(tested$stat, rownames(tested))
ranking <- sort(ranking, decreasing = TRUE)
stopifnot(!anyDuplicated(names(ranking)), all(is.finite(ranking)),
          all(diff(ranking) <= 0), all(c(up, down) %in% background))
# The submitted universe and this collection's annotated universe are distinct.
# clusterProfiler intersects the universe with TERM2GENE by default; expose both.
annotated_background <- intersect(background, unique(term2gene$gene))
write.csv(data.frame(gene_id = background), file.path(output_dir, "ORA_submitted_background.csv"), row.names = FALSE)
write.csv(data.frame(gene_id = annotated_background),
          file.path(output_dir, "ORA_annotated_background.csv"), row.names = FALSE)
write.csv(data.frame(metric = c("finite_tested_genes", "annotated_background", "Up_selected", "Down_selected",
                                "Up_annotated", "Down_annotated"),
                     count = c(length(background), length(annotated_background), length(up), length(down),
                               sum(up %in% annotated_background), sum(down %in% annotated_background))),
          file.path(output_dir, "enrichment_input_summary.csv"), row.names = FALSE)
write.csv(data.frame(gene_id = up), file.path(output_dir, "Up_genes.csv"), row.names = FALSE)
write.csv(data.frame(gene_id = down), file.path(output_dir, "Down_genes.csv"), row.names = FALSE)
write.csv(data.frame(gene_id = names(ranking), signed_statistic = unname(ranking)),
          file.path(output_dir, "GSEA_full_ranking.csv"), row.names = FALSE)

if (available["clusterProfiler"]) {
  for (direction in c("Up", "Down")) {
    genes <- if (direction == "Up") up else down
    result <- if (length(genes)) clusterProfiler::enricher(
      gene = genes, universe = background, TERM2GENE = term2gene,
      minGSSize = 15, maxGSSize = 200, pAdjustMethod = "BH",
      pvalueCutoff = 1, qvalueCutoff = 1) else NULL
    full <- if (is.null(result)) data.frame() else as.data.frame(result)
    selected <- if (nrow(full)) full[which(full$p.adjust < 0.05), , drop = FALSE] else full
    write.csv(full, file.path(output_dir, paste0("ORA_", direction, "_all_tested.csv")), row.names = FALSE)
    write.csv(selected, file.path(output_dir, paste0("ORA_", direction, "_significant.csv")), row.names = FALSE)
  }
  set.seed(20261028)
  gsea <- clusterProfiler::GSEA(geneList = ranking, TERM2GENE = term2gene,
                               minGSSize = 15, maxGSSize = 200, pvalueCutoff = 1,
                               pAdjustMethod = "BH", eps = 0, verbose = FALSE)
  full <- as.data.frame(gsea)
  write.csv(full, file.path(output_dir, "GSEA_all_tested.csv"), row.names = FALSE)
  significant <- full[which(full$p.adjust < 0.05), , drop = FALSE]
  write.csv(significant, file.path(output_dir, "GSEA_significant.csv"), row.names = FALSE)
  for (direction in c("Up", "Down")) {
    rows <- if (direction == "Up") which(full$NES > 0) else which(full$NES < 0)
    # Split results only. Never rerank or recalculate BH for a selected direction.
    write.csv(full[rows, , drop = FALSE],
              file.path(output_dir, paste0("GSEA_", direction, "_all_tested.csv")), row.names = FALSE)
  }
} else {
  note <- "ORA/GSEA not executed: clusterProfiler is not installed. DE outputs and enrichment inputs are complete."
  message(note)
  writeLines(note, file.path(output_dir, "enrichment_not_executed.txt"))
}
writeLines(c("Synthetic teaching simulation; not measured biology or a benchmark.",
             "Contrast: Treatment versus Control; design: ~ batch + condition.",
             "No paired donor effect: these twelve simulated samples are independent.",
             "Gene-level BH and term-level BH are separate testing families.",
             "GO/KEGG requires real identifiers and versioned annotations; toy sets here are not GO/KEGG.",
             "For single-cell/spatial, aggregate at the justified biological unit before sample-level DE."),
           file.path(output_dir, "analysis_scope.txt"))
capture.output(sessionInfo(), file = file.path(output_dir, "sessionInfo.txt"))
cat("Finished. Outputs: ", normalizePath(output_dir), "\n", sep = "")
