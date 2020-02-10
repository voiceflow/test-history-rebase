import React from 'react';
import { Link, Switch } from 'react-router-dom';
import { compose } from 'recompose';

import PrivateRoute from '@/Routes/PrivateRoute';
import Button from '@/components/LegacyButton';
import { allWorkspacesSelector } from '@/ducks/workspace';
import { WorkspacesLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import Dashboard from '@/pages/Dashboard';
import Onboarding from '@/pages/Onboarding';
import Templates from '@/pages/Templates';
import { getActivePageAndMatch } from '@/utils/routes';

const PAGES_MATCHES = {
  template: ['/workspace/template', '/workspace/template/:workspaceID'],
  dashboard: ['/workspace/:workspaceID', '/dashboard'],
  onboarding: ['/onboarding'],
};

function Workspace({ workspaces }) {
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
          <Link to="/workspace/new" className="no-underline">
            <Button isPrimary className="mt-4">
              New Workspace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <PrivateRoute exact path={['/workspace/template', '/workspace/template/:listID']} component={Templates} />
      <PrivateRoute exact path={['/workspace/:workspaceID', '/dashboard']} component={Dashboard} />
      <PrivateRoute exact path="/onboarding" component={Onboarding} />
    </Switch>
  );
}

const mapStateToProps = {
  workspaces: allWorkspacesSelector,
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
  connect(mapStateToProps)
)(Workspace);
