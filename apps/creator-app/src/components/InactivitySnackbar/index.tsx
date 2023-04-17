import { System } from '@voiceflow/ui';
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

export interface InactivitySnackbarProps {
  onDismiss: VoidFunction;
}

const InactivitySnackbar: React.FC<InactivitySnackbarProps> = ({ onDismiss }) => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <System.Snackbar.WithOverlay>
      <System.Snackbar.Icon icon="warning" />

      <System.Snackbar.Text>
        Session will expire due to inactivity in:{' '}
        <Countdown onComplete={goToDashboard} date={Date.now() + TIMER_COUNT} renderer={countdownRenderer} />
      </System.Snackbar.Text>

      <System.Snackbar.Button onClick={onDismiss}>Dismiss</System.Snackbar.Button>
    </System.Snackbar.WithOverlay>
  );
};

export default InactivitySnackbar;
