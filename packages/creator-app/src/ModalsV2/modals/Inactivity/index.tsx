import { Button, ButtonVariant, Modal, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import Countdown from 'react-countdown';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import manager from '../../manager';
import * as S from './styles';

const TIMER_COUNT = 5 * 60 * 1000;

const countdownRenderer = ({ minutes, seconds }: { minutes: number; seconds: number }) => (
  <span>
    {` ${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}.
  </span>
);

export interface InactivityModalProps {
  onActive: VoidFunction;
}

const Inactivity = manager.create<InactivityModalProps>('Inactivity', () => ({ api, type, opened, hidden, animated, onActive }) => {
  const goToDashboard = useDispatch(Router.goToDashboard);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>INACTIVITY</Modal.Header>
      <Modal.Body>
        <S.BodyContainer>
          <SvgIcon size={100} icon="globe" />
          <div>
            Your session is about to expire due to inactivity. You will be returned to the dashboard in
            <Countdown onComplete={goToDashboard} date={Date.now() + TIMER_COUNT} renderer={countdownRenderer} />
          </div>
        </S.BodyContainer>
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.TERTIARY} onClick={onActive}>
          Dismiss
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default Inactivity;
