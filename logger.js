const pino = require('pino');
const rfs = require('rotating-file-stream');
const path = require('path');
const {existsSync, mkdirSync} = require("fs");

// Create a rotating file stream for daily log rotation
const logDirectory = path.join(__dirname, 'logs');
if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory);
}

const logStream = rfs.createStream('app.log', {
  interval: '1d', // Rotate daily
  path: logDirectory,
  maxFiles: 14, // Keep 14 log files
});

// Create the logger, using pino-pretty for formatting
const logger = pino(
  {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    level: 'info',// Adjust log level as needed
    timestamp: pino.stdTimeFunctions.isoTime,
    test: false,
  },
  logStream // Direct output to the rotating file stream
);

module.exports = logger;
