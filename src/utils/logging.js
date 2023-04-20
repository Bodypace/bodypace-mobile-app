const LOG_LEVELS = {
  DEBUG: 0,
  LOG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
}

const log_level = LOG_LEVELS.DEBUG

const logger = {
  debug: (...x) => log_level <= LOG_LEVELS.DEBUG && console.debug(...x),
  log: (...x) => log_level <= LOG_LEVELS.LOG && console.log(...x),
  info: (...x) => log_level <= LOG_LEVELS.INFO && console.info(...x),
  warn: (...x) => log_level <= LOG_LEVELS.WARN && console.warn(...x),
  error: (...x) => log_level <= LOG_LEVELS.ERROR && console.error(...x),
}

export default logger