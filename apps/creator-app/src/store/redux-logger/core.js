import { datadogRum } from '@datadog/browser-rum';

import diffLogger from './diff';

function printBuffer(buffer, options) {
  const { logger, collapsed } = options;

  buffer.forEach((logEntry, key) => {
    const { action, prevState, error } = logEntry;
    let { nextState } = logEntry;
    const nextEntry = buffer[key + 1];

    if (nextEntry) {
      nextState = nextEntry.prevState;
    }
    // Message
    const isCollapsed = typeof collapsed === 'function' ? collapsed(() => nextState, action, logEntry) : collapsed;

    let diffArr = [];
    diffArr = diffLogger(prevState, nextState, logger, isCollapsed);

    datadogRum.addAction(action.type, {
      prevState,
      nextState,
      diffArr,
      error,
    });
    // console.log({ prevState, action, nextState, diffArr, error });
  });
}

export default printBuffer;
