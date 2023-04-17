import { Box, Modal } from '@voiceflow/ui';
import React from 'react';

import CollaboratorsPage from '@/pages/Collaborators';
import InviteByLink from '@/pages/Collaborators/components/InviteByLink';

import manager from '../manager';

const infoTooltip = (
  <div>
    <p>Teams on Voiceflow consist of Editors (can edit), Viewers (can view), Billing (can manage payments), and Admins (all permissions)</p>
    <h5>Editors</h5>
    <p>Editors can make changes to the contents of your assistant. They can edit from the canvas in real-time with other editors.</p>
    <h5>Viewer</h5>
    <p>
      Viewers can view the canvas, simulate the assistant in the test tool and leave comments. Viewers can <b>not</b> edit the content of your
      assistant.
    </p>
    <h5>Admins</h5>
    <p>
      Admins can manage payments and billing for the workspace, invite collaborators, and pay for additional seats. Additionally, they have all the
      permissions of an Editor.
    </p>
    <h5>Billing</h5>
    <p>
      Billing managers can manage payments and billing for the workspace, but have view-only permissions on assistants. You will not be charged for
      any Billing users.
    </p>
  </div>
);

const Collaborators = manager.create('Collaborators', () => ({ api, type, opened, hidden, animated }) => (
  <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={545} className="vf-modal--collaborators">
    <Modal.Header infoTooltip={infoTooltip}>ADD COLLABORATORS</Modal.Header>
    <Box width="100%">
      <CollaboratorsPage />
      <Modal.Footer>
        <InviteByLink />
      </Modal.Footer>
    </Box>
  </Modal>
));

export default Collaborators;
