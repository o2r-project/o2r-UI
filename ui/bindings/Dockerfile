FROM rocker/geospatial:3.6.3

SHELL ["/bin/bash", "-c"]

RUN R -e 'install.packages(c("diveMove", "trip", "adehabitatLT", "plm", "cshapes", "plumber", "STEPCAM", "MCMCglmm", "MCMCpack", "gdistance"))'
RUN R -e 'install.packages(c("compositions", "latticeExtra", "ggplot2", "dplyr", "rasterVis", "RColorBrewer", "mapproj", "gridExtra", "ggplot2"))'
RUN R -e 'install.packages(c("plyr", "reshape2", "wesanderson", "grid", "plotrix", "shotGroups", "reshape", "RSAGA", "pROC", "vcd", "caret", "fields", "extRemes", "truncnorm", "palaeoSig"))'
RUN R -e 'install.packages(c("rioja", "FME", "SoilR", "verification", "MASS", "stringr", "plyr", "lubridate", "metafor", "forecast", "expsmooth", "mice", "mitools", "Zelig", "VIM"))'
RUN R -e 'install.packages(c("caTools", "Cairo", "stats", "extrafont", "xts", "maps"))'
RUN R -e 'install.packages("INLA", repos=c(getOption("repos"), INLA="https://inla.r-inla-download.org/R/stable"), dep=TRUE)'
RUN R -e 'install.packages(c("truncnorm"))'
#update of package raster needed to run specific bindings
RUN R -e 'install.packages(c("raster"))' 

# based on https://gist.github.com/remarkablemark/aacf14c29b3f01d6900d13137b21db3a
RUN apt-get --allow-releaseinfo-change update \
    && apt-get install -y curl \
    && apt-get -y autoclean

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.10.0
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

#WORKDIR /bindings

COPY package.json package.json

RUN npm install --production


COPY config config
COPY index.js index.js
COPY controllers controllers
COPY controllers/bindings.js controllers/bindings.js 

# Metadata params provided with docker build command
ARG VERSION=dev
ARG VCS_URL
ARG VCS_REF
ARG BUILD_DATE

# Metadata http://label-schema.org/rc1/
LABEL maintainer="o2r-project <https://o2r.info>" \
  org.label-schema.vendor="o2r project" \
  org.label-schema.url="https://o2r.info" \
  org.label-schema.name="o2r bindings" \
  org.label-schema.description="linking data, text, and code for research transparency" \    
  org.label-schema.version=$VERSION \
  org.label-schema.vcs-url=$VCS_URL \
  org.label-schema.vcs-ref=$VCS_REF \
  org.label-schema.build-date=$BUILD_DATE \
  org.label-schema.docker.schema-version="rc1"

CMD ["node", "index.js"]

