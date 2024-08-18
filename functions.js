// loggerFunctions.js
const logger = require('./logger');
const {parse} = require("node:querystring");

function logRequest(request) {
  let body;
  try {
    const contentType = request.headers['content-type'];
    if (contentType === 'application/json') {
      body = JSON.parse(request.rawBody);
    } else if (contentType === 'application/x-www-form-urlencoded') {
      body = parse(request.rawBody);
    } else {
      body = request.rawBody; // For plain text, no parsing is needed
    }
  } catch (e) {
    body = request.rawBody;
  }

  //Request :
  logger.info({
    message: `Proxy Send : ${request.method} ${request.url}`,
    proxyId: request.headers['proxy-id'],
    headers: request.headers,
    body: body
  });
}


async function logResponse(request, reply, payload) {
  let payloadString = '';
  let payloadStringFormatted = '';
  try {
    const chunks = [];
    for await (const chunk of payload) {
      chunks.push(chunk);
    }
    payloadString = Buffer.concat(chunks).toString('utf8');

    try {
      const contentType = reply.getHeader('content-type');
      if (contentType === 'application/json') {
        payloadStringFormatted = JSON.parse(payloadString);
      } else if (contentType === 'application/x-www-form-urlencoded') {
        payloadStringFormatted = parse(payloadString);
      } else if (contentType === 'text/plain') {
        payloadStringFormatted = payloadString; // For plain text, no parsing is needed
      }
    } catch (e) {
      payloadStringFormatted = payloadString;
    }
  } catch (e) {
  }

  logger.info({
    message: `Proxy Response: ${request.method} ${request.url}`,
    proxyId: request.headers['proxy-id'],
    headers: reply.getHeaders(),
    statusCode: reply.statusCode,
    body: payloadStringFormatted
  });
}

async function logRequestResponse(request, reply, payload) {
  logRequest(request);
  await logResponse(request, reply, payload);
}

module.exports = {
  logRequestResponse
};
