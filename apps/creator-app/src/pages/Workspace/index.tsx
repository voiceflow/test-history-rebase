import { Box, Button, ButtonVariant, Label, Text } from '@voiceflow/ui';
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
      <Box.FlexCenter height="100%">
        <Box textAlign="center">
          <img src={conversationGraphic} alt="skill-icon" width="160" height="105" className="mb-1" />
          <br />
          <Label color="#132144">Create a Workspace</Label>

          <Text color="#62778c">
            Create a shared workspace where your
            <br />
            team can collaboratively design and build
            <br />
            incredible voice experiences
          </Text>
          <br />

          <Box.FlexCenter mt={24}>
            <Button id="createWorkspace" variant={ButtonVariant.PRIMARY} onClick={() => createWorkspaceModal.openVoid()}>
              New Workspace
            </Button>
          </Box.FlexCenter>
        </Box>
      </Box.FlexCenter>
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
