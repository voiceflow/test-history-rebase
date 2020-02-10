import React from 'react';
import Countdown from 'react-countdown-now';

import Button from '@/components/LegacyButton';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/components/LegacyModal';
import SvgIcon from '@/components/SvgIcon';
import { goToDashboard } from '@/ducks/router';
import { connect } from '@/hocs';

import { BodyContainer } from './components/BodyContainer';

const TIMER_COUNT = 5 * 60 * 1000;

const countdownRenderer = ({ minutes, seconds }) => {
  return (
    <span>
      {` ${minutes}`}:{seconds > 9 ? seconds : `0${seconds}`}.
    </span>
  );
};

function InactivityModal({ open, onActive, goToDashboard }) {
  return (
    <Modal isOpen={open} toggle={onActive}>
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
        <Button className="btn-tertiary tertiary" onClick={onActive}>
          Dismiss
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const mapDispatchToProps = {
  goToDashboard,
};

export default connect(
  null,
  mapDispatchToProps
)(InactivityModal);
