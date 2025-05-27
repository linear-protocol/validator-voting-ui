import dayjs from 'dayjs';
import Loglevel from 'loglevel';
import LoglevelPrefix from 'loglevel-plugin-prefix';

import type { LogLevelNames } from 'loglevel';

export const LoggerTags = {
  Wallet: '[Wallet]',
  Api: '[Api]',
};

const LevelColors: Record<LogLevelNames, string> = {
  trace: 'color: purple',
  debug: 'color: blue',
  info: 'color: green',
  warn: 'color: orange',
  error: 'color: red',
};

export default class Logger {
  public static Tags = LoggerTags;
  public static initialized = false;

  public static initialize(isProduction: boolean) {
    LoglevelPrefix.reg(Loglevel);
    Loglevel.enableAll();

    LoglevelPrefix.apply(Loglevel, {
      format(_level, _name, time) {
        return `%c[${time}]`;
      },
      levelFormatter(level) {
        return level.toUpperCase();
      },
      timestampFormatter(date) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
      },
    });

    const originalFactory = Loglevel.methodFactory;
    if (!this.initialized) {
      Loglevel.methodFactory = (logLevelName, logLevel, loggerName) => {
        const rawMethod = originalFactory(logLevelName, logLevel, loggerName);
        const color = LevelColors[logLevelName] || 'color: black';
        const level = logLevelName.toUpperCase();
        const prefix = `%c(${level})`;
        return rawMethod.bind(Loglevel, prefix, color, color);
      };
    }
    Loglevel.rebuild();

    const level = isProduction ? 'ERROR' : 'DEBUG';
    Loglevel.setDefaultLevel(level);
    Loglevel.setLevel(level);

    if (isProduction) {
      Loglevel.disableAll();
    }

    this.getLogger().info('Logger initialized:', level);
    this.initialized = true;
  }

  public static getLogger() {
    return Loglevel;
  }
}
