# base image
FROM node:14-buster as build

WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm install react-scripts@3.4.3 -g --silent

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install --silent

COPY . /usr/src/app/.
RUN npm run build

FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# setting the nginx configuration
COPY ./dev/nginx.conf etc/nginx/nginx.conf
COPY ./dev/nginx-cors.conf /etc/nginx/nginx-cors.conf
COPY ./dev/nginx-share.conf /etc/nginx/nginx-share.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Metadata params provided with docker build command
ARG VERSION=dev
ARG VCS_URL
ARG VCS_REF
ARG BUILD_DATE
