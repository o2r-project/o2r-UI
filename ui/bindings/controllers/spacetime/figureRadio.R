#' @get /figure1
#' @png 
function(newValue){ 
  options(prompt = "R> ", continue = "+  ", width = 70, useFancyQuotes = FALSE)
  set.seed(1331)
  library("foreign")
  data("wind", package = "gstat")
  library("plm")
  data("Produc", package = "plm")
  sp = cbind(x = c(0,0,1), y = c(0,1,1))
  row.names(sp) = paste("point", 1:nrow(sp), sep="")
  library("sp")
  sp = SpatialPoints(sp)
  time = as.POSIXct("2010-08-05", tz = "GMT")+3600*(10:13)
  m = c(10,20,30) # means for each of the 3 point locations
  values = rnorm(length(sp)*length(time), mean = rep(m, 4))
  IDs = paste("ID",1:length(values), sep = "_")
  mydata = data.frame(values = signif(values, 3), ID=IDs)
  library("spacetime")
  stfdf = STFDF(sp, time, time+60, data = mydata)
  xs1 = as(stfdf, "Spatial")
  x = as(stfdf, "STIDF")
  xs2 = as(x, "Spatial")
  library("gstat")
  data("wind")
  wind.loc$y = as.numeric(char2dms(as.character(wind.loc[["Latitude"]])))
  wind.loc$x = as.numeric(char2dms(as.character(wind.loc[["Longitude"]])))
  coordinates(wind.loc) = ~x+y
  proj4string(wind.loc) = "+proj=longlat +datum=WGS84"
  library("mapdata")
  wind$time = ISOdate(wind$year+1900, wind$month, wind$day)
  wind$jday = as.numeric(format(wind$time, '%j'))
  stations = 4:15
  windsqrt = sqrt(0.5148 * as.matrix(wind[stations])) # knots -> m/s
  Jday = 1:366
  windsqrt = windsqrt - mean(windsqrt)
  daymeans = sapply(split(windsqrt, wind$jday), mean)
  meanwind = lowess(daymeans ~ Jday, f = 0.1)$y[wind$jday]
  velocities = apply(windsqrt, 2, function(x) { x - meanwind })
  wind.loc = wind.loc[match(names(wind[4:15]), wind.loc$Code),]
  pts = coordinates(wind.loc[match(names(wind[4:15]), wind.loc$Code),])
  rownames(pts) = wind.loc$Station
  pts = SpatialPoints(pts, CRS("+proj=longlat +datum=WGS84"))
  library("rgdal")
  utm29 = CRS("+proj=utm +zone=29 +datum=WGS84")
  pts = spTransform(pts, utm29)
  wind.data = stConstruct(velocities, space = list(values = 1:ncol(velocities)), 
                          time = wind$time, SpatialObj = pts, interval = TRUE)
  library("xts")
  library("maptools")
  fname = system.file("shapes/sids.shp", package="maptools")[1]
  nc = readShapePoly(fname, proj4string=CRS("+proj=longlat +datum=NAD27"))
  time = as.POSIXct(strptime(c("1974-07-01", "1979-07-01"), "%Y-%m-%d"), 
                    tz = "GMT")
  endTime = as.POSIXct(strptime(c("1978-06-30", "1984-06-30"), "%Y-%m-%d"), 
                       tz = "GMT")
  data = data.frame(
    BIR = c(nc$BIR74, nc$BIR79),
    NWBIR = c(nc$NWBIR74, nc$NWBIR79),
    SID = c(nc$SID74, nc$SID79))
  nct = STFDF(sp = as(nc, "SpatialPolygons"), time, data, endTime)
  library("maps")
  states.m = map('state', plot=FALSE, fill=TRUE)
  IDs <- sapply(strsplit(states.m$names, ":"), function(x) x[1])
  states = map2SpatialPolygons(states.m, IDs=IDs)
  yrs = 1970:1986
  time = as.POSIXct(paste(yrs, "-01-01", sep=""), tz = "GMT")
  data("Produc")
  Produc.st = STFDF(states[-8], time, Produc[order(Produc[2], Produc[1]),])
  library("RColorBrewer")
  library("maptools")
  m = map2SpatialLines(
    map("worldHires", xlim = c(-11,-5.4), ylim = c(51,55.5), plot=F))
  proj4string(m) = "+proj=longlat +datum=WGS84"
  m = spTransform(m, utm29)
  grd = SpatialPixels(SpatialPoints(makegrid(m, n = 300)),
                      proj4string = proj4string(m))
  wind.data = wind.data[, "1961-04"]
  n = 10
  tgrd = xts(1:n, seq(min(index(wind.data)), max(index(wind.data)), length=n))
  pred.grd = STF(grd, tgrd)
  model = newValue
  days = 1.0
  v = vgmST("separable", space = vgm(0.6, model, 750000), time = vgm(1, model, days * 3600 * 24), sill=0.6)
  wind.ST = krigeST(values ~ 1, wind.data, pred.grd, v)
  colnames(wind.ST@data) <- "sqrt_speed"
  layout = list(list("sp.lines", m, col='grey'),
                list("sp.points", pts, first=F, cex=.5))
  print(stplot(wind.ST, col.regions=brewer.pal(11, "RdBu")[-c(10,11)], at=seq(-1.375,1,by=.25), par.strip.text = list(cex=.7), sp.layout = layout))
  
}