/* eslint-disable max-classes-per-file */
import { IS_PRODUCTION } from '@ui/config';
import loglevel from 'loglevel';
import moize from 'moize';

import { getAllCookies, removeCookie } from './cookies';

export const LOG_LEVEL = (IS_PRODUCTION ? 'error' : process.env.LOG_LEVEL || 'info') as loglevel.LogLevelDesc;
export const LOG_FILTER: string = process.env.LOG_FILTER || '';

const LOG_LEVEL_PREFIX = 'loglevel';
const SEPARATOR = '.';
const NEGATION = '!';
const SEPARATOR_REGEX = /\\./g;
const MATCH_MANY_REGEX = /\*\*/g;
const MATCH_ONE_REGEX = /\*/g;
const BASE_LOGGER_NAME = 'voiceflow';
const [LOG_WHITELIST, LOG_BLACKLIST] = (LOG_FILTER || '')
  .split(',')
  .filter(Boolean)
  .reduce<[RegExp[], RegExp[]]>(
    ([whitelist, blacklist], glob) => {
      const pattern = `^${BASE_LOGGER_NAME}\\.${
        glob ? glob.replace(SEPARATOR_REGEX, '\\.').replace(MATCH_MANY_REGEX, '.*?').replace(MATCH_ONE_REGEX, '[^\\.]*') : '.*'
      }$`;

      if (glob.startsWith(NEGATION)) {
        return [whitelist, [...blacklist, RegExp(pattern)]];
      }

      return [[...whitelist, RegExp(pattern)], blacklist];
    },
    [[], []]
  );

const LOG_MESSAGE_STYLE = 'color: #cfcfcf;';
const LOG_SUBTLE_PATH_STYLE = 'color: #7d7d7d;';
const LOG_BOLD_STYLE = 'font-weight: bold;';
const LOG_BOLD_PATH_STYLE = `color: #a4a4a4; ${LOG_BOLD_STYLE}`;
const LOG_FAILURE_STYLE = `color: #b20303; ${LOG_BOLD_STYLE}`;
const LOG_SUCCESS_STYLE = `color: #059333; ${LOG_BOLD_STYLE}`;
const LOG_PENDING_STYLE = `color: #f3cf08; ${LOG_BOLD_STYLE}`;
const LOG_RESET_STYLE = `color: #06b595; ${LOG_BOLD_STYLE}`;
const LOG_CONFIGURING_STYLE = `${LOG_MESSAGE_STYLE} ${LOG_BOLD_STYLE}`;
const LOG_CURRENT_STYLE = `color: #0699f3; ${LOG_BOLD_STYLE}`;

const METHOD_STYLES: Record<string, string> = {
  trace: 'color: #b5b5b5;',
  debug: 'color: #8b68c3;',
  info: 'color: #5d9df5;',
  warn: 'color: #ffab47;',
  error: 'color: #851452;',
};

const getToken = (value: any) => {
  switch (typeof value) {
    case 'number':
      return '%d';
    case 'object':
      return '%o';
    default:
      return '%s';
  }
};

abstract class LogEntity {
  format(): [string, string[]] {
    const [message, args] = this.formatEntity();

    return [`${message}%c`, [...args, LOG_MESSAGE_STYLE]];
  }

  abstract formatEntity(): [string, any[]];
}

export class LogDiff<T> extends LogEntity {
  constructor(private lhs: T, private rhs: T) {
    super();
  }

  formatEntity(): [string, any[]] {
    const isObjectDiff = typeof this.lhs === 'object' || typeof this.rhs === 'object';

    return isObjectDiff
      ? [
          `\n\t%cprev: %c${getToken(this.lhs)}\n\t%cnext: %c${getToken(this.rhs)}`,
          [LOG_FAILURE_STYLE, LOG_MESSAGE_STYLE, this.lhs, LOG_SUCCESS_STYLE, LOG_MESSAGE_STYLE, this.rhs],
        ]
      : [
          `%c(%cprev: %c${getToken(this.lhs)} %c→ %cnext: %c${getToken(this.rhs)}%c)`,
          [
            LOG_SUBTLE_PATH_STYLE,
            LOG_FAILURE_STYLE,
            LOG_MESSAGE_STYLE,
            this.lhs,
            LOG_SUBTLE_PATH_STYLE,
            LOG_SUCCESS_STYLE,
            LOG_MESSAGE_STYLE,
            this.rhs,
            LOG_SUBTLE_PATH_STYLE,
          ],
        ];
  }
}

export class LogValue<T> extends LogEntity {
  constructor(private value: T) {
    super();
  }

  formatEntity(): [string, any[]] {
    return [`%c${getToken(this.value)}`, [LOG_CURRENT_STYLE, this.value]];
  }
}

export class LogBold<T> extends LogEntity {
  constructor(private value: T) {
    super();
  }

  formatEntity(): [string, any[]] {
    return [`%c${getToken(this.value)}`, [LOG_BOLD_STYLE, this.value]];
  }
}

abstract class LogStatus<T> extends LogEntity {
  constructor(private icon: string, private style: string, protected value: T) {
    super();
  }

