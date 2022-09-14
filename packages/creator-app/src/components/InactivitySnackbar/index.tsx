import { Snackbar, SnackbarTypes } from '@voiceflow/ui';
import React from 'react';
import Countdown from 'react-countdown';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

const TIMER_COUNT = 5 * 60 * 1000;

const countdownRenderer = ({ minutes, seconds }: { minutes: number; seconds: number }) => (
  <span>
    {` ${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}
  </span>
);

export interface InactivitySnackbarProps extends SnackbarTypes.InstanceProps {
  onDismiss: VoidFunction;
}

const InactivitySnackbar: React.FC<InactivitySnackbarProps> = ({ onDismiss, ...props }) => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <Snackbar {...props} showOverlay>
      <Snackbar.Icon icon="warning" />
      <Snackbar.Text>
        Session will expire due to inactivity in:{' '}
        <Countdown onComplete={goToDashboard} date={Date.now() + TIMER_COUNT} renderer={countdownRenderer} />
      </Snackbar.Text>
      <Snackbar.DarkButton onClick={onDismiss}>Dismiss</Snackbar.DarkButton>
    </Snackbar>
  );
};

export default InactivitySnackbar;
