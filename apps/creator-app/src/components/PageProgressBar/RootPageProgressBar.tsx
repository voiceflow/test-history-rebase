import { useForceUpdate, useRAF, useTeardown, useToggle } from '@voiceflow/ui';
import React from 'react';

import PageProgressBar from './PageProgressBar';
import { PageProgress, PageProgressOptions } from './utils';

export { PageProgress };

// milliseconds
export const FORCE_STOP_TIMEOUT = 10000;
export const MAX_LOADING_TIME = 5000;
export const PROGRESS_INTERVAL = 0;

// percentage
export const PROGRESS_STEP = 95;

const DEFAULT_OPTIONS: PageProgressOptions = {
  timeout: FORCE_STOP_TIMEOUT,
  step: PROGRESS_STEP,
  stepInterval: PROGRESS_INTERVAL,
  maxDuration: MAX_LOADING_TIME,
};

const RootPageProgressBar: React.FC = () => {
  const [progress, setProgress] = React.useState<number>(-1);
  const [isStarted, toggleStarted] = useToggle(false);
  const [forceUpdate, forceUpdateKey] = useForceUpdate();
  const activeTypeRef = React.useRef<string>('');
  const timeoutRef = React.useRef<number>(0);
  const intervalRef = React.useRef<number>(0);
  const [options, setOptions] = React.useState<PageProgressOptions>(DEFAULT_OPTIONS);
  const duration = options.maxDuration / 1000;

  const [scheduler] = useRAF();

  PageProgress.start = (type: string, startOptions?: Partial<PageProgressOptions>) => {
    activeTypeRef.current = type;
    const newOptions = { ...options, ...startOptions };

    clearTimeout(timeoutRef.current);

    setOptions(newOptions);
    setProgress(0);
    toggleStarted(true);

    scheduler(() => forceUpdate());

    timeoutRef.current = window.setTimeout(() => PageProgress.stop(type), newOptions.timeout);
  };

  PageProgress.stop = (type: string) => {
    if (activeTypeRef.current !== type) return;

    setProgress(100);
    toggleStarted(false);

    scheduler(() => forceUpdate());
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  };

  React.useEffect(() => {
    if (isStarted) {
      setProgress(options.step);

      // validation to keep same behavior for old code. Default will not run interval
      if (!options.stepInterval) return;

      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          let newValue = prev + options.step;

          if (newValue > 100) newValue = 100;

          return newValue;
        });
      }, options.stepInterval);
    } else {
      setProgress(-1);
      clearInterval(intervalRef.current);
      setOptions(DEFAULT_OPTIONS);
    }
  }, [forceUpdateKey]);

  useTeardown(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  });

  return <PageProgressBar key={forceUpdateKey} easing="cubic-bezier(0.16, 1, 0.3, 1)" progress={progress} duration={duration} />;
};

export default RootPageProgressBar;
