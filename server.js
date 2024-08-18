const dotenv = require('dotenv').config();
const fs = require('fs');
const fastify = require('fastify');
const logger = require('./logger'); // Import the custom logger
const path = require('path');
const hyperid = require('hyperid');
// Create the Fastify instance with the custom logger
const fastifyInstance = fastify({logger});
const {logRequestResponse} = require('./functions'); // Import logging functions

// Load the app-proxies.json file
const proxiesFilePath = path.join(__dirname, 'app-proxies.json');
const proxiesConfig = JSON.parse(fs.readFileSync(proxiesFilePath, 'utf-8'));

const uuid = hyperid();
// Dynamically create proxy routes based on the JSON configuration

fastifyInstance.register(require('fastify-raw-body'), {
  field: 'rawBody',
  global: true,
  encoding: 'utf8',
  runFirst: true,
  routes: [],
  jsonContentTypes: [],
})
proxiesConfig.servers.forEach(server => {
  fastifyInstance.register(require('@fastify/http-proxy'), {
    upstream: server.outbound,
    prefix: `/${server.inbound}`, // The inbound prefix from the JSON file
    rewritePrefix: '', // No rewrite needed
    replyOptions: {
      rewriteRequestHeaders: (originalReq, headers) => ({
        ...headers,
        'proxy-id': uuid(),
      }),
    },
    http2: false, // Use HTTP2 if needed
    keepAlive: true, // Enable keep-alive
  });
});

fastifyInstance.addHook('onSend', async (request, reply, payload) => {
  await logRequestResponse(request, reply, payload);
});
fastifyInstance.get('/health', async (request, reply) => {
  // You can add additional logic here to check the health of dependencies
  return {status: 'ok'};
});

// Start the Fastify server
const start = async () => {
  try {

    await fastifyInstance.listen({port: dotenv.parsed['HTTP_PORT'] || 3000});
    fastifyInstance.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
};

// Catch unhandled promise rejections and other errors
process.on('unhandledRejection', (reason, promise) => {
  fastifyInstance.log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (error) => {
  fastifyInstance.log.error(`Uncaught Exception: ${error}`);
});

// Catch HTTP2 errors
fastifyInstance.addHook('onError', (request, reply, error, done) => {
  if (error.code === 'ERR_HTTP2_ERROR') {
    request.log.error('HTTP2 Protocol Error:', error);
  } else {
    request.log.error(error);
  }
  done();
});

start();
