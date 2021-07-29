import { LegacyButton } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { conversationGraphic } from '@/assets';
import { FeatureFlag } from '@/config/features';
import { LegacyPath, Path } from '@/config/routes';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Router from '@/ducks/router';
import * as WorkspaceDuck from '@/ducks/workspace';
import { CheckInvitationGate, WorkspaceLoadingGate, WorkspacesLoadingGate } from '@/gates';
import { lazy, withBatchLoadingGate } from '@/hocs';
import { useDispatch, useFeature, useRealtimeSelector, useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const Settings = lazy(() => import('@/pages/Workspace/Settings'));
const NewProject = lazy(() => import('@/pages/NewProject'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

const Workspace: React.FC = () => {
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);

  const personalWorkspaceIDsV1 = useSelector(WorkspaceDuck.personalWorkspaceIDsSelector);
  const personalWorkspaceIDsRealtime = useRealtimeSelector(RealtimeWorkspace.personalWorkspaceIDsSelector);

  const personalWorkspaceIDs = atomicActions.isEnabled ? personalWorkspaceIDsRealtime : personalWorkspaceIDsV1;

  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);

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
          <LegacyButton id="createWorkspace" isPrimary className="mt-4" onClick={goToNewWorkspace}>
            New Workspace
          </LegacyButton>
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

export default withBatchLoadingGate(CheckInvitationGate, WorkspacesLoadingGate, WorkspaceLoadingGate)(Workspace);
