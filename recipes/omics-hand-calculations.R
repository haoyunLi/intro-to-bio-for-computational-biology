# Original synthetic examples. Run with: Rscript omics-hand-calculations.R
# No third-party packages are required. These are arithmetic checks, not analyses of real samples.

counts <- c(S1 = 10, S2 = 12, S3 = 30, S4 = 32)
metadata <- data.frame(sample_id = c("S3", "S1", "S4", "S2"),
                       condition = c("T", "C", "T", "C"),
                       batch = c("B", "A", "A", "B"))
stopifnot(!anyDuplicated(metadata$sample_id), setequal(names(counts), metadata$sample_id))
metadata <- metadata[match(names(counts), metadata$sample_id), ]
metadata$condition <- factor(metadata$condition, levels = c("C", "T"))
design <- model.matrix(~ batch + condition, metadata)
stopifnot(qr(design)$rank == ncol(design))
print(design)
print(tapply(counts, metadata$condition, mean))

# G3 changes composition; G1/G2 are stable before multiplying sequencing depth.
raw <- cbind(A = c(100, 100, 800), B = 2 * c(100, 100, 8000))
geometric_mean <- exp(rowMeans(log(raw)))
size_factor <- apply(raw / geometric_mean, 2, median)
normalized <- sweep(raw, 2, size_factor, "/")
cpm <- sweep(raw, 2, colSums(raw), "/") * 1e6
stopifnot(abs(log2(normalized[1, 2] / normalized[1, 1])) < 1e-12)
print(rbind(raw_G1 = raw[1, ], CPM_G1 = cpm[1, ], ratio_G1 = normalized[1, ]))

# P(X >= k) uses k-1 with lower.tail = FALSE.
print(phyper(5 - 1, 20, 200 - 20, 20, lower.tail = FALSE))
print(phyper(5 - 1, 20, 2000 - 20, 20, lower.tail = FALSE))
print(p.adjust(c(.01, .04, .03, .2), method = "BH"))

ranking <- setNames(c(4, 3, 2, 1, .5, -.5, -1, -2, -3, -4), paste0("G", 1:10))
members <- c("G1", "G3", "G4")
hit <- names(ranking) %in% members
weight <- abs(ranking)
increment <- ifelse(hit, weight / sum(weight[hit]), -1 / sum(!hit))
running_sum <- cumsum(increment)
stopifnot(abs(tail(running_sum, 1)) < 1e-12)
print(data.frame(gene = names(ranking), statistic = ranking, hit, increment, running_sum))
print(running_sum[which.max(abs(running_sum))])

# Two paired donors, with unequal cell capture across the four samples.
per_cell <- c(2, 4, 8, 10)
cell_number <- c(10, 90, 90, 10)
sample_count <- per_cell * cell_number
pooled_difference <- sum(sample_count[c(2, 4)]) / sum(cell_number[c(2, 4)]) -
                     sum(sample_count[c(1, 3)]) / sum(cell_number[c(1, 3)])
paired_difference <- mean(per_cell[c(2, 4)] - per_cell[c(1, 3)])
stopifnot(abs(pooled_difference + 2.8) < 1e-12, paired_difference == 2)
print(c(pooled_difference = pooled_difference, paired_difference = paired_difference))

# Distance-only assignment weights are not calibrated posteriors.
offset <- .5
temperature <- 4
cost <- c(A = (2 - offset)^2, B = (2 - (4 + offset))^2)
weight <- exp(-(cost - min(cost)) / temperature)
weight <- weight / sum(weight)
soft <- rbind(A = c(16, 3) + 4 * weight[1], B = c(3, 16) + 4 * weight[2])
stopifnot(all(abs(colSums(soft) - c(23, 23)) < 1e-12))
print(weight)
print(soft)
cat("PASS: arithmetic checks completed. No population-level hypothesis test was performed.\n")
