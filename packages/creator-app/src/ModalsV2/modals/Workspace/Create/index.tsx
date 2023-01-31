import * as Realtime from '@voiceflow/realtime-sdk';
import { Modal, Switch, toast } from '@voiceflow/ui';
import React from 'react';

import * as Organization from '@/ducks/organization';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { useDispatch, useSelector } from '@/hooks';

import manager from '../../../manager';
import { Screen } from './constants';
import { WorkspaceName, WorkspaceOrganization } from './screens';

const Create = manager.create('WorkspaceCreate', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const organizations = useSelector(Organization.organizationsWhereIsAdminSelector);

  const [screen, setScreen] = React.useState<Screen>(organizations.length > 1 ? Screen.WORKSPACE_ORGANIZATION : Screen.WORKSPACE_NAME);
  const [selectedOrganization, setSelectedOrganization] = React.useState<Realtime.Organization | null>(
    organizations.length === 1 ? organizations[0] : null
  );

  const [workspaceName, setWorkspaceName] = React.useState('');
  const [workspaceImage, setWorkspaceImage] = React.useState<string | null>(null);

  const createWorkspace = useDispatch(Workspace.createWorkspace);
  const setActiveWorkspace = useDispatch(Workspace.setActive);
  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToWorkspace = useDispatch(Router.goToWorkspace);

  const onCreateWorkspace = async () => {
    try {
      api.preventClose();

      const workspace = await createWorkspace({
        name: workspaceName,
        image: workspaceImage || undefined,
        organizationID: selectedOrganization?.id || undefined,
      });

      setActiveWorkspace(workspace.id);
      goToWorkspace(workspace.id);
      api.enableClose();
      api.close();
    } catch (e) {
      toast.error('Error creating workspace, please try again later');
      api.close();
      goToDashboard();
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Create Workspace</Modal.Header>
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
          <WorkspaceName
            workspaceName={workspaceName}
            workspaceImage={workspaceImage}
            onClose={api.close}
            onCreateWorkspace={onCreateWorkspace}
            onChangeImage={setWorkspaceImage}
            onChangeName={setWorkspaceName}
            creating={closePrevented}
          />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
});

export default Create;
