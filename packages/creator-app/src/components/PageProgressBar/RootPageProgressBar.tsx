import { useForceUpdate, useRAF, useTeardown, useToggle } from '@voiceflow/ui';
import React from 'react';

import PageProgressBar from './PageProgressBar';
import { PageProgress } from './utils';

export { PageProgress };

const FORCE_STOP_TIMEOUT = 10000;
const MAX_LOADING_TIME_SECONDS = 5;

const RootPageProgressBar: React.FC = () => {
  const [progress, setProgress] = React.useState<number>(-1);
  const [isStarted, toggleStarted] = useToggle(false);
  const [forceUpdate, forceUpdateKey] = useForceUpdate();
  const activeTypeRef = React.useRef<string>('');
  const timeoutRef = React.useRef<number>(0);

  const [scheduler] = useRAF();

  PageProgress.start = (type: string, timeout: number = FORCE_STOP_TIMEOUT) => {
    activeTypeRef.current = type;

    clearTimeout(timeoutRef.current);

    setProgress(0);
    toggleStarted(true);

    scheduler(() => forceUpdate());

    timeoutRef.current = window.setTimeout(() => PageProgress.stop(type), timeout);
  };

  PageProgress.stop = (type: string) => {
    if (activeTypeRef.current !== type) return;

    setProgress(100);
    toggleStarted(false);

    scheduler(() => forceUpdate());
    clearTimeout(timeoutRef.current);
  };

  React.useEffect(() => {
    if (isStarted) {
      setProgress(95); // setting to the 0.95 to make sure the progress bar is visible even if the loading take more than 5 seconds
    } else {
      setProgress(-1);
    }
  }, [forceUpdateKey]);

  useTeardown(() => {
    clearTimeout(timeoutRef.current);
  });

  return <PageProgressBar key={forceUpdateKey} easing="cubic-bezier(0.16, 1, 0.3, 1)" progress={progress} duration={MAX_LOADING_TIME_SECONDS} />;
};

export default RootPageProgressBar;
