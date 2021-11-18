import { Utils } from '@voiceflow/common';
import { useToggle } from '@voiceflow/ui';
import React from 'react';

import { useForceUpdate, useRAF, useTeardown } from '@/hooks';

import PageProgressBar from './PageProgressBar';

interface RootPageProgressBarApi {
  stop: (type: string) => void;
  start: (type: string) => void;
}

type RootPageProgressBarType = React.FC & RootPageProgressBarApi;

const globalAPI: RootPageProgressBarApi = {
  stop: Utils.functional.noop,
  start: Utils.functional.noop,
};

const FORCE_STOP_TIMEOUT = 10000;
const MAX_LOADING_TIME_SECONDS = 5;

const RootPageProgressBar: React.FC = () => {
  const [progress, setProgress] = React.useState<number>(-1);
  const [isStarted, toggleStarted] = useToggle(false);
  const [forceUpdate, forceUpdateKey] = useForceUpdate();
  const activeTypeRef = React.useRef<string>('');
  const timeoutRef = React.useRef<number>(0);

  const [scheduler] = useRAF();

  RootPageProgressBarWithAPI.start = (type: string) => {
    activeTypeRef.current = type;

    clearTimeout(timeoutRef.current);

    setProgress(0);
    toggleStarted(true);

    scheduler(() => forceUpdate());

    timeoutRef.current = setTimeout(() => globalAPI.stop(type), FORCE_STOP_TIMEOUT) as any;
  };

  RootPageProgressBarWithAPI.stop = (type: string) => {
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

const RootPageProgressBarWithAPI: RootPageProgressBarType = Object.assign(RootPageProgressBar, globalAPI);

export default RootPageProgressBarWithAPI;
