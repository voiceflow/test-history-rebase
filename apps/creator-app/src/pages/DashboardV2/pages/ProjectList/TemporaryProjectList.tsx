import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import TrialExpiredPage from '@/components/TrialExpiredPage';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';

import ProjectList from '.';
import { KanbanList } from './components';

const TemporaryProjectList: React.FC = () => {
  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);
  const proReverseTrial = useFeature(Realtime.FeatureFlag.PRO_REVERSE_TRIAL);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const showLockScreen = proReverseTrial.isEnabled && isTrialExpired && !isEnterprise;

  const dashboardKanban = useSelector(WorkspaceV2.active.dashboardKanbanSettingsSelector);

  return dashboardKanban ? (
    <>
      {showLockScreen && <TrialExpiredPage />}
      <KanbanList />
    </>
  ) : (
    <ProjectList showLockScreen={showLockScreen} />
  );
};

export default TemporaryProjectList;
