import morgan from 'morgan';
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), winston.format.simple())
  ),
  defaultMeta: { service: 'aigig-api' },
  transports: [new winston.transports.Console()],
});

export const httpLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
);
