# o2r-UI

This project is a re-implementation of the o2r-platform (https://github.com/o2r-project/o2r-platform) and thus in progress. The original platform was based on AngularJS and is still working. But we decided to switch to React in order to have a more current software. Hence, in case you would like to try out, please check https://github.com/o2r-project/o2r-platform.

## Configuration

The API endpoint and the base URL for sharing ERCs on other platforms must be configured in `ui/src/helpers/config.json`.

## Development environment with docker-compose

You can start all required o2r microservices (using latest images from [Docker Hub](https://hub.docker.com/r/o2rproject)) with just two commands using `docker-compose` (version `1.20.0+`) and Docker (version `1.18.0+`).

First, **read the instructions on "Basics" and "Prerequisites" to prepare your host machine in the [`reference-implementation`](https://github.com/o2r-project/reference-implementation) project**.

This project contains one `docker-compose` configuration (file `ui/docker-compose.yml`) to run all microservices & databases, and mount the client application directly from the source directory `client`.
If you see an error related to the MongoDB or HTTP request timeouts during the first "up", abort the execution, then try again.

**UI container**

The container for the development of the UI is built locally based on `ui/Dockerfile.dev`.
Only the directory `/ui` is mounted into the container, so if dependencies in `ui/package.json` change, you must update the container with `docker-compose build --no-cache ui`.

**Running the platform**

```bash
cd ui/
docker-compose up
```

The platform is available at http://localhost and the API at `http://localhost/api`.

**Accessing the API directly**

1. Click the "Log in" button in the UI
1. Obtain the authentication token from the cookies
1. Use it for requests outside of the UI, e.g. with curl [as described in the API docs](https://o2r.info/api/user/#client-authentication)

**Using with local microservices**

If you want to run the UI based on locally running microservices, i.e., the o2r service runs no in containers but in Node.js processes locally on your machine, you can use a special docker-compose file, which uses an nginx configuration that does (a) not start database servers  and (b) redirects all requests to the respective ports of the host IP (_only works on Linux!_):

```bash
docker-compose --file o2r-UI/ui/docker-compose-local-microservices.yml up
```

**Installing new packages**

After you installed further packages from [npm](https://www.npmjs.com/), you have to rebuild the container. 
The easiest way to do this are these two commands:
```bash
docker-compose down -v
docker-compose up --build
```
After the build the packages are available to use.