  formatEntity(): [string, any[]] {
    return [`%c${this.icon} ${getToken(this.value)}`, [this.style, this.value]];
  }
}

export class LogSuccess<T> extends LogStatus<T> {
  constructor(value: T) {
    super('✅', LOG_SUCCESS_STYLE, value);
  }
}

export class LogFailure<T> extends LogStatus<T> {
  constructor(value: T) {
    super('⛔️', LOG_FAILURE_STYLE, value);
  }
}

export class LogPending<T> extends LogStatus<T> {
  constructor(value: T) {
    super('⏳', LOG_PENDING_STYLE, value);
  }
}

export class LogInitialize<T> extends LogStatus<T> {
  constructor(value: T) {
    super('⚙️', LOG_CONFIGURING_STYLE, value);
  }
}

export class LogReset<T> extends LogStatus<T> {
  constructor(value: T) {
    super('✨', LOG_RESET_STYLE, value);
  }
}

const formatPath = (path: string[]): [string, any[]] => {
  if (path.length === 1) {
    return [`%c${path[0]}`, [LOG_BOLD_PATH_STYLE]];
  }

  const [restFormatted, restArgs] = formatPath(path.slice(1));

  return [`%c${path[0][0]}.${restFormatted}`, [LOG_SUBTLE_PATH_STYLE, ...restArgs]];
};

const inlineArgs = (message: string, args: any[]) => {
  const remainingArgs = [...args];
  const injectedArgs = [];
  let formattedMessage = message;

  while (remainingArgs[0] instanceof LogEntity) {
    const entity = remainingArgs.shift() as LogEntity;
    const [entityMessage, entityArgs] = entity.format();

    formattedMessage += ` ${entityMessage}`;
    injectedArgs.push(...entityArgs);
  }

  return [formattedMessage, [...injectedArgs, ...remainingArgs]];
};

const customizeLogger = (logger: loglevel.Logger, path: string[]) => {
  const logFactory = logger.methodFactory;
  const loggerName = path.join(SEPARATOR);

  // eslint-disable-next-line no-param-reassign
  logger.methodFactory = (method, level, name) => {
    const logMethod = logFactory(method, level, name);

    return (...args) => {
      if (LOG_BLACKLIST.length && LOG_BLACKLIST.some((regex) => loggerName.match(regex))) {
        return;
      }

      if (LOG_WHITELIST.length && !LOG_WHITELIST.some((regex) => loggerName.match(regex))) {
        return;
      }

      const [namespace, injectedArgs] = formatPath(path);

      let prefix = `${namespace} %c:`;
      injectedArgs.push(LOG_SUBTLE_PATH_STYLE);

      prefix = `%c${method.toUpperCase()} ${prefix}`;
      injectedArgs.unshift(`font-weight: bold; ${METHOD_STYLES[method] || ''}`);

      if (!args.length) {
        logMethod(prefix, ...injectedArgs);

        return;
      }

      if (typeof args[0] === 'string') {
        const [message, messageArgs] = inlineArgs(args[0], args.slice(1));

        logMethod(`${prefix} %c${message}`, ...injectedArgs, LOG_MESSAGE_STYLE, ...messageArgs);

        return;
      }

      const [message, messageArgs] = inlineArgs(prefix, args);

      logMethod(message, ...injectedArgs, ...messageArgs);
    };
  };

  // NOTE: calling setLevel() is required "apply" factory change
  logger.setLevel(LOG_LEVEL, false);
};

export const createLogger = (path: string[]) => {
  const loggerName = path.join(SEPARATOR);
  const logger = loglevel.getLogger(loggerName);

  customizeLogger(logger, path);

  const createUniqueChildLogger = (childName: string, id?: string) => createLogger([...path, id ? `${childName}<${id}>` : childName]);
  const createChildLogger = moize(createUniqueChildLogger);

  return Object.assign(logger, {
    child(childName: string, id?: string) {
      if (id) {
        return createUniqueChildLogger(childName, id);
      }

      return createChildLogger(childName);
    },
    diff: <T>(lhs: T, rhs: T) => new LogDiff(lhs, rhs),
    value: <T>(value: T) => new LogValue(value),
    bold: <T>(value: T) => new LogBold(value),
    slug: (value: string) => new LogValue(value.slice(-6)),
    success: <T>(value: T) => new LogSuccess(value),
    failure: <T>(value: T) => new LogFailure(value),
    pending: <T>(value: T) => new LogPending(value),
    init: <T>(value: T) => new LogInitialize(value),
    reset: <T>(value: T) => new LogReset(value),
  });
};

// remove persisted logs from localStorage and cookies
export const clearPersistedLogs = () => {
  const lsKeys = Object.keys(localStorage || {});

  if (lsKeys.some((key) => key.startsWith(LOG_LEVEL_PREFIX))) {
    lsKeys.forEach((key) => {
      if (key.startsWith(LOG_LEVEL_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  const cookies = getAllCookies();

  Object.keys(cookies).forEach((key) => {
    if (key.startsWith(LOG_LEVEL_PREFIX)) {
      removeCookie(key);
    }
  });
};

export const logger = createLogger([BASE_LOGGER_NAME]);

export type Logger = ReturnType<typeof createLogger>;
