import { Modal, Switch } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as Organization from '@/ducks/organization';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';

import manager from '../../../manager';
import { Screen } from './constants';
import { WorkspaceName, WorkspaceOrganization } from './screens';

const Create = manager.create('WorkspaceCreate', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const organizations = useSelector(Organization.organizationsWhereIsAdminSelector);
  const activeOrganizationID = useSelector(WorkspaceV2.active.organizationIDSelector);

  const [screen, setScreen] = React.useState<Screen>(organizations.length > 1 ? Screen.WORKSPACE_ORGANIZATION : Screen.WORKSPACE_NAME);

  const [workspaceName, setWorkspaceName] = React.useState('');
  const [workspaceImage, setWorkspaceImage] = React.useState<string | null>(null);
  const [organizationID, setOrganizationID] = React.useState<string | null>(activeOrganizationID ?? organizations[0]?.id);

  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToWorkspace = useDispatch(Router.goToWorkspace);
  const createWorkspace = useDispatch(WorkspaceV2.createWorkspace);
  const setActiveWorkspace = useDispatch(WorkspaceV2.setActive);

  const onCreateWorkspace = async () => {
    try {
      api.preventClose();

      const workspace = await createWorkspace({
        name: workspaceName,
        image: workspaceImage ?? undefined,
        organizationID: organizationID ?? undefined,
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
            value={organizationID}
            onNext={() => setScreen(Screen.WORKSPACE_NAME)}
            onClose={api.close}
            onSelect={setOrganizationID}
            organizations={organizations}
          />
        </Switch.Pane>

        <Switch.Pane value={Screen.WORKSPACE_NAME}>
          <WorkspaceName
            onClose={api.close}
            creating={closePrevented}
            onChangeName={setWorkspaceName}
            onChangeImage={setWorkspaceImage}
            workspaceName={workspaceName}
            workspaceImage={workspaceImage}
            onCreateWorkspace={onCreateWorkspace}
          />
        </Switch.Pane>
      </Switch>
    </Modal>
  );
});

export default Create;
