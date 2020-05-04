import moment from 'moment';
import React from 'react';

import { PrototypeStatus, prototypeStatusSelector, prototypeTimeSelector } from '@/ducks/prototype';
import { connect } from '@/hocs';

import { Timer } from './styled';

const getDuration = (startTime: number): string =>
  moment
    .unix(0)
    .add(startTime ? Date.now() - startTime : 0, 'ms')
    .format('mm:ss');

type PrototypeTimerProps = {
  status: PrototypeStatus;
  startTime: number;
};

const INITIAL_TIME = '00:00';

const PrototypeTimer: React.FC<PrototypeTimerProps> = ({ status, startTime }) => {
  const [duration, setDuration] = React.useState(INITIAL_TIME);

  React.useEffect(() => {
    let interval = -1;
    if (status === PrototypeStatus.ACTIVE) {
      interval = setInterval(() => setDuration(getDuration(startTime)), 1000);
    }
    if (status === PrototypeStatus.IDLE) {
      setDuration(INITIAL_TIME);
    }
    return () => clearInterval(interval);
  }, [status]);

  return <Timer>{duration}</Timer>;
};

const mapStateToProps = {
  status: prototypeStatusSelector,
  startTime: prototypeTimeSelector,
};

export default connect(mapStateToProps)(PrototypeTimer);
