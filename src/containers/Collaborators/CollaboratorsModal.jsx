import React from 'react';

import Modal, { ModalFooter, ModalHeader } from '@/components/Modal';
import { MODALS } from '@/constants';
import { useModals } from '@/contexts/ModalsContext';

import BodyContainer from './components/BodyContainer';
import SeatSummary from './components/SeatSummary';
import Collaborators from '.';

const MODAL_TITLE = 'ADD COLLABORATORS';

const TooltipMessage = (
  <div>
    <p>Teams on Voiceflow consist of Editors (can edit) and Viewers (can view)</p>
    <h5>Editors</h5>
    <p>Editors can make changes to the contents of your project. They can edit from the canvas in real-time with other editors.</p>
    <h5>Viewer</h5>
    <p>
      Viewers can view the canvas, simulate the project in the test tool and leave comments. Viewers can <b>not</b> edit the content of your project.
    </p>
  </div>
);

function CollaboratorsModal() {
  const { isOpened, toggle } = useModals(MODALS.COLLABORATORS);

  return (
    <Modal modalname="collaborators" isOpen={isOpened} toggle={toggle}>
      <ModalHeader toggle={() => toggle()} header={MODAL_TITLE} tooltip={TooltipMessage} />

      <BodyContainer>
        <Collaborators />
      </BodyContainer>

      <ModalFooter justifyContent="flex-start">
        <SeatSummary />
      </ModalFooter>
    </Modal>
  );
}

export default CollaboratorsModal;
