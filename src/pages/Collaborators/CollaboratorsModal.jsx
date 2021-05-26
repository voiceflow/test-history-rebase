import React from 'react';

import Modal, { ModalFooter, ModalHeader } from '@/components/LegacyModal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import Collaborators from '.';
import BodyContainer from './components/BodyContainer';
import InviteByLink from './components/InviteByLink';

const MODAL_TITLE = 'ADD COLLABORATORS';

const TooltipMessage = (
  <div>
    <p>Teams on Voiceflow consist of Editors (can edit), Viewers (can view) and Admins (all permissions)</p>
    <h5>Editors</h5>
    <p>Editors can make changes to the contents of your project. They can edit from the canvas in real-time with other editors.</p>
    <h5>Viewer</h5>
    <p>
      Viewers can view the canvas, simulate the project in the test tool and leave comments. Viewers can <b>not</b> edit the content of your project.
    </p>
    <h5>Admins</h5>
    <p>
      Admins can manage payments and billing for the workspace, invite collaborators, and pay for additional seats. Additionally, they have all the
      permissions of an Editor.
    </p>
  </div>
);

function CollaboratorsModal() {
  const { isOpened, toggle } = useModals(ModalType.COLLABORATORS);

  return (
    <Modal modalname="collaborators" isOpen={isOpened} toggle={toggle}>
      <ModalHeader toggle={() => toggle()} header={MODAL_TITLE} tooltip={TooltipMessage} />

      <BodyContainer>
        <Collaborators />
      </BodyContainer>

      <ModalFooter justifyContent="flex-start">
        <InviteByLink />
      </ModalFooter>
    </Modal>
  );
}

export default CollaboratorsModal;
