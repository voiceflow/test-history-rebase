import * as Realtime from '@voiceflow/realtime-sdk';
import { Modal, Switch } from '@voiceflow/ui';
import React from 'react';

import * as Organization from '@/ducks/organization';
import { useSelector } from '@/hooks';

import manager from '../../../manager';
import { Screen } from './constants';
import { WorkspaceName, WorkspaceOrganization } from './screens';

const Create = manager.create('WorkspaceCreate', () => ({ api, type, opened, hidden, animated }) => {
  const organizations = useSelector(Organization.organizationsWhereIsAdminSelector);

  const [screen, setScreen] = React.useState<Screen>(organizations.length > 1 ? Screen.WORKSPACE_ORGANIZATION : Screen.WORKSPACE_NAME);
  const [selectedOrganization, setSelectedOrganization] = React.useState<Realtime.Organization | null>(
    organizations.length === 1 ? organizations[0] : null
  );

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header actions={<Modal.Header.CloseButton onClick={api.close} />}>Create Workspace</Modal.Header>
      <Switch active={screen}>
        <Switch.Pane value={Screen.WORKSPACE_ORGANIZATION}>
          <WorkspaceOrganization
            onNext={() => setScreen(Screen.WORKSPACE_NAME)}
            onClose={api.close}
            organizations={organizations}
            onSelect={setSelectedOrganization}
          />
        </Switch.Pane>
        <Switch.Pane value={Screen.WORKSPACE_NAME}>
          <WorkspaceName onClose={api.close} organization={selectedOrganization} />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
});

export default Create;
