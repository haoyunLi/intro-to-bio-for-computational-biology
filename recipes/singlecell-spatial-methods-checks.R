# Run with Rscript singlecell-spatial-methods-checks.R. Base R only.
# All values are synthetic teaching examples, not assay observations.
# This validates arithmetic; it does not run full single-cell methods.
near <- function(x, y, tolerance = 1e-10) stopifnot(max(abs(x - y)) < tolerance)

# 1. Ambient mixture: reconstruct a profile on a fixed 1,000-count scale.
truth <- c(800, 200, 0)
ambient <- c(.05, .15, .80)
observed <- .8 * truth + .2 * 1000 * ambient
near(observed, c(650, 190, 160))
recover <- function(rho) (observed - 1000 * rho * ambient) / (1 - rho)
near(recover(.2), truth)
stopifnot(recover(.4)[3] < 0)
print(data.frame(truth, observed, correct_rho = recover(.2), excessive_rho = recover(.4)))

# 2. A radius graph and one explicit smoothing step.
xy <- rbind(c(0,0), c(1,0), c(0,1), c(1,1), c(3,0), c(4,0), c(3,1), c(4,1))
adjacency <- 1 * (as.matrix(dist(xy)) <= 2.1)
diag(adjacency) <- 0
degree <- rowSums(adjacency)
weights <- adjacency / degree
signal <- c(rep(0,4), rep(10,4))
next_signal <- as.vector(.5 * signal + .5 * weights %*% signal)
near(next_signal, c(0,1.25,0,1.25,8.75,10,8.75,10))
centered <- next_signal - mean(next_signal)
moran <- length(signal) / sum(weights) * sum(weights * outer(centered, centered)) / sum(centered^2)
near(moran, 58/75)
print(data.frame(point = seq_along(signal), degree, signal, next_signal))

# 3. Mean centering cannot identify biology under complete confounding.
batch <- rep(0:1, each = 2)
type <- batch
known <- 4 * type + rep(c(-.25, .25), 2)
raw <- known + 4 * batch
centered <- raw - ave(raw, batch) + mean(raw)
near(diff(tapply(raw, type, mean)), 8)
near(diff(tapply(centered, type, mean)), 0)
near(diff(tapply(known, type, mean)), 4)
print(data.frame(batch, type, known, raw, centered))

# 4. Constrained two-signature mixture: perturbations are amplified by 1/c.
fit_weight <- function(contrast, noise) {
  if (contrast == 0) return(NA_real_)
  pmin(1, pmax(0, .65 + noise / contrast))
}
near(fit_weight(6, .2), .65 + .2/6)
near(fit_weight(.25, .2), 1)
stopifnot(is.na(fit_weight(0, .2)))
print(data.frame(contrast = c(6, .25, 0), estimate = sapply(c(6, .25, 0), fit_weight, noise = .2)))

# 5. Composition changes despite fixed absolute A and B.
control <- c(A = 100, B = 100, C = 100)
treatment <- c(A = 100, B = 100, C = 300)
near(treatment[1] - control[1], 0)
near(treatment[1] / sum(treatment) - control[1] / sum(control), -2/15)
near(log2(treatment[1] / treatment[2]) - log2(control[1] / control[2]), 0)
capture <- 1.5
treatment[1] <- treatment[1] * capture
near(log2(treatment[1] / treatment[2]) - log2(control[1] / control[2]), log2(capture))

# 6. A fixed 1NN predictor answers different questions under different splits.
predict_nearest <- function(train_x, train_y, test_x) {
  vapply(test_x, function(x) train_y[which.min(abs(train_x - x))], numeric(1))
}
x <- 0:11
test <- x[x %% 2 == 1]
train <- x[x %% 2 == 0]
near(mean(abs(test - predict_nearest(train, train, test))), 1)
test <- 6:11
for (buffer in 0:3) {
  train <- 0:(5 - buffer)
  near(mean(abs(test - predict_nearest(train, train, test))), 3.5 + buffer)
}
near(mean(abs((x + 4) - predict_nearest(x, x, x))), 4)
cat("PASS: six method demonstrations match independent Base R calculations.\n")
