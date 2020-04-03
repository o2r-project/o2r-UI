# Example script to run INSYDE using the default settings
install.packages("truncnorm")
library(truncnorm)

# Change working directory if necessary
# setwd(".")

# Load INSYDE main function
source("insyde_function.R")

# Read hazard and exposure variables
source("hazard_variables.R")
source("exposure_variables.R")

# Read unit prices
up <- read.table("unit_prices.txt")

# Read replacement values
repValData <- read.table("replacement_values.txt", header = TRUE)
repVal <- repValData[BS, BT]

# Define whether or not to consider uncertainty
uncert <- 0

if (!uncert) {
  # Compute expected damage. Note that (only) one of the hazard variables can 
  # be passed to the function as a vector.
  modelOutput <- ComputeDamage(he, v, d, s, q, 
                  FA, IA, BA, EP, IH, BH, GL, NF, BT, BS, PD, PT, FL, YY, LM, 
                  repVal, up, uncert)
} else if (uncert) {
  # Probabilistic computation. All the hazard variables must be passed to the
  # function as scalars.
  # This example assumes that the variable he is a vector. It is therefore
  # necessary to iterate over its elements and pass them to the function one
  # at a time.
  nrSim <- 2000
  statMat <- matrix(NA, nrow = length(he), ncol = 4)
  for (i in 1:length(he)) {
    modelOutput <- ComputeDamage(he[i], v, d, s, q, 
                    FA, IA, BA, EP, IH, BH, GL, NF, BT, BS, PD, PT, FL, YY, LM,
                    repVal, up, uncert, nrSim)
    # For each element of he, calculate some summary statistics and save them
    # to a matrix.
    statMat[i, 1] <- quantile(modelOutput$absDamage, .05)
    statMat[i, 2] <- mean(modelOutput$absDamage)
    statMat[i, 3] <- quantile(modelOutput$absDamage, .95)
    statMat[i, 4] <- mean(modelOutput$relDamage)
  }
}

par(mar = c(5, 4.2, 4, 4.5))
plot(he, modelOutput$absDamage, type = "l", lwd = 2, ylim = c(0, max(modelOutput$absDamage) * 1.12), xlab = "Water depth (m)", ylab = "Damage (€)", main = "Building damage", panel.first = grid(NULL))
lines(he, modelOutput$groupDamage[, "dmgCleanUp"], lwd = 2, col = "green4")
lines(he, modelOutput$groupDamage[, "dmgRemoval"], lwd = 2, col = "blue4")
lines(he, modelOutput$groupDamage[, "dmgNonStructural"], lwd = 2, col = "darkorange")
lines(he, modelOutput$groupDamage[, "dmgStructural"], lwd = 2, col = "firebrick1")
lines(he, modelOutput$groupDamage[, "dmgFinishing"], lwd = 2, col = "gold2")
lines(he, modelOutput$groupDamage[, "dmgSystems"], lwd = 2, col = "green1")
par(new = TRUE)
plot(he, modelOutput$relDamage, type = "l", lwd = 2, axes = FALSE, ylim = c(0, max(modelOutput$relDamage) * 1.12), xlab = NA, ylab = NA)
axis(side = 4)
mtext(side = 4, line = 3, "Relative damage")
legend("topleft", bg = "white", c("damage total","cleanup","removal","non structural","structural","finishing+WD","systems"), fill = c("black","green4","blue4","darkorange","firebrick1","gold2","green1"))


