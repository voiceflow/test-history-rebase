import { Box } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';

import Collaborators from '.';
import InviteByLink from './components/InviteByLink';

const intoTooltip = (
  <div>
    <p>Teams on Voiceflow consist of Editors (can edit), Viewers (can view), Billing (can manage payments), and Admins (all permissions)</p>

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

    <h5>Billing</h5>
    <p>
      Billing managers can manage payments and billing for the workspace, but have view-only permissions on projects. You will not be charged for any
      Billing users.
    </p>
  </div>
);

const CollaboratorsModal: React.FC = () => (
  <Modal id={ModalType.COLLABORATORS} title="ADD COLLABORATORS" intoTooltip={intoTooltip} maxWidth={545}>
    <Box width="100%">
      <Collaborators />

      <ModalFooter>
        <InviteByLink />
      </ModalFooter>
    </Box>
  </Modal>
);

export default CollaboratorsModal;
