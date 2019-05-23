# o2r-UI

## Development environment with Docker Compose

You can start all required o2r microservices (using latest images from [Docker Hub](https://hub.docker.com/r/o2rproject)) with just two commands using `docker-compose` (version `1.20.0+`) and Docker (version `1.18.0+`).

First, **read the instructions on "Basics" and "Prerequisites" to prepare your host machine in the [`reference-implementation`](https://github.com/o2r-project/reference-implementation) project**.

This project contains one `docker-compose` configuration (file `ui/docker-compose.yml`) to run all microservices & databases, and mount the client application directly from the source directory `client`.
If you see an error related to the MongoDB or HTTP request timeouts during the first "up", abort the execution, then try again.

**UI container**

The container for the UI is built locally based on `ui/Dockerfile`.
Only the directory `/ui` is mounted into the container, so if dependencies in `ui/package.json` change, you must update the container with `docker-compose build ui`.

**Running the platform**

```bash
cd ui/
docker-compose up
```

The platform is available at http://localhost and the API at `http://localhost/api`.

**Accessing the API directly**

1. Click the "Log in" button in the UI
1. Obtain the authentication token by 
