import { Button, ButtonVariant, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import Countdown from 'react-countdown';

import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch, useModals, useTeardown } from '@/hooks';

import { BodyContainer } from './components/BodyContainer';

const TIMER_COUNT = 5 * 60 * 1000;

const countdownRenderer = ({ minutes, seconds }: { minutes: number; seconds: number }) => (
  <span>
    {` ${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}.
  </span>
);

export interface InactivityModalProps {
  onActive: VoidFunction;
}

const InactivityModal: React.FC<InactivityModalProps> = ({ onActive }) => {
  const inactivityModal = useModals(ModalType.INACTIVITY);

  const goToDashboard = useDispatch(Router.goToDashboard);

  useTeardown(() => inactivityModal.close());

  return (
    <Modal id={ModalType.INACTIVITY} title="INACTIVITY">
      <ModalBody>
        <BodyContainer>
          <SvgIcon size={100} icon="globe" />
          <div>
            Your session is about to expire due to inactivity. You will be returned to the dashboard in
            <Countdown onComplete={goToDashboard} date={Date.now() + TIMER_COUNT} renderer={countdownRenderer} />
          </div>
        </BodyContainer>
      </ModalBody>

      <ModalFooter>
        <Button variant={ButtonVariant.TERTIARY} onClick={onActive}>
          Dismiss
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InactivityModal;
