import Logger, { LoggerTags } from './logger';

const logger = Logger.getLogger();

/**
 * @example
 *
 * logger.debug(LoggerTags.Wallet, "xxx", 1, 2, 3, { a: 1 });
 * logger.info("xxx", 1, 2, 3, { a: 1 });
 * logger.warn("xxx", 1, 2, 3, { a: 1 });
 * logger.error("xxx", 1, 2, 3, { a: 1 });
 * logger.trace("xxx", 1, 2, 3, { a: 1 });
 */

export { Logger, LoggerTags, logger };
