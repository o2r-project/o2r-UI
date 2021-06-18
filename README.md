# o2r-UI
![Test](https://github.com/o2r-project/o2r-UI/actions/workflows/main.yml/badge.svg)


This project is a re-implementation of the [o2r-platform](https://github.com/o2r-project/o2r-platform) using React.

## Configuration

The API endpoint and the base URL for sharing ERCs on other platforms must be configured in `ui/public/config.js`.

## Development environment with docker-compose

You can start all required o2r microservices (using latest images from [Docker Hub](https://hub.docker.com/r/o2rproject)) with just two commands using `docker-compose` (version `1.20.0+`) and Docker (version `1.18.0+`).

First, **read the instructions on "Basics" and "Prerequisites" to prepare your host machine in the [`reference-implementation`](https://github.com/o2r-project/reference-implementation) project**.

This project contains one `docker-compose` configuration (file `ui/docker-compose-dev.yml`) to run all microservices & databases, and mount the client application directly from the source directory `client`.
If you see an error related to the MongoDB or HTTP request timeouts during the first "up", abort the execution, then try again.

### UI container

The container for the development of the UI is built locally based on `ui/Dockerfile.dev`.
Only the directory `/ui` is mounted into the container, so if dependencies in `ui/package.json` change, you must update the container with

```bash
docker-compose --file docker-compose-dev.yml build --no-cache ui
```

Also note that the `ui/node_modules` directory is mounted so that your host's version of `node` best matches the one used in the Dockerfile.

### Running the platform

```bash
cd ui/
docker-compose --file docker-compose-dev.yml up
```

The platform is available at [http://localhost](http://localhost) and the API at `http://localhost/api`.

## Production environment with docker-compose

This project has another docker-compose configuration for the deployment of a production build (file `ui/docker-compose.yml`).
This configuration has no `ui` container. Instead the webserver container creates a static production build with the command [`npm run build`](https://create-react-app.dev/docs/available-scripts/) using a [multi-stage docker file](https://docs.docker.com/develop/develop-images/multistage-build/) (file `ui/Dockerfile`) which is then served through nginx.
For this reason there is also another nginx configuration (file `ui/dev/nginx.conf`).
Because it shares a lot of the architecture with development configuration most of the endpoints are defined in a shared partial nginx configuration file (file `ui/dev/nginx-share.conf`).

To start the platform with the production build:

```bash
cd ui/

docker-compose up 

# force rebuild of images
docker-compose up --build
```

If you want to change the webserver container use:

```bash
docker-compose --file o2r-UI/ui/docker-compose.yml build --no-cache webserver
```

### Accessing the API directly

1. Click the "Log in" button in the UI
1. Obtain the authentication token from the cookies
1. Use it for requests outside of the UI, e.g. with curl [as described in the API docs](https://o2r.info/api/user/#client-authentication)

### Using with local microservices

If you want to run the UI based on locally running microservices, i.e., the o2r service runs no in containers but in Node.js processes locally on your machine, you can use a special docker-compose file, which uses an nginx configuration that does (a) not start database servers  and (b) redirects all requests to the respective ports of the host IP (_only works on Linux!_):

```bash
docker-compose --file o2r-UI/ui/docker-compose-dev-local-microservices.yml up
```

**Installing new packages**

After you installed further packages from [npm](https://www.npmjs.com/), you have to rebuild the container. 
The easiest way to do this are these two commands:
```bash
docker-compose down -v
docker-compose up --build
```
After the build the packages are available to use.

## Create a release

This repository contains two pieces of software, whose versions are managed in `ui/bindings/package.json` and `ui/package.json` respectively.
The `major.minor` versions must be kept in sync, `.bugfix` versions may differ.

```bash
cd ui/
npm install

cd bindings
npm install
```

The images are built on Docker Hub:

- [o2rproject/ui](https://hub.docker.com/r/o2rproject/ui)
- [o2rproject/o2r-bindings](https://hub.docker.com/r/o2rproject/o2r-bindings)


## Test

Tests run as GitHub actions and you can inspect them over here:

![Test](https://github.com/o2r-project/o2r-UI/actions/workflows/main.yml/badge.svg)


To run the test by yourself, complete the following steps:

- Run the platform
    - ```cd ui/```
    - ```docker-compose up```
- Install all packages local
    - ```npm install```
- Run all the test
    - ```npm test```

You can debug the GithHub Actions. Collaborators can manually start the debug [workflow](https://github.com/o2r-project/o2r-UI/actions/workflows/debug.yml) and can connect via ssh to the host system on which the actual Action run. 
For further infromation read the [debug docs](https://github.com/marketplace/actions/debugging-with-tmate)