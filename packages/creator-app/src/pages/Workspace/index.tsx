import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'recompose';

import { conversationGraphic } from '@/assets';
import Button from '@/components/LegacyButton';
import { LegacyPath, Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as WorkspaceDuck from '@/ducks/workspace';
import { CheckInvitationGate, WorkspacesLoadingGate } from '@/gates';
import { connect, lazy, withBatchLoadingGate } from '@/hocs';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';
import { ConnectedProps } from '@/types';

const Settings = lazy(() => import('@/pages/Workspace/Settings'));
const NewProject = lazy(() => import('@/pages/NewProject'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const Workspace: React.FC<ConnectedWorkspaceProps> = ({ personalWorkspaceIDs, goToNewWorkspace }) => {
  if (!personalWorkspaceIDs.length) {
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
          <Button id="createWorkspace" isPrimary className="mt-4" onClick={goToNewWorkspace}>
            New Workspace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route exact path={[Path.NEW_INTRO_PROJECT, Path.NEW_PROJECT]} component={NewProject} />

      <RedirectWithSearch exact from={Path.WORKSPACE} to={Path.DASHBOARD} />
      <RedirectWithSearch exact from={LegacyPath.WORKSPACE_API_KEYS} to={Path.WORKSPACE_DEVELOPER_SETTINGS} />

      <Route path={Path.WORKSPACE_SETTINGS} component={Settings} />
      <Route exact path={[Path.WORKSPACE_DASHBOARD, Path.DASHBOARD]} component={Dashboard} />

      <RedirectWithSearch to={Path.DASHBOARD} />
    </Switch>
  );
};

const mapStateToProps = {
  personalWorkspaceIDs: WorkspaceDuck.personalWorkspaceIDsSelector,
};

const mapDispatchToProps = {
  goToNewWorkspace: Router.goToNewWorkspace,
};

type ConnectedWorkspaceProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  withBatchLoadingGate(CheckInvitationGate, WorkspacesLoadingGate),
  connect(mapStateToProps, mapDispatchToProps)
)(Workspace as any);
