import moment from 'moment';
import React from 'react';

import { TestStatus, testingStatusSelector, testingTimeSelector } from '@/ducks/testingV2';
import { connect } from '@/hocs';

import { Timer } from './styled';

const getDuration = (startTime: number): string =>
  moment
    .unix(0)
    .add(startTime ? Date.now() - startTime : 0, 'ms')
    .format('mm:ss');

type TestTimerProps = {
  status: TestStatus;
  startTime: number;
};

const INITIAL_TIME = '00:00';

const TestTimer: React.FC<TestTimerProps> = ({ status, startTime }) => {
  const [duration, setDuration] = React.useState(INITIAL_TIME);

  React.useEffect(() => {
    let interval = -1;
    if (status === TestStatus.ACTIVE) {
      interval = setInterval(() => setDuration(getDuration(startTime)), 1000);
    }
    if (status === TestStatus.IDLE) {
      setDuration(INITIAL_TIME);
    }
    return () => clearInterval(interval);
  }, [status]);

  return <Timer>{duration}</Timer>;
};

const mapStateToProps = {
  status: testingStatusSelector,
  startTime: testingTimeSelector,
};

export default connect(mapStateToProps)(TestTimer);
