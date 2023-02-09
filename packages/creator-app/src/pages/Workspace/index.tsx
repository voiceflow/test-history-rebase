import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { conversationGraphic } from '@/assets';
import { LegacyPath, Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { CheckInvitationGate } from '@/gates';
import { lazy } from '@/hocs/lazy';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { withWorkspaceOrProjectAssetsSuspense } from '@/hocs/withWorkspaceOrProjectAssetsSuspense';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import RedirectWithSearch from '@/Routes/RedirectWithSearch';

const Settings = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/Workspace/Settings')));
const DashboardV1 = lazy(() => import('@/pages/Dashboard'));
const DashboardV2 = withWorkspaceOrProjectAssetsSuspense(lazy(() => import('@/pages/DashboardV2')));

const Workspace: React.FC = () => {
  const dashboardV2 = useFeature(Realtime.FeatureFlag.DASHBOARD_V2)?.isEnabled;
  const workspaceIDs = useSelector(WorkspaceV2.allWorkspaceIDsSelector);
  const dashboardV2FF = useFeature(Realtime.FeatureFlag.DASHBOARD_V2);

  const goToNewWorkspace = useDispatch(Router.goToNewWorkspace);
  const DashboardComponent = dashboardV2FF.isEnabled ? DashboardV2 : DashboardV1;

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
          <Button id="createWorkspace" variant={ButtonVariant.PRIMARY} className="mt-4 margin-auto" onClick={goToNewWorkspace}>
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

      {!dashboardV2 && <Route path={Path.WORKSPACE_SETTINGS} component={Settings} />}
      <Route path={[Path.WORKSPACE_DASHBOARD, Path.DASHBOARD]} component={DashboardComponent} />

      <RedirectWithSearch to={Path.DASHBOARD} />
    </Switch>
  );
};

export default withBatchLoadingGate(CheckInvitationGate)(Workspace);
