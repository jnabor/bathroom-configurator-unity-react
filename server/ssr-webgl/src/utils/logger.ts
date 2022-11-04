import { config } from './config';
const winston = require('winston');

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.json(),
});

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));

export default logger;