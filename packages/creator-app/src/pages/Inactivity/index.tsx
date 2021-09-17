import { Button, ButtonVariant, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import Countdown from 'react-countdown-now';

import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/LegacyModal';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { Callback, ConnectedProps } from '@/types';

import { BodyContainer } from './components/BodyContainer';

const TIMER_COUNT = 5 * 60 * 1000;

const countdownRenderer = ({ minutes, seconds }: { minutes: number; seconds: number }) => (
  <span>
    {` ${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}.
  </span>
);

const ModalComponent: React.FC<any> = Modal;

export interface InactivityModalProps {
  open: boolean;
  onActive: Callback;
}

const InactivityModal: React.FC<InactivityModalProps & ConnectedInactivityModalProps> = ({ open, onActive, goToDashboard }) => (
  <ModalComponent isOpen={open} toggle={onActive}>
    <ModalHeader toggle={onActive} header="INACTIVITY" />
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
  </ModalComponent>
);

const mapDispatchToProps = {
  goToDashboard: Router.goToDashboard,
};

type ConnectedInactivityModalProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(InactivityModal) as React.FC<InactivityModalProps>;
