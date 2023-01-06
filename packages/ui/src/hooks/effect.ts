import { Callback, Eventual, Utils } from '@voiceflow/common';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { useDidUpdateEffect, useTeardown } from './lifecycle';

/**
 * ex. "8pm" or "8:30pm"
 */
const SCHEDULE_FORMAT = ['ha', 'h:ma'];

const getNextScheduledTimeout = (schedule: string[]) => {
  const now = dayjs();
  const todayTimes = schedule.map((time) => dayjs(time, SCHEDULE_FORMAT));
  const tomorrowTimes = todayTimes.map((date) => dayjs(date).add(1, 'day'));
  const validTimes = [...todayTimes, ...tomorrowTimes].filter((date) => date.isAfter(now));
  const minDate = dayjs.min(...validTimes);

  return minDate ? minDate.valueOf() - now.valueOf() : 4 * 60 * 60 * 1000;
};

export const useAsyncEffect = (effect: () => Promise<void>, dependencies: unknown[] = []): void =>
  useEffect(() => {
    effect();
  }, dependencies);

export const useAsyncDidUpdate = (effect: () => Promise<void>, dependencies: unknown[] = []): void =>
  useDidUpdateEffect(() => {
    effect();
  }, dependencies);

export const useAsyncMountUnmount = (didMount?: () => void, willUnmount?: () => void): void => {
  useEffect(() => {
    didMount?.();

    if (willUnmount) {
      return willUnmount;
    }

    return undefined;
  }, []);
};

export const useOneTimeEffect = (effect: () => boolean, dependencies: unknown[] = []): void => {
  const wasTriggered = useRef(false);

  useEffect(() => {
    if (!wasTriggered.current) {
      wasTriggered.current = effect();
    }
  }, dependencies);
};

export const useRegistration = (register: () => () => void, dependencies: unknown[] = []): void => {
  const teardownRef = useRef(Utils.functional.noop);

  useEffect(() => {
    teardownRef.current = register();
  }, dependencies);

  useTeardown(() => teardownRef.current());
};

export const useInterval = (callback: Callback, timeout: number, dependencies: unknown[] = []): void =>
  useEffect(() => {
    const interval = setInterval(callback, timeout);

    return () => clearInterval(interval);
  }, dependencies);

export const useTimeout = (callback: Callback, timeout: number, dependencies: unknown[] = []): void =>
  useEffect(() => {
    const timer = setTimeout(callback, timeout);

    return () => clearTimeout(timer);
  }, dependencies);

export const useScheduled = (schedule: string[], effect: () => Eventual<void>, dependencies: unknown[] = []): void => {
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
