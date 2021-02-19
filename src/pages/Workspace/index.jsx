import React from 'react';
import { Switch } from 'react-router-dom';
import { compose } from 'recompose';

import Button from '@/components/LegacyButton';
import { Path } from '@/config/routes';
import { goTo } from '@/ducks/router';
import { allWorkspacesSelector } from '@/ducks/workspace';
import { WorkspacesLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import PrivateRoute from '@/Routes/PrivateRoute';
import { getActivePageAndMatch } from '@/utils/routes';

const APIKeys = React.lazy(() => import('@/pages/APIKeys'));
const NewProject = React.lazy(() => import('@/pages/NewProject'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));

const PAGES_MATCHES = {
  template: [Path.WORKSPACE_TEMPLATE, `${Path.WORKSPACE_TEMPLATE}/:workspaceID`],
  dashboard: [`${Path.WORKSPACE}/:workspaceID`, Path.DASHBOARD],
  apikeys: [`${Path.WORKSPACE}/:workspaceID/api-keys`],
  onboarding: [Path.ONBOARDING],
};

function Workspace({ workspaces, goTo }) {
  if (workspaces.length === 0) {
    return (
      <div className="h-100 d-flex justify-content-center">
        <div className="align-self-center text-center">
          <img src="/images/icons/conversation.svg" alt="skill-icon" width="160" height="105" className="mb-1" />
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
          <Button id="createWorkspace" isPrimary className="mt-4" onClick={() => goTo('workspace/new')}>
            New Workspace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <PrivateRoute exact path={[Path.WORKSPACE_TEMPLATE, `${Path.WORKSPACE_TEMPLATE}/:listID`]} component={NewProject} />
      <PrivateRoute exact path={[`${Path.WORKSPACE}/:workspaceID/api-keys`]} component={APIKeys} />
      <PrivateRoute exact path={[`${Path.WORKSPACE}/:workspaceID`, Path.DASHBOARD]} component={Dashboard} />
    </Switch>
  );
}

const mapStateToProps = {
  workspaces: allWorkspacesSelector,
};

const mapDispatchToProps = {
  goTo,
};

export default compose(
  withBatchLoadingGate([
    WorkspacesLoadingGate,
    ({ location }) => {
      const { activePage, activePageMatch } = getActivePageAndMatch(PAGES_MATCHES, location.pathname);

      return {
        urlWorkspaceID: activePageMatch?.params?.workspaceID,
        activePage,
      };
    },
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(Workspace);
