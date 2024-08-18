Here's a `README.md` file for your `simple-proxy-server` project:

```markdown
# Simple Proxy Server

A Fastify server that acts as an inbound and outbound proxy.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Health Check](#health-check)
- [Logging](#logging)
- [Error Handling](#error-handling)
- [License](#license)

## Description

This project is a Fastify-based proxy server that forwards HTTP requests from inbound routes to specified outbound
routes. It supports custom logging, health checks, and error handling, making it suitable for production environments.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/simple-proxy-server.git
   cd simple-proxy-server
   ```

2. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

## Configuration

1. Create a `.env` file in the root directory to specify the environment variables:

   ```dotenv
   HTTP_PORT=3000
   ```

2. Create an `app-proxies.json` file in the root directory to define the proxy routes:

   ```json
   {
     "servers": [
       {
         "inbound": "api",
         "outbound": "http://example.com/api"
       },
       {
         "inbound": "auth",
         "outbound": "http://example.com/auth"
       }
     ]
   }
   ```

## Usage

To start the server, use one of the following commands:

- Start the server in production mode:

  ```bash
  yarn start
  ```

- Start the server in development mode with auto-reloading:

  ```bash
  yarn dev
  ```

The server will listen on the port specified in the `.env` file (default is `3000`).

## Health Check

A health check endpoint is available at:

```bash
GET /health
```

This endpoint returns a JSON response indicating the server's health status:

```json
{
  "status": "ok"
}
```

## Logging

The server uses a custom logger with `pino`, and logs are saved to rotating files. All requests and responses are logged
for audit purposes.

## Error Handling

The server includes error handling for unhandled promise rejections, uncaught exceptions, and HTTP2 protocol errors.
These errors are logged and managed gracefully to ensure server stability.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Author**: Fawaz ADISA

```
