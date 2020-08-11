import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

import { Callback, Eventual } from '@/types';
import { noop } from '@/utils/functional';

import { useTeardown } from './lifecycle';

/**
 * ex. "8pm" or "8:30pm"
 */
const SCHEDULE_FORMAT = ['ha', 'h:ma'];

const getNextScheduledTimeout = (schedule: string[]) => {
  const now = moment();
  const todayTimes = schedule.map((time) => moment(time, SCHEDULE_FORMAT));
  const tomorrowTimes = todayTimes.map((date) => moment(date).add(1, 'day'));
  const validTimes = [...todayTimes, ...tomorrowTimes].filter((date) => date.isAfter(now));

  return moment.min(validTimes).valueOf() - now.valueOf();
};

export const useAsyncMountUnmount = (didMount: () => void, willUnmount: () => void) => {
  useEffect(() => {
    didMount();

    if (willUnmount) {
      return willUnmount;
    }

    return undefined;
  }, []);
};

export const useOneTimeEffect = (effect: () => boolean, dependencies: any[] = []) => {
  const wasTriggered = useRef(false);

  useEffect(() => {
    if (!wasTriggered.current) {
      wasTriggered.current = effect();
    }
  }, dependencies);
};

// eslint-disable-next-line import/prefer-default-export
export const useRegistration = (register: () => () => void, dependencies: any[] = []) => {
  const teardownRef = useRef(noop);

  useEffect(() => {
    teardownRef.current = register();
  }, dependencies);

  useTeardown(() => teardownRef.current());
};

export const useInterval = (callback: Callback, timeout: number, dependencies: any[] = []) =>
  useEffect(() => {
    const interval = setInterval(callback, timeout);

    return () => clearInterval(interval);
  }, dependencies);

export const useTimeout = (callback: Callback, timeout: number, dependencies: any[] = []) =>
  useEffect(() => {
    const timer = setTimeout(callback, timeout);

    return () => clearTimeout(timer);
  }, dependencies);

export const useScheduled = (schedule: string[], effect: () => Eventual<void>, dependencies: any[] = []) => {
  const [timeout, updateTimeout] = useState(() => getNextScheduledTimeout(schedule));

  useTimeout(
    async () => {
      updateTimeout(getNextScheduledTimeout(schedule));
      await effect();
    },
    timeout,
    [schedule, timeout, ...dependencies]
  );
};
