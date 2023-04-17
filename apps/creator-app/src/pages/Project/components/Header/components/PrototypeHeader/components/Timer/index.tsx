import dayjs from 'dayjs';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { useSelector } from '@/hooks';

import { Text } from './components';

const getDuration = (startTime: number): string =>
  dayjs
    .unix(0)
    .add(startTime ? Date.now() - startTime : 0, 'ms')
    .format('mm:ss');

const INITIAL_TIME = '00:00';

const Timer: React.FC = () => {
  const status = useSelector(Prototype.prototypeStatusSelector);
  const startTime = useSelector(Prototype.prototypeTimeSelector);

  const [duration, setDuration] = React.useState(INITIAL_TIME);

  React.useEffect(() => {
    let timeout: NodeJS.Timer | null = null;

    const runTimeout = () => {
      setDuration(getDuration(startTime));

      timeout = setTimeout(runTimeout, 1000);
    };

    if (status === PrototypeStatus.ACTIVE) {
      timeout = setTimeout(runTimeout, 1000);
    }

    if (status === PrototypeStatus.IDLE) {
      setDuration(INITIAL_TIME);
    }

    return () => {
      clearTimeout(timeout!);
    };
  }, [status]);

  return <Text>{duration}</Text>;
};

export default Timer;
