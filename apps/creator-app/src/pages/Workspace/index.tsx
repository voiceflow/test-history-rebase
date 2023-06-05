import { Box, Button, ButtonVariant, Text } from '@voiceflow/ui';
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
      <Box.FlexColumn margin="auto" gap={12}>
        <img src={conversationGraphic} alt="skill-icon" width="160" height="105" />

        <strong className="dark">Create a Workspace</strong>

        <Text color="#62778c" textAlign="center" marginBottom={12}>
          Create a shared workspace where your
          <br />
          team can collaboratively design and build
          <br />
          incredible voice experiences
        </Text>

        <Button id="createWorkspace" variant={ButtonVariant.PRIMARY} onClick={() => createWorkspaceModal.openVoid()}>
          New Workspace
        </Button>
      </Box.FlexColumn>
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
