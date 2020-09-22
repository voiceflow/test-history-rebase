import React from 'react';
import { Switch } from 'react-router-dom';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Button from '@/components/LegacyButton';
import { Path } from '@/config/routes';
import { goToOnboarding } from '@/ducks/router';
import { allWorkspacesSelector } from '@/ducks/workspace';
import { WorkspacesLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import Dashboard from '@/pages/Dashboard';
import NewProject from '@/pages/NewProject';
import { getActivePageAndMatch } from '@/utils/routes';

const PAGES_MATCHES = {
  template: [Path.WORKSPACE_TEMPLATE, `${Path.WORKSPACE_TEMPLATE}/:workspaceID`],
  dashboard: [`${Path.WORKSPACE}/:workspaceID`, Path.DASHBOARD],
  onboarding: [Path.ONBOARDING],
};

function Workspace({ workspaces, goToOnboarding }) {
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
          <Button id="createWorkspace" isPrimary className="mt-4" onClick={goToOnboarding}>
            New Workspace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <PrivateRoute exact path={[Path.WORKSPACE_TEMPLATE, `${Path.WORKSPACE_TEMPLATE}/:listID`]} component={NewProject} />
      <PrivateRoute exact path={[`${Path.WORKSPACE}/:workspaceID`, Path.DASHBOARD]} component={Dashboard} />
    </Switch>
  );
}

const mapStateToProps = {
  workspaces: allWorkspacesSelector,
};

const mapDispatchToProps = {
  goToOnboarding,
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
