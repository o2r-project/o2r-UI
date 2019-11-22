#install.packages('plumber', repos='http://cran.rstudio.com/')
library("plumber")
#r <- plumb("/bindings/controllers/plumber/plumber.R")  # Where 'myfile.R' is the location of the file shown above
r <- plumb("/home/markus/o2r-platform/bindings/o2r-bindings/controllers/plumber/plumber.R")  # Where 'myfile.R' is the location of the file shown above
r$run(host = '0.0.0.0', port=8000)
