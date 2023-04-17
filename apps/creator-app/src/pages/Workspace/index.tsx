import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { conversationGraphic } from '@/assets';
import { LegacyPath, Path } from '@/config/routes';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { CheckInvitationGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useSelector } from '@/hooks';
import * as Modals from '@/ModalsV2';
import Dashboard from '@/pages/DashboardV2';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const Workspace: React.FC = () => {
  const workspaceIDs = useSelector(WorkspaceV2.allWorkspaceIDsSelector);

  const createWorkspaceModal = Modals.useModal(Modals.Workspace.Create);

  if (!workspaceIDs.length) {
    return (
      <div className="h-100 d-flex justify-content-center">
        <div className="align-self-center text-center">
          <img src={conversationGraphic} alt="skill-icon" width="160" height="105" className="mb-1" />
          <br />
          <label className="dark">Create a Workspace</label>

          <span className="text-muted">
            Create a shared workspace where your
            <br />
            team can collaboratively design and build
            <br />
            incredible voice experiences
          </span>
          <br />

          <Button id="createWorkspace" variant={ButtonVariant.PRIMARY} className="mt-4 margin-auto" onClick={() => createWorkspaceModal.openVoid()}>
            New Workspace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <RedirectWithSearch exact from={Path.WORKSPACE} to={Path.DASHBOARD} />
      <RedirectWithSearch exact from={LegacyPath.WORKSPACE_API_KEYS} to={Path.WORKSPACE_DEVELOPER_SETTINGS} />

      <Route path={[Path.WORKSPACE_DASHBOARD, Path.DASHBOARD]} component={Dashboard} />

      <RedirectWithSearch to={Path.DASHBOARD} />
    </Switch>
  );
};

export default withBatchLoadingGate(CheckInvitationGate)(Workspace);
