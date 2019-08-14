library("plumber")
#setwd(file.path("figureRadio"))
path = paste("figureRadio.R", sep = "")
r <- plumb(path)
r$run(host = "0.0.0.0", port=8123)

